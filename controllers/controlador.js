const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const watch = require('watch');
const moment = require("moment");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const SECRET = process.env.JWT_SECRET;

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const controller = {};

const formatDate = (value) => {
  if (!value) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toISOString().substring(0, 10);
};

const formatCurrency = (value) => {
  const amount = Number(value || 0);

  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  }).format(amount);
};

const formatTime = (value, withSeconds = false) => {
  if (!value) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return withSeconds
    ? date.toISOString().substring(11, 19)
    : date.toISOString().substring(11, 16);
};

const fullName = (person = {}) =>
  [person.nombres, person.apellidos].filter(Boolean).join(" ").trim();

const buildPdfFilename = (empresa, trabajador, solicitudId) => {
  const companyName = (empresa?.nombre || "empresa")
    .replace(/[^a-z0-9]+/gi, "-")
    .replace(/^-+|-+$/g, "");
  const workerName = fullName(trabajador)
    .replace(/[^a-z0-9]+/gi, "-")
    .replace(/^-+|-+$/g, "");

  return `contrato-solicitud-${solicitudId}-${companyName || "empresa"}-${workerName || "trabajador"}.pdf`;
};

const drawSignatureLines = (doc, employerRut, workerRut) => {
  doc.moveDown(3);

  const startY = doc.y;
  const lineWidth = 190;
  const gap = 90;
  const leftX = doc.page.margins.left;
  const rightX = leftX + lineWidth + gap;

  doc
    .moveTo(leftX, startY)
    .lineTo(leftX + lineWidth, startY)
    .stroke();

  doc
    .moveTo(rightX, startY)
    .lineTo(rightX + lineWidth, startY)
    .stroke();

  doc
    .font("Helvetica")
    .fontSize(10)
    .text(`Firma del Empleador${employerRut ? ` / ${employerRut}` : ""}`, leftX, startY + 8, {
      width: lineWidth,
      align: "center",
    })
    .text(`Firma del Trabajador${workerRut ? ` / ${workerRut}` : ""}`, rightX, startY + 8, {
      width: lineWidth,
      align: "center",
    });
};

const addParagraph = (doc, text, options = {}) => {
  doc
    .font(options.font || "Helvetica")
    .fontSize(options.fontSize || 11)
    .text(text, {
      align: options.align || "justify",
      lineGap: options.lineGap || 4,
    });

  doc.moveDown(options.spacing || 0.8);
};

const addClauseTitle = (doc, title) => {
  doc
    .font("Helvetica-Bold")
    .fontSize(11)
    .text(title, {
      align: "left",
    });
};

//-------------------------------------------- LOGIN --------------------------------------------

// CREAR USUARIO
controller.crear_usuario = async (req, res) => {
  try {
    const { nombre, email, contrasena } = req.body;

    if (!email || !contrasena) {
      return res.status(400).json({ error: "Faltan datos" });
    }

    const hashedPassword = await bcrypt.hash(contrasena, 10);

    const rolPorDefecto = await prisma.rol.findFirst({
      where: { nombre: "Usuario" }
    });

    const newUser = await prisma.usuario.create({
      data: {
        nombre,
        email,
        contrasena: hashedPassword, // 🔐 ahora cifrada
        rolId: rolPorDefecto.id,
      }
    });

    res.status(201).json(newUser);

  } catch (error) {
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Controlador realizar login con JWT
controller.login = async (req, res) => {
  const { email, contrasena } = req.body;

  try {
    const user = await prisma.usuario.findUnique({
      where: { email }
    });

    if (!user) {
      return res.status(401).json({ error: "Credenciales incorrectas" });
    }

    const passwordMatch = await bcrypt.compare(contrasena, user.contrasena);

    if (!passwordMatch) {
      return res.status(401).json({ error: "Credenciales incorrectas" });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      SECRET,
      { expiresIn: "2h" }
    );

    res
      .cookie("token", token, {
        httpOnly: true,
        secure: false, // true en producción (https)
        sameSite: "lax",
        maxAge: 2 * 60 * 60 * 1000 // 2 horas
      })
      .json({
        user: {
          id: user.id,
          email: user.email,
          nombre: user.nombre
        }
      });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error en el servidor" });
  }
};

controller.logout = (req, res) => {
  res.clearCookie("token").json({ message: "Sesión cerrada" });
};

controller.getMe = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        nombre: true,
        email: true,
      },
    });

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.json({ user });
  } catch (error) {
    console.error("Error en getMe:", error);
    res.status(500).json({ message: "Error al obtener usuario" });
  }
};

//-------------------------------------------- Trabajador --------------------------------------------

//Obtengo datos para mostrarlos en el form de trabajadores
controller.getCatalogos = async (req, res) => {
  try {
    const [
      comunas,
      estadosCiviles,
      previsiones,
      afiliaciones,
      cargos
    ] = await Promise.all([
      prisma.comuna.findMany({ select: { id: true, nombre: true } }),
      prisma.estadoCivil.findMany({ select: { id: true, nombre: true } }),
      prisma.previsionSalud.findMany({ select: { id: true, nombre: true } }),
      prisma.afiliacion.findMany({ select: { id: true, nombre: true } }),
      prisma.cargo.findMany({
        select: {
          id: true,
          nombre: true,
          area: { select: { nombre: true } }
        }
      }),
    ]);

    res.json({
      comunas,
      estadosCiviles,
      previsiones,
      afiliaciones,
      cargos
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener catálogos" });
  }
};

//Crea trabajadores
controller.crear_trabajador = async (req, res) => {
  try {
    const {
      nombres,
      apellidos,
      rut,
      direccion,
      fechaNacimiento,
      comunaId,
      estadoCivilId,
      previsionId,
      afiliacionId,
      cargoPrincipalId,
    } = req.body;

    console.log(req.body);

    // 🔹 Validación básica
    if (!nombres || !apellidos || !rut || !fechaNacimiento || !comunaId || !estadoCivilId || !previsionId || !afiliacionId)  {
      return res.status(400).json({ error: "Faltan datos obligatorios" });
    }

    const nuevoTrabajador = await prisma.trabajador.create({
      data: {
        nombres,
        apellidos,
        rut,
        direccion,
        fechaNacimiento: new Date(fechaNacimiento),

        comunaId: Number(comunaId),
        estadoCivilId: Number(estadoCivilId),
        previsionId: Number(previsionId),
        afiliacionId: Number(afiliacionId),
        cargoPrincipalId: cargoPrincipalId || null
      },
    });

    res.status(201).json(nuevoTrabajador);

  } catch (error) {
    console.error("Error al crear trabajador:", error);

    // 🔹 Error típico: RUT duplicado
    if (error.code === "P2002") {
      return res.status(400).json({ error: "El RUT ya existe" });
    }

    res.status(500).json({ error: "Error interno del servidor" });
  }
};

//Obtengo los trabajadores para mostrarlo en el apartado de Workers
controller.getTrabajadores = async (req, res) => {
  try {
    const trabajadores = await prisma.trabajador.findMany({
      include: {
        comuna: true,
        estadoCivil: true,
        prevision: true,
        afiliacion: true,
        cargoPrincipal: {
          include:{
            area: true
          }
        }
      },
    });

    res.json(trabajadores);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener trabajadores" });
  }
};

controller.getDashboardResumen = async (req, res) => {
  try {
    const [estado1Count, estado2Count, recentAssignments] = await Promise.all([
      prisma.solicitud.count({
        where: {
          estadoId: 1,
        },
      }),
      prisma.solicitud.count({
        where: {
          estadoId: 2,
        },
      }),
      prisma.asignacionTrabajador.findMany({
        take: 12,
        orderBy: {
          id: "desc",
        },
        include: {
          trabajador: {
            include: {
              comuna: true,
              cargoPrincipal: {
                include: {
                  area: true,
                },
              },
            },
          },
          solicitudDetalle: {
            include: {
              cargo: true,
              solicitud: {
                include: {
                  empresa: true,
                },
              },
            },
          },
        },
      }),
    ]);

    const seenWorkers = new Set();
    const trabajadoresRecientes = [];

    for (const assignment of recentAssignments) {
      if (seenWorkers.has(assignment.trabajadorId)) {
        continue;
      }

      seenWorkers.add(assignment.trabajadorId);

      trabajadoresRecientes.push({
        id: assignment.trabajador.id,
        nombres: assignment.trabajador.nombres,
        apellidos: assignment.trabajador.apellidos,
        comuna: assignment.trabajador.comuna?.nombre || null,
        cargo:
          assignment.solicitudDetalle?.cargo?.nombre ||
          assignment.trabajador.cargoPrincipal?.nombre ||
          null,
        area: assignment.trabajador.cargoPrincipal?.area?.nombre || null,
        solicitudId: assignment.solicitudDetalle?.solicitud?.id || null,
        empresa: assignment.solicitudDetalle?.solicitud?.empresa?.nombre || null,
      });

      if (trabajadoresRecientes.length === 5) {
        break;
      }
    }

    res.json({
      solicitudesPorEstado: {
        1: estado1Count,
        2: estado2Count,
      },
      trabajadoresRecientes,
    });
  } catch (error) {
    console.error("Error obteniendo resumen del dashboard:", error);
    res.status(500).json({ error: "Error al obtener resumen del dashboard" });
  }
};

controller.getTrabajadorById = async (req, res) => {
  const { id } = req.params;

  try {
    const trabajador = await prisma.trabajador.findUnique({
      where: {
        id: Number(id),
      },
      include: {
        comuna: true,
        estadoCivil: true,
        prevision: true,
        afiliacion: true,
        cargoPrincipal: {
          include: {
            area: true,
          },
        },
      },
    });

    if (!trabajador) {
      return res.status(404).json({ error: "Trabajador no encontrado" });
    }

    res.json(trabajador);
  } catch (error) {
    console.error("Error al obtener trabajador:", error);
    res.status(500).json({ error: "Error al obtener trabajador" });
  }
};

controller.actualizar_trabajador = async (req, res) => {
  const { id } = req.params;

  try {
    const {
      nombres,
      apellidos,
      rut,
      direccion,
      fechaNacimiento,
      comunaId,
      estadoCivilId,
      previsionId,
      afiliacionId,
      cargoPrincipalId,
    } = req.body;

    if (
      !nombres ||
      !apellidos ||
      !rut ||
      !fechaNacimiento ||
      !comunaId ||
      !estadoCivilId ||
      !previsionId ||
      !afiliacionId
    ) {
      return res.status(400).json({ error: "Faltan datos obligatorios" });
    }

    const trabajadorExiste = await prisma.trabajador.findUnique({
      where: {
        id: Number(id),
      },
      select: {
        id: true,
      },
    });

    if (!trabajadorExiste) {
      return res.status(404).json({ error: "Trabajador no encontrado" });
    }

    const trabajadorActualizado = await prisma.trabajador.update({
      where: {
        id: Number(id),
      },
      data: {
        nombres,
        apellidos,
        rut,
        direccion,
        fechaNacimiento: new Date(fechaNacimiento),
        comunaId: Number(comunaId),
        estadoCivilId: Number(estadoCivilId),
        previsionId: Number(previsionId),
        afiliacionId: Number(afiliacionId),
        cargoPrincipalId: cargoPrincipalId ? Number(cargoPrincipalId) : null,
      },
      include: {
        comuna: true,
        estadoCivil: true,
        prevision: true,
        afiliacion: true,
        cargoPrincipal: {
          include: {
            area: true,
          },
        },
      },
    });

    res.json(trabajadorActualizado);
  } catch (error) {
    console.error("Error al actualizar trabajador:", error);

    if (error.code === "P2002") {
      return res.status(400).json({ error: "El RUT ya existe" });
    }

    res.status(500).json({ error: "Error interno del servidor" });
  }
};

//--------------------------SOLICITUD----------------------------------

//Traigo registros de la bd para mostrarlos en el formulario
controller.getCatalogosSolicitud = async (req, res) => {
  try {
    const [estados, empresas, cargos, turnos, tarifas] = await Promise.all([
      prisma.estadoSolicitud.findMany({
        select: { id: true, nombre: true }
      }),
      prisma.empresa.findMany({
        select: { id: true, nombre: true }
      }),

      // 🔥 NUEVO
      prisma.cargo.findMany({
        select: {
          id: true,
          nombre: true,
        },
        orderBy: { nombre: "asc" }
      }),

      prisma.turno.findMany({
        select: {
          id: true,
          inicio: true,
          fin: true,
        }
      }).then(turnos =>
        turnos.map(t => ({
          ...t,
          label: `${t.inicio.toISOString().substring(11,16)} - ${t.fin.toISOString().substring(11,16)}`
        }))
      ),

      prisma.tarifa.findMany({
        select: {
          id: true,
          cargoId: true,
          turnoId: true,
          valorHora: true,
        }
      }),
    ]);

    res.json({
      estados,
      empresas,
      cargos,
      turnos,
      tarifas,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Error al obtener catálogos de solicitud"
    });
  }
};

//Obtengo la tarifa basado en el cargo y turno, esto es para la vista de crear solicitud y realizar calculos de tarifas
controller.getTarifa = async (req, res) => {
  try {
    const { cargoId, turnoId } = req.query;

    const tarifa = await prisma.tarifa.findFirst({
      where: {
        cargoId: Number(cargoId),
        turnoId: Number(turnoId),
      },
      select: {
        id: true,
        valorHora: true
      }
    });

    res.json(tarifa);

  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Error al obtener tarifa"
    });
  }
};

controller.crear_solicitud = async (req, res) => {
  try {
    const {
      fechaInicio,
      fechaFin,
      comentario,
      estadoId,
      creadorId,
      aprobadorId,
      empresaId,
      trabajadores,
    } = req.body;

    console.log("BODY:", req.body);

    // =========================
    // 🔴 VALIDACIONES CABECERA
    // =========================

    if (!fechaInicio || !fechaFin || !estadoId || !creadorId || !empresaId) {
      return res.status(400).json({
        error: "Faltan datos obligatorios",
      });
    }

    const fechaInicioParsed = new Date(fechaInicio);
    const fechaFinParsed = new Date(fechaFin);

    if (isNaN(fechaInicioParsed) || isNaN(fechaFinParsed)) {
      return res.status(400).json({
        error: "Formato de fecha inválido",
      });
    }

    if (fechaFinParsed < fechaInicioParsed) {
      return res.status(400).json({
        error: "La fecha de término no puede ser menor a la de inicio",
      });
    }

    // =========================
    // 🔴 VALIDACIÓN DETALLE
    // =========================

    if (!trabajadores || !Array.isArray(trabajadores) || !trabajadores.length) {
      return res.status(400).json({
        error: "Debe incluir al menos un trabajador",
      });
    }

    for (const t of trabajadores) {
      if (!t.cargoId || !t.turnoId || !t.cantidad) {
        return res.status(400).json({
          error: "Datos incompletos en trabajadores",
        });
      }
    }

    // =========================
    // 🔥 OBTENER TARIFAS + TURNOS
    // =========================

    const tarifasDB = await prisma.tarifa.findMany({
      where: {
        OR: trabajadores.map(t => ({
          cargoId: Number(t.cargoId),
          turnoId: Number(t.turnoId),
        })),
      },
      include: {
        turno: {
          select: {
            duracionHoras: true,
          },
        },
      },
    });

    // =========================
    // 🔥 MAPA DE TARIFAS
    // =========================

    const tarifaMap = new Map();

    tarifasDB.forEach(t => {
      const key = `${t.cargoId}-${t.turnoId}`;
      tarifaMap.set(key, t);
    });

    // =========================
    // 🔥 PROCESAR TRABAJADORES
    // =========================

    const trabajadoresProcesados = trabajadores.map(t => {
      const key = `${Number(t.cargoId)}-${Number(t.turnoId)}`;
      const tarifa = tarifaMap.get(key);

      if (!tarifa) {
        throw new Error(
          `No existe tarifa para cargo ${t.cargoId} y turno ${t.turnoId}`
        );
      }

      if (!tarifa.turno?.duracionHoras) {
        throw new Error(
          `El turno ${t.turnoId} no tiene duración definida`
        );
      }

      const cantidad = Number(t.cantidad);

      // ✅ monto por trabajador
      const montoUnitario =
        tarifa.valorHora * tarifa.turno.duracionHoras;

      return {
        cargoId: Number(t.cargoId),
        turnoId: Number(t.turnoId),
        cantidad,

        montoUnitario, // 🔥 SE GUARDA AQUÍ

        tarifaId: tarifa.id,
      };
    });

    // =========================
    // 🔥 CALCULAR TOTAL SOLICITUD
    // =========================

    const montoTotalCalculado = trabajadoresProcesados.reduce((acc, t) => {
      return acc + (t.cantidad * t.montoUnitario);
    }, 0);

    // =========================
    // 🔥 CREATE FINAL
    // =========================

    const nuevaSolicitud = await prisma.solicitud.create({
      data: {
        fechaInicio: fechaInicioParsed,
        fechaFin: fechaFinParsed,
        comentario: comentario || null,

        montoTotal: montoTotalCalculado, // 🔥 SE GUARDA AQUÍ

        estadoId: Number(estadoId),
        creadorId: Number(creadorId),
        empresaId: Number(empresaId),
        aprobadorId: aprobadorId ? Number(aprobadorId) : null,

        trabajadores: {
          create: trabajadoresProcesados,
        },
      },
      include: {
        estado: true,
        creador: true,
        aprobador: true,
        empresa: true,
        trabajadores: true,
      },
    });

    res.status(201).json(nuevaSolicitud);

  } catch (error) {
    console.error("Error al crear solicitud completa:", error);

    if (error.message?.includes("No existe tarifa")) {
      return res.status(400).json({
        error: error.message,
      });
    }

    if (error.message?.includes("no tiene duración")) {
      return res.status(400).json({
        error: error.message,
      });
    }

    if (error.code === "P2003") {
      return res.status(400).json({
        error:
          "Relación inválida (estado, usuario, empresa, cargo o turno no existe)",
      });
    }

    res.status(500).json({
      error: "Error interno del servidor",
    });
  }
};

controller.getSolicitudes = async (req, res) => {
  try {
    const solicitudes = await prisma.solicitud.findMany({
      include: {
        estado: true,
      },
      orderBy: {
        id: "desc",
      },
    });

    const formatted = solicitudes.map((s) => ({
      id: s.id,
      comentario: s.comentario,
      monto: s.montoTotal,           // 🔥 mapeo
      fecha: s.fechaInicio,          // 🔥 mapeo
      estadoId: s.estadoId,
      estado: s.estado,
    }));

    res.json(formatted);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener solicitudes" });
  }
};

controller.getSolicitudById = async (req, res) => {
  const { id } = req.params;

  try {
    const solicitud = await prisma.solicitud.findUnique({
      where: {
        id: Number(id),
      },
      include: {
        estado: true,
        empresa: true,
        creador: true,
        aprobador: true, // 🔥 opcional pero MUY útil

        trabajadores: {
          include: {
            cargo: true,
            turno: true,
            tarifa: {
              include: {
                turno: true,
              },
            },
            asignaciones: {
              include: {
                trabajador: {
                  include: {
                    comuna: true,
                    cargoPrincipal: {
                      include: {
                        area: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },

        // 🔥 AQUÍ ESTÁ LA CLAVE
        HistorialSolicitud: {
          include: {
            usuario: true,
            estado: true,
          },
          orderBy: {
            fecha: "asc", // o "desc" si quieres el más reciente arriba
          },
        },
      },
    });

    if (!solicitud) {
      return res.status(404).json({
        message: "Solicitud no encontrada",
      });
    }

    res.json(solicitud);
  } catch (error) {
    console.error("ERROR GET SOLICITUD:", error);
    res.status(500).json({
      message: "Error interno del servidor",
    });
  }
};

controller.getTrabajadoresDisponiblesParaDetalle = async (req, res) => {
  const { id, detalleId } = req.params;

  try {
    const detalle = await prisma.solicitudTrabajador.findFirst({
      where: {
        id: Number(detalleId),
        solicitudId: Number(id),
      },
      include: {
        solicitud: {
          select: {
            id: true,
            fechaInicio: true,
            fechaFin: true,
          },
        },
        cargo: {
          select: {
            id: true,
            nombre: true,
          },
        },
        asignaciones: {
          select: {
            trabajadorId: true,
          },
        },
      },
    });

    if (!detalle) {
      return res.status(404).json({ error: "Detalle no encontrado" });
    }

    const trabajadoresConCargo = await prisma.trabajador.findMany({
      where: {
        cargoPrincipalId: detalle.cargoId,
      },
      include: {
        comuna: {
          select: {
            nombre: true,
          },
        },
        cargoPrincipal: {
          include: {
            area: {
              select: {
                nombre: true,
              },
            },
          },
        },
      },
      orderBy: [
        { nombres: "asc" },
        { apellidos: "asc" },
      ],
    });

    const trabajadoresYaAsignadosIds = detalle.asignaciones.map(
      (asignacion) => asignacion.trabajadorId
    );

    const asignacionesOcupadas = await prisma.asignacionTrabajador.findMany({
      where: {
        trabajadorId: {
          in: trabajadoresConCargo.map((trabajador) => trabajador.id),
        },
        solicitudTrabajadorId: {
          not: detalle.id,
        },
        solicitudDetalle: {
          solicitud: {
            fechaInicio: {
              lte: detalle.solicitud.fechaFin,
            },
            fechaFin: {
              gte: detalle.solicitud.fechaInicio,
            },
            estado: {
              nombre: {
                notIn: ["Rechazada", "Cancelada"],
              },
            },
          },
        },
      },
      select: {
        trabajadorId: true,
      },
    });

    const trabajadoresOcupadosIds = new Set(
      asignacionesOcupadas.map((asignacion) => asignacion.trabajadorId)
    );

    const disponibles = trabajadoresConCargo.filter((trabajador) => {
      if (trabajadoresYaAsignadosIds.includes(trabajador.id)) {
        return false;
      }

      return !trabajadoresOcupadosIds.has(trabajador.id);
    });

    res.json({
      detalleId: detalle.id,
      cargo: detalle.cargo,
      cantidadRequerida: detalle.cantidad,
      asignadosActuales: trabajadoresYaAsignadosIds.length,
      cuposDisponibles:
        detalle.cantidad - trabajadoresYaAsignadosIds.length,
      trabajadores: disponibles,
    });
  } catch (error) {
    console.error("Error obteniendo trabajadores disponibles:", error);
    res.status(500).json({
      error: "Error al obtener trabajadores disponibles",
    });
  }
};

controller.asignarTrabajadoresADetalle = async (req, res) => {
  const { id, detalleId } = req.params;
  const { trabajadorIds } = req.body;

  try {
    if (!Array.isArray(trabajadorIds) || !trabajadorIds.length) {
      return res.status(400).json({
        error: "Debe enviar al menos un trabajador",
      });
    }

    const trabajadoresIdsNormalizados = [
      ...new Set(
        trabajadorIds
          .map((trabajadorId) => Number(trabajadorId))
          .filter((trabajadorId) => !Number.isNaN(trabajadorId))
      ),
    ];

    const detalle = await prisma.solicitudTrabajador.findFirst({
      where: {
        id: Number(detalleId),
        solicitudId: Number(id),
      },
      include: {
        solicitud: {
          include: {
            estado: {
              select: {
                nombre: true,
              },
            },
          },
        },
        asignaciones: {
          select: {
            trabajadorId: true,
          },
        },
      },
    });

    if (!detalle) {
      return res.status(404).json({ error: "Detalle no encontrado" });
    }

    if (["Rechazada", "Cancelada"].includes(detalle.solicitud.estado?.nombre)) {
      return res.status(400).json({
        error: "No se pueden asignar trabajadores a una solicitud cerrada",
      });
    }

    const cuposRestantes = detalle.cantidad - detalle.asignaciones.length;

    if (cuposRestantes <= 0) {
      return res.status(400).json({
        error: "Este detalle ya tiene todos los trabajadores asignados",
      });
    }

    if (trabajadoresIdsNormalizados.length > cuposRestantes) {
      return res.status(400).json({
        error: `Solo quedan ${cuposRestantes} cupos disponibles`,
      });
    }

    const trabajadores = await prisma.trabajador.findMany({
      where: {
        id: {
          in: trabajadoresIdsNormalizados,
        },
      },
      select: {
        id: true,
        cargoPrincipalId: true,
      },
    });

    if (trabajadores.length !== trabajadoresIdsNormalizados.length) {
      return res.status(400).json({
        error: "Uno o más trabajadores no existen",
      });
    }

    const trabajadoresConCargoInvalido = trabajadores.filter(
      (trabajador) => trabajador.cargoPrincipalId !== detalle.cargoId
    );

    if (trabajadoresConCargoInvalido.length) {
      return res.status(400).json({
        error: "Uno o más trabajadores no corresponden al cargo requerido",
      });
    }

    const trabajadoresYaEnDetalle = new Set(
      detalle.asignaciones.map((asignacion) => asignacion.trabajadorId)
    );

    const trabajadorDuplicado = trabajadoresIdsNormalizados.find(
      (trabajadorId) => trabajadoresYaEnDetalle.has(trabajadorId)
    );

    if (trabajadorDuplicado) {
      return res.status(400).json({
        error: "Uno de los trabajadores ya está asignado a este detalle",
      });
    }

    const conflictos = await prisma.asignacionTrabajador.findMany({
      where: {
        trabajadorId: {
          in: trabajadoresIdsNormalizados,
        },
        solicitudTrabajadorId: {
          not: detalle.id,
        },
        solicitudDetalle: {
          solicitud: {
            fechaInicio: {
              lte: detalle.solicitud.fechaFin,
            },
            fechaFin: {
              gte: detalle.solicitud.fechaInicio,
            },
            estado: {
              nombre: {
                notIn: ["Rechazada", "Cancelada"],
              },
            },
          },
        },
      },
      include: {
        trabajador: {
          select: {
            nombres: true,
            apellidos: true,
          },
        },
      },
    });

    if (conflictos.length) {
      const nombres = conflictos
        .map(
          (conflicto) =>
            `${conflicto.trabajador.nombres} ${conflicto.trabajador.apellidos}`
        )
        .join(", ");

      return res.status(400).json({
        error: `Estos trabajadores ya están ocupados en ese rango: ${nombres}`,
      });
    }

    await prisma.$transaction(
      trabajadoresIdsNormalizados.map((trabajadorId) =>
        prisma.asignacionTrabajador.create({
          data: {
            solicitudTrabajadorId: detalle.id,
            trabajadorId,
          },
        })
      )
    );

    const detalleActualizado = await prisma.solicitudTrabajador.findUnique({
      where: {
        id: detalle.id,
      },
      include: {
        asignaciones: {
          include: {
            trabajador: {
              include: {
                comuna: true,
                cargoPrincipal: {
                  include: {
                    area: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    res.status(201).json({
      message: "Trabajadores asignados correctamente",
      detalle: detalleActualizado,
    });
  } catch (error) {
    console.error("Error asignando trabajadores:", error);

    if (error.code === "P2002") {
      return res.status(400).json({
        error: "Uno de los trabajadores ya estaba asignado",
      });
    }

    res.status(500).json({
      error: "Error al asignar trabajadores",
    });
  }
};

controller.updateEstadoSolicitud = async (req, res) => {
  const { id } = req.params;
  const { estadoId } = req.body;

  try {
    // 🔹 validar que venga estadoId
    if (!estadoId) {
      return res.status(400).json({ error: "estadoId es requerido" });
    }

    // 🔹 validar que el estado exista
    const estadoExiste = await prisma.estadoSolicitud.findUnique({
      where: { id: Number(estadoId) },
    });

    if (!estadoExiste) {
      return res.status(400).json({ error: "Estado no válido" });
    }

    // 🔥 transacción
    const result = await prisma.$transaction(async (tx) => {

      // 1. actualizar solicitud
      const solicitud = await tx.solicitud.update({
        where: { id: Number(id) },
        data: {
          estadoId: Number(estadoId),
          aprobadorId: req.user?.id || null,
        },
        include: {
          estado: true,
        },
      });

      // 2. guardar historial
      await tx.historialSolicitud.create({
        data: {
          solicitudId: solicitud.id,
          estadoId: Number(estadoId),
          usuarioId: req.user?.id || 1,
        },
      });

      return solicitud;
    });

    res.json(result);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error actualizando estado" });
  }
};

controller.generarContratoPdf = async (req, res) => {
  const { id, asignacionId } = req.params;

  try {
    const asignacion = await prisma.asignacionTrabajador.findFirst({
      where: {
        id: Number(asignacionId),
        solicitudDetalle: {
          solicitudId: Number(id),
        },
      },
      include: {
        trabajador: {
          include: {
            comuna: true,
            estadoCivil: true,
            prevision: true,
            afiliacion: true,
            cargoPrincipal: {
              include: {
                area: true,
              },
            },
          },
        },
        solicitudDetalle: {
          include: {
            cargo: true,
            turno: true,
            tarifa: {
              include: {
                turno: true,
              },
            },
            solicitud: {
              include: {
                empresa: {
                  include: {
                    comuna: true,
                    representanteLegal: true,
                  },
                },
              },
            },
          },
        },
        contrato: true,
      },
    });

    if (!asignacion) {
      return res.status(404).json({
        error: "Asignación no encontrada para la solicitud indicada",
      });
    }

    const { trabajador, solicitudDetalle, contrato } = asignacion;
    const { solicitud, cargo, turno, tarifa } = solicitudDetalle;
    const empresa = solicitud.empresa;
    const representante = empresa?.representanteLegal;
    const turnoDocumento = turno || tarifa?.turno;

    const fechaInicio = contrato?.fechaInicio || solicitud.fechaInicio;
    const fechaFin = contrato?.fechaFin || solicitud.fechaFin;
    const horaInicio = formatTime(turnoDocumento?.inicio, true);
    const horaFin = formatTime(turnoDocumento?.fin, true);
    const horaInicioCorta = formatTime(turnoDocumento?.inicio);
    const horaFinCorta = formatTime(turnoDocumento?.fin);
    const montoBase = contrato?.monto || solicitudDetalle.montoUnitario || 0;
    const gratificacion = Math.round(montoBase * 0.25);
    const totalPago = montoBase + gratificacion;
    const trabajadorNombre = fullName(trabajador);
    const representanteNombre = fullName(representante);
    const cargoNombre =
      cargo?.nombre || trabajador?.cargoPrincipal?.nombre || "sin cargo asignado";
    const ciudadFirma = empresa?.comuna?.nombre || trabajador?.comuna?.nombre || "N/A";
    const nombreArchivo = buildPdfFilename(empresa, trabajador, solicitud.id);

    const doc = new PDFDocument({
      size: "A4",
      margin: 50,
      info: {
        Title: `Contrato solicitud ${solicitud.id}`,
        Author: "Gestor Contratos Diarios",
      },
    });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `inline; filename="${nombreArchivo}"`);

    doc.pipe(res);

    doc.font("Helvetica-Bold").fontSize(16).text("CONTRATO DE TRABAJO", {
      align: "center",
    });
    doc.font("Helvetica-Bold").fontSize(13).text("POR EVENTO O SERVICIO DETERMINADO", {
      align: "center",
    });
    doc.moveDown(1.2);

    addParagraph(
      doc,
      `En ${ciudadFirma}, ${formatDate(fechaInicio)}, se reunen por una parte don ${representanteNombre || "________________"}, ${representante?.rut || "____________"}, en representacion de la empresa ${empresa?.nombre || "________________"}, ${empresa?.rut || "____________"}, ambos domiciliados en ${empresa?.direccion || "________________"}, ${empresa?.comuna?.nombre || ""}, como empleador y por la otra parte don(a) ${trabajadorNombre || "________________"}, ${trabajador?.rut || "____________"}, estado civil ${trabajador?.estadoCivil?.nombre || "no informado"}, nacido(a) ${formatDate(trabajador?.fechaNacimiento)}, domiciliado(a) en ${trabajador?.direccion || "________________"}, ${trabajador?.comuna?.nombre || ""}, se conviene el siguiente contrato de trabajo que las partes denominan por obra o faena determinada.`
    );

    addParagraph(doc, "Los terminos del contrato individual son:", {
      font: "Helvetica-Bold",
      align: "left",
      spacing: 0.6,
    });

    addClauseTitle(doc, "PRIMERO: DECLARACION:");
    addParagraph(
      doc,
      `El empleador declara que suscribio un contrato de prestacion de servicios, el que se realizara entre los dias ${formatDate(fechaInicio)} hasta el dia ${formatDate(fechaFin)}, ambas fechas inclusive, ello dentro de los siguientes horarios de las ${horaInicio || "__:__:__"} A ${horaFin || "__:__:__"}.`
    );

    addClauseTitle(doc, "SEGUNDO: CONTRATACION:");
    addParagraph(
      doc,
      `Para una adecuada atencion de los clientes senalados en la clausula que antecede, el empleador contrata los servicios del trabajador individualizado para que desempene la labor de ${cargoNombre}.`
    );

    addClauseTitle(doc, "TERCERO: FECHA DE INGRESO:");
    addParagraph(
      doc,
      `Se deja especial constancia que el trabajador ingreso al servicio del empleador el dia ${formatDate(fechaInicio)}.`
    );

    addClauseTitle(doc, "CUARTO: JORNADA DE TRABAJO:");
    addParagraph(
      doc,
      `Atendida la naturaleza de los servicios para el cual ha sido contratado el trabajador, la jornada ordinaria de trabajo sera de ${solicitudDetalle?.turno?.duracionHoras || tarifa?.turno?.duracionHoras || 8} horas diarias, dentro de los dias y turnos pactados para la solicitud, en el horario de ${horaInicioCorta || "__:__"} A ${horaFinCorta || "__:__"}.`
    );

    addClauseTitle(doc, "QUINTO: REMUNERACION:");
    addParagraph(
      doc,
      `El empleador remunerara al trabajador por los servicios prestados en los siguientes terminos: a) sueldo base diario por la suma de ${formatCurrency(montoBase)}; b) una gratificacion del 25% del sueldo base, equivalente a ${formatCurrency(gratificacion)}. La remuneracion sera pagada conforme a la liquidacion que corresponda al periodo trabajado.`
    );

    addClauseTitle(doc, "SEXTO: DESCUENTO PREVISIONAL Y OTROS:");
    addParagraph(
      doc,
      "El empleador deducira de la remuneracion convenida las imposiciones e impuestos que sean de cargo del trabajador. El tiempo no trabajado por inasistencias injustificadas o atrasos no devengara remuneracion y sera reflejado en las respectivas liquidaciones."
    );

    addClauseTitle(doc, "SEPTIMO: CUMPLIMIENTO AL CONTRATO:");
    addParagraph(
      doc,
      "Las partes otorgan a todas las clausulas de este contrato el caracter de esencial, de modo tal que su inobservancia sera considerada falta grave en los terminos que contempla la normativa laboral vigente."
    );

    addClauseTitle(doc, "OCTAVO: VIGENCIA:");
    addParagraph(
      doc,
      `El presente contrato tendra vigencia hasta el termino del evento senalado, esto es, hasta el ${formatDate(fechaFin)}.`
    );

    addClauseTitle(doc, "NOVENO: CONSTANCIA:");
    addParagraph(
      doc,
      `El trabajador declara que se encuentra afiliado a ${trabajador?.afiliacion?.nombre || "AFP no informada"} y salud en ${trabajador?.prevision?.nombre || "prevision no informada"}.`
    );

    addClauseTitle(doc, "DECIMO: COPIA PARA EL TRABAJADOR:");
    addParagraph(
      doc,
      "El presente contrato se suscribe en dos ejemplares de identico tenor y fecha, quedando uno en poder de cada una de las partes, declarando el trabajador haberlo leido y prestar conformidad a todas y cada una de sus partes."
    );

    drawSignatureLines(doc, empresa?.rut, trabajador?.rut);

    doc.addPage();

    doc.font("Helvetica-Bold").fontSize(16).text("FINIQUITO PARA TRABAJADOR", {
      align: "center",
    });
    doc.font("Helvetica-Bold").fontSize(13).text("POR EVENTO O SERVICIO DETERMINADO", {
      align: "center",
    });
    doc.moveDown(1.2);

    addParagraph(
      doc,
      `En ${ciudadFirma}, a ${formatDate(fechaFin)}, entre ${empresa?.nombre || "________________"}, Rut ${empresa?.rut || "____________"}, representado para estos efectos por don ${representanteNombre || "________________"}, Rut ${representante?.rut || "____________"}, ambos domiciliados en ${empresa?.direccion || "________________"}, ${empresa?.comuna?.nombre || ""} y don(a) ${trabajadorNombre || "________________"}, Rut ${trabajador?.rut || "____________"}, se acuerda el siguiente finiquito al contrato de trabajo contraido el dia ${formatDate(fechaInicio)}.`
    );

    addClauseTitle(doc, "PRIMERO:");
    addParagraph(
      doc,
      `Don(a) ${trabajadorNombre || "________________"} declara haber prestado servicios a ${empresa?.nombre || "________________"} en calidad de ${cargoNombre} desde el ${formatDate(fechaInicio)} hasta el ${formatDate(fechaFin)}, conforme al evento o servicio determinado informado en la solicitud N.${solicitud.id}.`
    );

    addClauseTitle(doc, "SEGUNDO:");
    addParagraph(
      doc,
      `Don(a) ${trabajadorNombre || "________________"} declara recibir en este acto, a su entera satisfaccion, la suma total de ${formatCurrency(totalPago)} por concepto de remuneracion base ${formatCurrency(montoBase)} y gratificacion ${formatCurrency(gratificacion)} correspondiente a los servicios prestados como ${cargoNombre}.`
    );

    addClauseTitle(doc, "TERCERO:");
    addParagraph(
      doc,
      `Estas sumas cubren y pagan cualquier prestacion que eventualmente ${empresa?.nombre || "la empresa"} adeude por cualquier concepto al trabajador, quien declara haber recibido oportunamente las remuneraciones, beneficios y demas prestaciones que correspondian durante la vigencia de la relacion laboral.`
    );

    addParagraph(
      doc,
      `En consecuencia, ${trabajadorNombre || "el trabajador"} declara que nada se le adeuda por causa o motivo alguno, legal o contractual, relacionado con la prestacion de sus servicios o con la terminacion del contrato de trabajo.`
    );

    addParagraph(
      doc,
      `A mayor abundamiento, ${trabajadorNombre || "el trabajador"} otorga a ${empresa?.nombre || "la empresa"} el mas amplio, completo y definitivo finiquito, declarando ademas recibir copia del presente documento.`
    );

    drawSignatureLines(doc, empresa?.rut, trabajador?.rut);

    doc.end();
  } catch (error) {
    console.error("Error generando PDF de contrato:", error);
    res.status(500).json({
      error: "Error al generar el PDF del contrato",
    });
  }
};

module.exports = controller;      //se exporta el objeto controller
