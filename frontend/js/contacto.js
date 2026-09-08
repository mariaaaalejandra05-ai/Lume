// ========================================================
// Formulario de Contacto Funcional de Lume
// Realizado por: María González y Ángeles Navas
// ========================================================

// Función que valida y procesa el envío del formulario de contacto
function enviarContacto(evento) {
    evento.preventDefault();

    // Obtenemos los campos del formulario
    const inputNombre = document.getElementById('contact-name');
    const inputCorreo = document.getElementById('contact-email');
    const inputTelefono = document.getElementById('contact-phone');
    const selectAsunto = document.getElementById('contact-subject');
    const inputMensaje = document.getElementById('contact-message');
    const cajaRespuesta = document.getElementById('contact-form-feedback');
    const botonEnviar = evento.target.querySelector('button[type="submit"]');

    // Limpiamos mensajes de error anteriores
    cajaRespuesta.innerHTML = '';

    const nombre = inputNombre.value.trim();
    const correo = inputCorreo.value.trim();
    const telefono = inputTelefono ? inputTelefono.value.trim() : '';
    const asunto = selectAsunto.value;
    const mensaje = inputMensaje.value.trim();

    // 1. Validaciones básicas y claras
    if (nombre.length < 2) {
        mostrarAlertaError("Por favor escribe tu nombre completo.");
        inputNombre.focus();
        return;
    }

    // Validación sencilla de formato de correo con expresión regular básica
    const formatoCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formatoCorreo.test(correo)) {
        mostrarAlertaError("Por favor ingresa un correo electrónico válido (ejemplo: usuario@correo.com).");
        inputCorreo.focus();
        return;
    }

    if (!asunto) {
        mostrarAlertaError("Por favor selecciona el motivo de tu consulta.");
        selectAsunto.focus();
        return;
    }

    if (mensaje.length < 5) {
        mostrarAlertaError("Por favor escribe un mensaje un poco más detallado para poder ayudarte.");
        inputMensaje.focus();
        return;
    }

    // 2. Estado de carga en el botón
    const textoOriginal = botonEnviar.innerHTML;
    botonEnviar.disabled = true;
    botonEnviar.innerHTML = `<span>Enviando mensaje...</span>`;

    // 3. Crear el objeto del mensaje
    const nuevoMensaje = {
        id: Date.now(),
        nombre: nombre,
        correo: correo,
        telefono: telefono,
        asunto: asunto,
        mensaje: mensaje,
        fecha: new Date().toLocaleDateString('es-CO') + ' ' + new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })
    };

    // Simulamos un pequeño tiempo de envío para que se vea real
    setTimeout(() => {
        // Guardamos el mensaje en el almacenamiento local para que aparezca en el panel admin
        let mensajesGuardados = [];
        try {
            mensajesGuardados = JSON.parse(localStorage.getItem('lume_mensajes')) || [];
        } catch(e) {
            mensajesGuardados = [];
        }

        mensajesGuardados.unshift(nuevoMensaje);
        localStorage.setItem('lume_mensajes', JSON.stringify(mensajesGuardados));

        // Mostrar mensaje de éxito bonito
        cajaRespuesta.innerHTML = `
            <div class="alerta-exito">
                <strong>¡Gracias por escribirnos, ${nombre}!</strong>
                <p>María González y Ángeles Navas hemos recibido tu consulta sobre <em>"${asunto}"</em>. Te responderemos muy pronto a tu correo <b>${correo}</b>.</p>
            </div>
        `;

        // Limpiar el formulario
        document.getElementById('lume-contact-form').reset();
        botonEnviar.disabled = false;
        botonEnviar.innerHTML = textoOriginal;

    }, 600);
}

// Función para mostrar mensajes de error simples
function mostrarAlertaError(texto) {
    const cajaRespuesta = document.getElementById('contact-form-feedback');
    if (cajaRespuesta) {
        cajaRespuesta.innerHTML = `
            <div class="alerta-error">
                <strong>Atención:</strong> ${texto}
            </div>
        `;
    }
}

// Inicializar evento al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    const formulario = document.getElementById('lume-contact-form');
    if (formulario) {
        formulario.addEventListener('submit', enviarContacto);
    }
});
