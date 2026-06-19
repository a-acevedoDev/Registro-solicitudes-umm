const express = require('express');
const router = express.Router();
const SolicitudController = require('../controllers/solicitud.controller');
const { validarCrearSolicitud, handleValidationErrors } = require('../middlewares/validation.middleware');

router.get('/', SolicitudController.obtenerTodas);
router.post('/', validarCrearSolicitud, handleValidationErrors, SolicitudController.crear);
router.delete('/:id', SolicitudController.eliminar);

module.exports = router;