const SolicitudModel = require('../models/Solicitud.model');

class SolicitudService {
  static async obtenerSolicitudes(filtros = {}) {
    try {
      const solicitudes = await SolicitudModel.findAll(filtros);
      return solicitudes;
    } catch (error) {
      throw new Error(`Error al obtener solicitudes: ${error.message}`);
    }
  }

  static async crearSolicitud(datos) {
    if (!datos.descripcion || datos.descripcion.length < 10) {
      throw new Error('La descripción debe tener al menos 10 caracteres.');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(datos.correo_institucional)) {
      throw new Error('El correo institucional no tiene un formato válido.');
    }

    const fechaIngreso = datos.fecha_ingreso || new Date().toISOString().slice(0, 10);

    const nuevaSolicitud = await SolicitudModel.create({
      ...datos,
      fecha_ingreso: fechaIngreso,
    });
    return nuevaSolicitud;
  }

  static async eliminarSolicitud(id) {
    if (!id || isNaN(id)) {
      throw new Error('ID inválido');
    }
    const eliminado = await SolicitudModel.delete(id);
    if (!eliminado) {
      throw new Error('Solicitud no encontrada');
    }
    return eliminado;
  }

  static async actualizarSolicitud(id, datos) {
    if (!id || isNaN(id)) {
      throw new Error('ID inválido');
    }

    const solicitudExistente = await SolicitudModel.findById(id);
    if (!solicitudExistente) {
      throw new Error('Solicitud no encontrada');
    }

    if (!datos.descripcion || datos.descripcion.length < 10) {
      throw new Error('La descripción debe tener al menos 10 caracteres.');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(datos.correo_institucional)) {
      throw new Error('El correo institucional no tiene un formato válido.');
    }

    const fechaIngreso = datos.fecha_ingreso || solicitudExistente.fecha_ingreso || new Date().toISOString().slice(0, 10);

    const solicitudActualizada = await SolicitudModel.update(id, {
      ...datos,
      fecha_ingreso: fechaIngreso,
    });

    return solicitudActualizada;
  }
}

module.exports = SolicitudService;