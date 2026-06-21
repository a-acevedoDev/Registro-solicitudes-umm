const formulario = document.getElementById('solicitudForm');
const tablaSolicitudes = document.getElementById('tablaSolicitudes');
const alertaMensaje = document.getElementById('alertaMensaje');
const filtroPrioridad = document.getElementById('filtroPrioridad');
const filtroTipo = document.getElementById('filtroTipo');
const limpiarFiltros = document.getElementById('limpiarFiltros');
const solicitudId = document.getElementById('solicitudId');
const botonFormulario = document.getElementById('botonFormulario');
const modoEdicionAviso = document.getElementById('modoEdicionAviso');
const cancelarEdicion = document.getElementById('cancelarEdicion');
const detalleSolicitudModal = document.getElementById('detalleSolicitudModal');
const detalleNombre = document.getElementById('detalleNombre');
const detalleCorreo = document.getElementById('detalleCorreo');
const detalleAsignatura = document.getElementById('detalleAsignatura');
const detalleTipo = document.getElementById('detalleTipo');
const detallePrioridad = document.getElementById('detallePrioridad');
const detalleFecha = document.getElementById('detalleFecha');
const detalleDescripcion = document.getElementById('detalleDescripcion');
const API_URL = 'http://localhost:3000/api/solicitudes';
const modalDetalleSolicitud = bootstrap.Modal.getOrCreateInstance(detalleSolicitudModal);
const ICON_DELETE = '<i class="bi bi-trash3"></i>';
const ICON_EDIT = '<i class="bi bi-pencil-square"></i>';
const ICON_VIEW = '<i class="bi bi-eye"></i>';

document.addEventListener('DOMContentLoaded', cargarVistaActual);
document.addEventListener('DOMContentLoaded', configurarCarruselDifuminado);

filtroPrioridad.addEventListener('change', () => {
    cargarVistaActual();
});

filtroTipo.addEventListener('change', () => {
    cargarVistaActual();
});

limpiarFiltros.addEventListener('click', () => {
    filtroPrioridad.value = '';
    filtroTipo.value = '';
    cargarVistaActual();
});

cancelarEdicion.addEventListener('click', () => {
    salirModoEdicion();
});

formulario.addEventListener('submit', async (e) => {
    e.preventDefault();
    e.stopPropagation();

    formulario.classList.add('was-validated');

    if (!formulario.checkValidity()) {
        mostrarAlerta('Faltan campos obligatorios. Revisa el formulario.', 'danger');
        return;
    }

    const nombre_estudiante = document.getElementById('nombre').value;
    const correo_institucional = document.getElementById('correo').value;
    const asignatura = document.getElementById('asignatura').value;
    const tipo_solicitud = document.getElementById('tipoSolicitud').value;
    const prioridad = document.getElementById('prioridad').value;
    const descripcion = document.getElementById('descripcion').value;
    const fecha_ingreso = new Date().toISOString().slice(0, 10);
    const idEdicion = solicitudId.value;

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
        const response = await fetch(idEdicion ? `${API_URL}/${idEdicion}` : API_URL, {
            method: idEdicion ? 'PUT' : 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            mostrarAlerta(idEdicion ? 'Solicitud actualizada exitosamente.' : 'Solicitud registrada exitosamente.', 'success');
            formulario.reset();
            formulario.classList.remove('was-validated');
            salirModoEdicion();
            cargarVistaActual();
        } else {
            const errorData = await response.json();
            const detalle = errorData.message || errorData.errores?.join(', ') || 'No se pudo guardar';
            mostrarAlerta('Error del servidor: ' + detalle, 'danger');
        }
    } catch (error) {
        mostrarAlerta('Error de conexión con el backend.', 'danger');
    }
});

tablaSolicitudes.addEventListener('click', async (e) => {
    const botonEliminar = e.target.closest('.btn-eliminar');
    const botonEditar = e.target.closest('.btn-editar');
    const botonVer = e.target.closest('.btn-ver');

    if (botonVer) {
        const { nombre, correo, asignatura, tipo, prioridad, descripcion, fecha } = botonVer.dataset;
        abrirDetalleSolicitud({ nombre, correo, asignatura, tipo, prioridad, descripcion, fecha });
        return;
    }

    if (botonEditar) {
        const { id, nombre, correo, asignatura, tipo, prioridad, descripcion, fecha } = botonEditar.dataset;
        entrarModoEdicion({ id, nombre, correo, asignatura, tipo, prioridad, descripcion, fecha });
        return;
    }

    if (!botonEliminar) {
        return;
    }

    const { id } = botonEliminar.dataset;
    if (!id) {
        return;
    }

    const confirmado = window.confirm('¿Estás seguro de que deseas eliminar esta solicitud?');
    if (!confirmado) {
        return;
    }

    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            mostrarAlerta('Solicitud eliminada correctamente.', 'success');
            cargarVistaActual();
            return;
        }

        const errorData = await response.json();
        const detalle = errorData.message || errorData.error || 'No se pudo eliminar';
        mostrarAlerta('Error del servidor: ' + detalle, 'danger');
    } catch (error) {
        mostrarAlerta('Error de conexión con el backend.', 'danger');
    }
});

async function obtenerSolicitudes() {
    try {
        const response = await fetch(API_URL);
        const result = await response.json();
        renderizarTabla(result);
    } catch (error) {
        mostrarAlerta('No se pudieron cargar las solicitudes', 'warning');
    }
}

async function obtenerSolicitudesFiltradas() {
    const params = new URLSearchParams();

    if (filtroPrioridad.value) {
        params.set('prioridad', filtroPrioridad.value);
    }

    if (filtroTipo.value) {
        params.set('tipo_solicitud', filtroTipo.value);
    }

    try {
        const url = params.toString() ? `${API_URL}?${params.toString()}` : API_URL;
        const response = await fetch(url);
        const result = await response.json();
        renderizarTabla(result);
    } catch (error) {
        mostrarAlerta('No se pudieron filtrar las solicitudes', 'warning');
    }
}

function cargarVistaActual() {
    if (filtroPrioridad.value || filtroTipo.value) {
        obtenerSolicitudesFiltradas();
        return;
    }

    obtenerSolicitudes();
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
            <td class="table-actions">
                <div class="btn-group btn-group-sm" role="group" aria-label="Acciones de solicitud">
                    <button type="button" class="btn btn-outline-info btn-table-action btn-ver" data-nombre="${escaparAtributo(solicitud.nombre_estudiante)}" data-correo="${escaparAtributo(solicitud.correo_institucional)}" data-asignatura="${escaparAtributo(solicitud.asignatura)}" data-tipo="${escaparAtributo(solicitud.tipo_solicitud)}" data-prioridad="${escaparAtributo(solicitud.prioridad)}" data-descripcion="${escaparAtributo(solicitud.descripcion)}" data-fecha="${escaparAtributo(solicitud.fecha_ingreso || '')}" title="Ver" aria-label="Ver solicitud">
                        ${ICON_VIEW}
                    </button>
                    <button type="button" class="btn btn-outline-primary btn-table-action btn-editar" data-id="${solicitud.id}" data-nombre="${escaparAtributo(solicitud.nombre_estudiante)}" data-correo="${escaparAtributo(solicitud.correo_institucional)}" data-asignatura="${escaparAtributo(solicitud.asignatura)}" data-tipo="${escaparAtributo(solicitud.tipo_solicitud)}" data-prioridad="${escaparAtributo(solicitud.prioridad)}" data-descripcion="${escaparAtributo(solicitud.descripcion)}" data-fecha="${escaparAtributo(solicitud.fecha_ingreso || '')}" title="Editar" aria-label="Editar solicitud">
                        ${ICON_EDIT}
                    </button>
                    <button type="button" class="btn btn-outline-danger btn-table-action btn-eliminar" data-id="${solicitud.id}" title="Eliminar" aria-label="Eliminar solicitud">
                        ${ICON_DELETE}
                    </button>
                </div>
            </td>
        `;
        tablaSolicitudes.appendChild(tr);
    });
}

function obtenerColorPrioridad(prioridad) {
    if (prioridad === 'Alta') return 'bg-danger';
    if (prioridad === 'Media') return 'bg-warning text-dark';
    return 'bg-info text-dark';
}

function mostrarAlerta(mensaje, tipo) {
    alertaMensaje.textContent = mensaje;
    alertaMensaje.className = `alert alert-${tipo} mt-3 mb-3`;
    
    setTimeout(() => {
        alertaMensaje.classList.add('d-none');
    }, 5000);
}

function entrarModoEdicion(solicitud) {
    solicitudId.value = solicitud.id;
    document.getElementById('nombre').value = solicitud.nombre;
    document.getElementById('correo').value = solicitud.correo;
    document.getElementById('asignatura').value = solicitud.asignatura;
    document.getElementById('tipoSolicitud').value = solicitud.tipo;
    document.getElementById('prioridad').value = solicitud.prioridad;
    document.getElementById('descripcion').value = solicitud.descripcion;

    botonFormulario.textContent = 'Actualizar Solicitud';
    modoEdicionAviso.classList.remove('d-none');
    cancelarEdicion.classList.remove('d-none');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function salirModoEdicion() {
    solicitudId.value = '';
    botonFormulario.textContent = 'Enviar Solicitud';
    modoEdicionAviso.classList.add('d-none');
    cancelarEdicion.classList.add('d-none');
}

function escaparAtributo(valor) {
    return String(valor)
        .replaceAll('&', '&amp;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#39;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;');
}

function configurarCarruselDifuminado() {
    const itemsCarrusel = document.querySelectorAll('#heroCarousel .carousel-item');

    itemsCarrusel.forEach((item) => {
        const imagen = item.querySelector('img');
        if (!imagen) {
            return;
        }

        item.style.setProperty('--slide-image', `url("${imagen.src}")`);
    });
}

function abrirDetalleSolicitud(solicitud) {
    detalleNombre.textContent = solicitud.nombre || '-';
    detalleCorreo.textContent = solicitud.correo || '-';
    detalleAsignatura.textContent = solicitud.asignatura || '-';
    detalleTipo.textContent = solicitud.tipo || '-';
    detallePrioridad.innerHTML = `<span class="badge ${obtenerColorPrioridad(solicitud.prioridad)}">${solicitud.prioridad || '-'}</span>`;
    detalleFecha.textContent = formatearFecha(solicitud.fecha) || '-';
    detalleDescripcion.textContent = solicitud.descripcion || '-';
    modalDetalleSolicitud.show();
}

function formatearFecha(fecha) {
    if (!fecha) {
        return '';
    }

    const fechaObjeto = new Date(fecha);
    if (Number.isNaN(fechaObjeto.getTime())) {
        return fecha;
    }

    return fechaObjeto.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
    });
}