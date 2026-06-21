const express = require('express');
const router = express.Router();
const SolicitudController = require('../controllers/solicitud.controller');
const { validarCrearSolicitud, handleValidationErrors } = require('../middlewares/validation.middleware');

router.get('/filtrar', SolicitudController.filtrar);
router.get('/', SolicitudController.obtenerTodas);
router.post('/', validarCrearSolicitud, handleValidationErrors, SolicitudController.crear);
router.put('/:id', validarCrearSolicitud, handleValidationErrors, SolicitudController.actualizar);
router.delete('/:id', SolicitudController.eliminar);

module.exports = router;