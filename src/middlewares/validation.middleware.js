const { body, validationResult } = require('express-validator');

const validarCrearSolicitud = [
  body('nombre_estudiante').notEmpty().withMessage('El nombre es obligatorio'),
  body('correo_institucional')
    .isEmail().withMessage('Correo inválido')
    .notEmpty().withMessage('El correo es obligatorio'),
  body('asignatura').notEmpty().withMessage('La asignatura es obligatoria'),
  body('tipo_solicitud')
    .isIn(['Evaluación', 'Asistencia', 'Contenidos', 'Plataforma', 'Otro'])
    .withMessage('Tipo de solicitud no válido'),
  body('descripcion')
    .notEmpty().withMessage('La descripción es obligatoria')
    .isLength({ min: 10 }).withMessage('La descripción debe tener al menos 10 caracteres'),
  body('prioridad')
    .isIn(['Baja', 'Media', 'Alta'])
    .withMessage('Prioridad no válida'),
  body('fecha_ingreso')
    .optional({ checkFalsy: true })
    .isISO8601().withMessage('Fecha inválida, use formato YYYY-MM-DD'),
];

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errores: errors.array().map(err => err.msg) });
  }
  next();
};

module.exports = {
  validarCrearSolicitud,
  handleValidationErrors,
};