const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// 🔧 FIX TURNOS: convertir HH:mm a Date
function toLocalDate(time) {
  const [h, m] = time.split(':');
  return new Date(1970, 0, 1, Number(h), Number(m), 0);
}

async function main() {
  // ========================
  // 1. Rol por defecto
  // ========================
  const rolExistente = await prisma.rol.findFirst({
    where: { nombre: 'Usuario' },
  });

  if (!rolExistente) {
    await prisma.rol.create({
      data: { nombre: 'Usuario' },
    });
    console.log('Rol creado');
  }

  // ========================
  // 2. País
  // ========================
  let pais = await prisma.pais.findFirst({
    where: { nombre: 'Chile' },
  });

  if (!pais) {
    pais = await prisma.pais.create({
      data: { nombre: 'Chile' },
    });
    console.log('País creado');
  }

  // ========================
  // 3. Regiones + comunas
  // ========================
  const regionesData = [/* 👈 TODO TU BLOQUE SE MANTIENE IGUAL */ 
    {
      nombre: 'Región de Arica y Parinacota',
      comunas: ['Arica', 'Camarones', 'Putre'],
    },
    {
      nombre: 'Región de Tarapacá',
      comunas: ['Iquique', 'Alto Hospicio', 'Pozo Almonte'],
    },
    {
      nombre: 'Región de Antofagasta',
      comunas: ['Antofagasta', 'Calama', 'Tocopilla'],
    },
    {
      nombre: 'Región de Atacama',
      comunas: ['Copiapó', 'Vallenar', 'Caldera'],
    },
    {
      nombre: 'Región de Coquimbo',
      comunas: ['La Serena', 'Coquimbo', 'Ovalle'],
    },
    {
      nombre: 'Región de Valparaíso',
      comunas: ['Valparaíso', 'Viña del Mar', 'Quilpué'],
    },
    {
      nombre: 'Región Metropolitana',
      comunas: ['Santiago', 'Puente Alto', 'Maipú'],
    },
    {
      nombre: "Región del Libertador Bernardo O'Higgins",
      comunas: ['Rancagua', 'San Fernando', 'Pichilemu'],
    },
    {
      nombre: 'Región del Maule',
      comunas: ['Talca', 'Curicó', 'Linares'],
    },
    {
      nombre: 'Región de Ñuble',
      comunas: ['Chillán', 'San Carlos', 'Bulnes'],
    },
    {
      nombre: 'Región del Biobío',
      comunas: ['Concepción', 'Los Ángeles', 'Talcahuano'],
    },
    {
      nombre: 'Región de La Araucanía',
      comunas: ['Temuco', 'Villarrica', 'Angol'],
    },
    {
      nombre: 'Región de Los Ríos',
      comunas: ['Valdivia', 'La Unión', 'Río Bueno'],
    },
    {
      nombre: 'Región de Los Lagos',
      comunas: ['Puerto Montt', 'Osorno', 'Castro'],
    },
    {
      nombre: 'Región de Aysén',
      comunas: ['Coyhaique', 'Aysén', 'Chile Chico'],
    },
    {
      nombre: 'Región de Magallanes',
      comunas: ['Punta Arenas', 'Puerto Natales', 'Porvenir'],
    },
  ];

  for (const regionData of regionesData) {
    let region = await prisma.region.findFirst({
      where: { nombre: regionData.nombre },
    });

    if (!region) {
      region = await prisma.region.create({
        data: {
          nombre: regionData.nombre,
          paisId: pais.id,
        },
      });
      console.log(`Región creada: ${region.nombre}`);
    }

    for (const comunaNombre of regionData.comunas) {
      const comunaExistente = await prisma.comuna.findFirst({
        where: {
          nombre: comunaNombre,
          regionId: region.id,
        },
      });

      if (!comunaExistente) {
        await prisma.comuna.create({
          data: {
            nombre: comunaNombre,
            regionId: region.id,
          },
        });
        console.log(`  Comuna creada: ${comunaNombre}`);
      }
    }
  }


  // ========================
  // 4. Estados de Solicitud
  // ========================
  const estadosSolicitud = [
    'Pendiente',
    'En revisión',
    'Aprobada',
    'Rechazada',
    'Cancelada',
  ];

  for (const nombre of estadosSolicitud) {
    const existe = await prisma.estadoSolicitud.findFirst({
      where: { nombre },
    });

    if (!existe) {
      await prisma.estadoSolicitud.create({
        data: { nombre },
      });
      console.log(`EstadoSolicitud creado: ${nombre}`);
    }
  }

  // ========================
  // 5. Estado Civil
  // ========================
  const estadosCiviles = [
    'Soltero',
    'Casado',
    'Divorciado',
    'Viudo',
    'Unión civil',
  ];

  for (const nombre of estadosCiviles) {
    const existe = await prisma.estadoCivil.findFirst({
      where: { nombre },
    });

    if (!existe) {
      await prisma.estadoCivil.create({
        data: { nombre },
      });
      console.log(`EstadoCivil creado: ${nombre}`);
    }
  }

  // ========================
  // 6. Previsión de Salud
  // ========================
  const previsiones = [
    'FONASA',
    'ISAPRE',
    'Particular',
  ];

  for (const nombre of previsiones) {
    const existe = await prisma.previsionSalud.findFirst({
      where: { nombre },
    });

    if (!existe) {
      await prisma.previsionSalud.create({
        data: { nombre },
      });
      console.log(`PrevisionSalud creada: ${nombre}`);
    }
  }

  // ========================
  // 7. Afiliación (AFP)
  // ========================
  const afiliaciones = [
    'AFP Habitat',
    'AFP Provida',
    'AFP Capital',
    'AFP Cuprum',
    'AFP Modelo',
    'Sin AFP',
  ];

  for (const nombre of afiliaciones) {
    const existe = await prisma.afiliacion.findFirst({
      where: { nombre },
    });

    if (!existe) {
      await prisma.afiliacion.create({
        data: { nombre },
      });
      console.log(`Afiliacion creada: ${nombre}`);
    }
  }

  // ========================
  // 8. Turnos (FIX REAL)
  // ========================
  const horarios = [
    ['05:00 A 14:00', '10:00 A 19:00', '15:00 A 00:00', '20:00 A 05:00'],
    ['05:30 A 14:30', '10:30 A 19:30', '15:30 A 00:30', '20:30 A 05:30'],
    ['06:00 A 15:00', '11:00 A 20:00', '16:00 A 01:00', '21:00 A 06:00'],
    ['06:30 A 15:30', '11:30 A 20:30', '16:30 A 01:30', '21:30 A 06:30'],
    ['07:00 A 16:00', '12:00 A 21:00', '17:00 A 02:00', '22:00 A 07:00'],
    ['07:30 A 16:30', '12:30 A 21:30', '17:30 A 02:30', '22:30 A 07:30'],
    ['08:00 A 17:00', '13:00 A 22:00', '18:00 A 03:00', '23:00 A 08:00'],
    ['08:30 A 17:30', '13:30 A 22:30', '18:30 A 03:30', '23:30 A 08:30'],
    ['09:00 A 18:00', '14:00 A 23:00', '19:00 A 04:00', ''],
    ['09:30 A 18:30', '14:30 A 23:30', '19:30 A 04:30', ''],
  ];

  const uniqueTurnos = new Map();

  for (const fila of horarios) {
    for (const horario of fila) {

      if (!horario) continue;

      const [inicio, fin] = horario.split(' A ');
      const key = `${inicio}-${fin}`;

      if (!uniqueTurnos.has(key)) {
        uniqueTurnos.set(key, {
          inicio: toLocalDate(inicio),
          fin: toLocalDate(fin),
        });
      }
    }
  }

  const turnosData = Array.from(uniqueTurnos.values());

  for (const turno of turnosData) {
    try {
      await prisma.turno.create({
        data: turno,
      });
    } catch (error) {
      if (error.code === 'P2002') continue;
      throw error;
    }
  }

  console.log('Turnos insertados (con control de duplicados)');

  // ========================
  // 9. Áreas
  // ========================
  const areas = [
    'Recepción',
    'Housekeeping',
    'Mantenimiento',
    'Cocina',
    'Restaurante',
    'Bar',
    'Seguridad',
    'Administración',
    'Eventos',
    'Spa / Wellness',
  ];

  const areasMap = {};

  for (const nombre of areas) {
    let area = await prisma.area.findFirst({
      where: { nombre },
    });

    if (!area) {
      area = await prisma.area.create({
        data: { nombre },
      });
      console.log(`Área creada: ${nombre}`);
    }

    areasMap[nombre] = area;
  }

  // ========================
  // 10. Cargos (FIX REAL)
  // ========================
  const cargosPorArea = {
    'Recepción': ['Recepcionista', 'Botones', 'Conserje'],
    'Housekeeping': ['Mucama', 'Supervisor de limpieza'],
    'Cocina': ['Chef', 'Sous Chef', 'Ayudante de cocina'],
    'Restaurante': ['Garzón'],
    'Bar': ['Barman'],
    'Mantenimiento': ['Técnico en mantenimiento'],
    'Seguridad': ['Guardia de seguridad'],
    'Administración': ['Administrador', 'Recursos Humanos'],
    'Eventos': ['Coordinador de eventos'],
    'Spa / Wellness': ['Terapeuta'],
  };

  for (const areaNombre in cargosPorArea) {
    const area = areasMap[areaNombre];

    for (const nombre of cargosPorArea[areaNombre]) {
      const existe = await prisma.cargo.findFirst({
        where: {
          nombre,
          areaId: area.id,
        },
      });

      if (!existe) {
        await prisma.cargo.create({
          data: {
            nombre,
            areaId: area.id, // 🔥 FIX CLAVE
          },
        });
        console.log(`Cargo creado: ${nombre} (${areaNombre})`);
      }
    }
  }
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });