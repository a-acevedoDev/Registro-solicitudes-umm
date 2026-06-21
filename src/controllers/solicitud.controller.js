const SolicitudService = require('../services/solicitud.service');

class SolicitudController {
  static async obtenerTodas(req, res) {
    try {
      const { prioridad, tipo_solicitud } = req.query;
      const filtros = {};
      if (prioridad) filtros.prioridad = prioridad;
      if (tipo_solicitud) filtros.tipo_solicitud = tipo_solicitud;

      const solicitudes = await SolicitudService.obtenerSolicitudes(filtros);
      res.status(200).json(solicitudes);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async filtrar(req, res) {
    try {
      const { filtro, valor } = req.query;

      if (!filtro || !valor) {
        return res.status(400).json({ error: 'Debes indicar filtro y valor.' });
      }

      const filtros = {};

      if (filtro === 'prioridad') {
        filtros.prioridad = valor;
      } else if (filtro === 'tipo') {
        filtros.tipo_solicitud = valor;
      } else {
        return res.status(400).json({ error: 'Filtro no válido.' });
      }

      const solicitudes = await SolicitudService.obtenerSolicitudes(filtros);
      res.status(200).json(solicitudes);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async crear(req, res) {
    try {
      const datos = req.body;
      const nueva = await SolicitudService.crearSolicitud(datos);
      res.status(201).json({ mensaje: 'Solicitud creada exitosamente', solicitud: nueva });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async actualizar(req, res) {
    try {
      const { id } = req.params;
      const datos = req.body;
      const actualizada = await SolicitudService.actualizarSolicitud(parseInt(id), datos);
      res.status(200).json({ mensaje: 'Solicitud actualizada exitosamente', solicitud: actualizada });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async eliminar(req, res) {
    try {
      const { id } = req.params;
      await SolicitudService.eliminarSolicitud(parseInt(id));
      res.status(200).json({ mensaje: 'Solicitud eliminada correctamente' });
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }
}

module.exports = SolicitudController;