const formulario = document.getElementById('solicitudForm');
const tablaSolicitudes = document.getElementById('tablaSolicitudes');
const API_URL = '/api/solicitudes';

document.addEventListener('DOMContentLoaded', obtenerSolicitudes);

formulario.addEventListener('submit', async (e) => {
    e.preventDefault();

    const nombre_estudiante = document.getElementById('nombre').value;
    const correo_institucional = document.getElementById('correo').value;
    const asignatura = document.getElementById('asignatura').value;
    const tipo_solicitud = document.getElementById('tipoSolicitud').value;
    const prioridad = document.getElementById('prioridad').value;
    const descripcion = document.getElementById('descripcion').value;
    const fecha_ingreso = new Date().toISOString().slice(0, 10);

    const data = {
        nombre_estudiante,
        correo_institucional,
        asignatura,
        tipo_solicitud,
        prioridad,
        descripcion,
        fecha_ingreso
    };

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            formulario.reset();
            obtenerSolicitudes();
        } else {
            const errorData = await response.json();
            const detalle = errorData.message || errorData.errores?.join(', ') || 'No se pudo guardar';
            alert('Error al registrar: ' + detalle);
        }
    } catch (error) {
        console.error(error);
        alert('Error de conexión con el servidor');
    }
});

async function obtenerSolicitudes() {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        renderizarTabla(data);
    } catch (error) {
        console.error(error);
    }
}

function renderizarTabla(respuesta) {
    tablaSolicitudes.innerHTML = '';
    
    let solicitudes = Array.isArray(respuesta) ? respuesta : (respuesta.data || []);
    if (!Array.isArray(solicitudes)) return;

    solicitudes.forEach(solicitud => {
        const tr = document.createElement('tr');
        
        tr.innerHTML = `
            <td>
                <strong>${solicitud.nombre_estudiante}</strong><br>
                <small class="text-muted">${solicitud.correo_institucional}</small>
            </td>
            <td>${solicitud.asignatura}</td>
            <td><span class="badge bg-secondary">${solicitud.tipo_solicitud}</span></td>
            <td><span class="badge ${obtenerColorPrioridad(solicitud.prioridad)}">${solicitud.prioridad}</span></td>
        `;
        tablaSolicitudes.appendChild(tr);
    });
}

function obtenerColorPrioridad(prioridad) {
    if (prioridad === 'Alta') return 'bg-danger';
    if (prioridad === 'Media') return 'bg-warning text-dark';
    return 'bg-info text-dark';
}