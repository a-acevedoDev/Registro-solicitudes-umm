const pool = require('../config/database');

class SolicitudModel {

  static async findAll(filtros = {}) {
    let sql = 'SELECT * FROM solicitudes';
    const values = [];
    const conditions = [];

    if (filtros.prioridad) {
      conditions.push('prioridad = ?');
      values.push(filtros.prioridad);
    }
    if (filtros.tipo_solicitud) {
      conditions.push('tipo_solicitud = ?');
      values.push(filtros.tipo_solicitud);
    }

    if (conditions.length > 0) {
      sql += ' WHERE ' + conditions.join(' AND ');
    }

    sql += ' ORDER BY fecha_ingreso DESC';

    const [rows] = await pool.query(sql, values);
    return rows;
  }

  static async create(solicitudData) {
    const {
      nombre_estudiante,
      correo_institucional,
      asignatura,
      tipo_solicitud,
      descripcion,
      prioridad,
      fecha_ingreso = new Date().toISOString().slice(0, 10),
    } = solicitudData;

    const sql = `
      INSERT INTO solicitudes 
      (nombre_estudiante, correo_institucional, asignatura, tipo_solicitud, descripcion, prioridad, fecha_ingreso)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [
      nombre_estudiante,
      correo_institucional,
      asignatura,
      tipo_solicitud,
      descripcion,
      prioridad,
      fecha_ingreso,
    ];

    const [result] = await pool.query(sql, values);
    return { id: result.insertId, ...solicitudData };
  }

  static async delete(id) {
    const sql = 'DELETE FROM solicitudes WHERE id = ?';
    const [result] = await pool.query(sql, [id]);
    return result.affectedRows > 0;
  }

  static async findById(id) {
    const sql = 'SELECT * FROM solicitudes WHERE id = ?';
    const [rows] = await pool.query(sql, [id]);
    return rows[0] || null;
  }
}

module.exports = SolicitudModel;