# Registro-solicitudes-umm

¡¡¡IMPORTANTE!!!
Para que el proyecto corra se debe configurar la base de datos y crearla, el archivo .env contiene la configuracion para ajustar nombre, contraseña, puerto, etc.
Ademas, debes crear la base de datos, en la raiz hay un archivo .txt con la query para crear la base de datos y la tabla.

GET http://localhost:3000/api/solicitudes
POST http://localhost:3000/api/solicitudes
DELETE http://localhost:3000/api/solicitudes/:id
GET http://localhost:3000/api/solicitudes/filtrar?filtro=prioridad&valor=Alta
GET http://localhost:3000/api/solicitudes/filtrar?filtro=tipo&valor=Evaluación

EJEMPLO DE CUERPO:
{
    "nombre_estudiante": "Juan Pérez",
    "correo_institucional": "juan@universidad.cl",
    "asignatura": "Programación Web",
    "tipo_solicitud": "Evaluación",
    "descripcion": "Solicito revisión de prueba con al menos 10 caracteres",
    "prioridad": "Alta",
    "fecha_ingreso": "2026-06-19"
}
