const express = require('express');                                                           
const router = express.Router();
const customerController =  require ('../controllers/controlador');    
const verifyToken = require('../middlewares/auth');                  

//-------------------------------------------- LOGIN --------------------------------------------

router.post('/login', customerController.login);

router.post('/crear_usuario', customerController.crear_usuario);

router.post("/logout", customerController.logout);

router.get("/auth/me", customerController.getMe);

//-------------------------------------------- TRABAJADORES --------------------------------------------

router.get("/catalogos",verifyToken, customerController.getCatalogos);

router.post('/crear_trabajador',verifyToken, customerController.crear_trabajador);

router.get("/trabajadores",verifyToken, customerController.getTrabajadores);

router.get("/dashboard/resumen",verifyToken, customerController.getDashboardResumen);

router.get("/trabajadores/:id",verifyToken, customerController.getTrabajadorById);

router.put("/trabajadores/:id",verifyToken, customerController.actualizar_trabajador);

//-------------------------------------------- SOLICTUDES --------------------------------------------

router.get("/catalogos-solicitud",verifyToken, customerController.getCatalogosSolicitud);

router.get("/get-tarifa",verifyToken, customerController.getTarifa);

router.get("/catalogos-solicitud",verifyToken, customerController.getCatalogosSolicitud);

router.post('/crear_solicitud',verifyToken, customerController.crear_solicitud);

router.get("/getSolicitudes",verifyToken, customerController.getSolicitudes);

router.get("/solicitudes/:id",verifyToken, customerController.getSolicitudById);

router.put("/solicitudes/:id/estado",verifyToken, customerController.updateEstadoSolicitud);

router.get(
  "/solicitudes/:id/detalle/:detalleId/trabajadores-disponibles",
  verifyToken,
  customerController.getTrabajadoresDisponiblesParaDetalle
);

router.post(
  "/solicitudes/:id/detalle/:detalleId/asignaciones",
  verifyToken,
  customerController.asignarTrabajadoresADetalle
);

router.get(
  "/solicitudes/:id/asignaciones/:asignacionId/contrato-pdf",
  verifyToken,
  customerController.generarContratoPdf
);


module.exports = router;
