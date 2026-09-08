// ========================================================
// Asistente Virtual Inteligente de Lume ("Lumi")
// Realizado por: María González y Ángeles Navas
// ========================================================

// Función para abrir y cerrar la ventana del chat
function alternarChatIA() {
    const ventana = document.getElementById('lumi-chat-window');
    if (ventana) {
        ventana.classList.toggle('activo');
        if (ventana.classList.contains('activo')) {
            const input = document.getElementById('lumi-input');
            if (input) input.focus();
        }
    }
}

function cerrarChatIA() {
    const ventana = document.getElementById('lumi-chat-window');
    if (ventana) {
        ventana.classList.remove('activo');
    }
}

// Función que procesa el mensaje enviado en el chat
function enviarPreguntaIA(evento) {
    evento.preventDefault();

    const input = document.getElementById('lumi-input');
    const mensaje = input.value.trim();
    if (!mensaje) return;

    input.value = '';

    // 1. Mostramos el mensaje del usuario en el chat
    agregarMensajeAlChat(mensaje, 'usuario');

    // 2. Simulamos el tiempo de respuesta de Lumi
    setTimeout(() => {
        const respuestaBot = generarRespuestaIA(mensaje);
        agregarMensajeAlChat(respuestaBot.texto, 'bot', respuestaBot.sugerencias);
    }, 400);
}

// Función de IA basada en palabras clave sobre el emprendimiento Lume
function generarRespuestaIA(texto) {
    const pregunta = texto.toLowerCase();

    // ¿Quiénes son las creadoras?
    if (pregunta.includes('quien') || pregunta.includes('fundador') || pregunta.includes('maria') || pregunta.includes('angeles') || pregunta.includes('creador')) {
        return {
            texto: "¡Hola! Lume fue fundado con mucho cariño por <strong>María González</strong> y <strong>Ángeles Navas</strong>. Ellas elaboran a mano pulseras artesanales modernas y personalizadas para conectar personas y recuerdos especiales.",
            sugerencias: ["¿Qué precios tienen?", "¿Cómo personalizar una pulsera?", "¿Hacen envíos?"]
        };
    }

    // Precios
    if (pregunta.includes('precio') || pregunta.includes('vale') || pregunta.includes('cuesta') || pregunta.includes('costo')) {
        return {
            texto: "Nuestras pulseras van desde los <strong>$ 16.000</strong> hasta los <strong>$ 32.000 COP</strong> (los sets de pareja). Todos los precios son accesibles y con materiales duraderos como oro golfi y piedras naturales.",
            sugerencias: ["Ver pulseras de pareja", "Ver pulseras con inicial", "¿Tienen envíos?"]
        };
    }

    // Personalización
    if (pregunta.includes('personaliz') || pregunta.includes('letra') || pregunta.includes('inicial') || pregunta.includes('nombre') || pregunta.includes('hilo')) {
        return {
            texto: "¡Nos encanta personalizar! 🥰 Puedes elegir la letra o inicial de tu persona favorita, el color del hilo (rojo, negro, beige o palo de rosa) y los dijes en acero o medalla dorada.",
            sugerencias: ["¿Cómo hacer un pedido?", "¿Qué pulseras tienen?"]
        };
    }

    // Pulseras de parejas
    if (pregunta.includes('pareja') || pregunta.includes('novio') || pregunta.includes('novia') || pregunta.includes('duo')) {
        return {
            texto: "¡El Set de Parejas es el favorito! 🖤🤍 Incluye dos pulseras con piedras de Ónix negro mate y Cuarzo blanco, que representan el amor y la complicidad. Cuesta $ 32.000 el par.",
            sugerencias: ["Pedir por WhatsApp", "¿Tienen más colores?"]
        };
    }

    // Cuidados
    if (pregunta.includes('cuidado') || pregunta.includes('mojar') || pregunta.includes('limpiar') || pregunta.includes('oxida')) {
        return {
            texto: "Para que tus accesorios duren mucho tiempo: evita el contacto directo con perfumes y cloro, límpialos con un paño suave y guárdalos en su bolsita cuando no los uses.",
            sugerencias: ["¿De qué material son?", "Ver catálogo"]
        };
    }

    // Envíos
    if (pregunta.includes('envio') || pregunta.includes('domicilio') || pregunta.includes('entrega') || pregunta.includes('ciudad')) {
        return {
            texto: "Realizamos envíos a todo el país 📦. Las pulseras personalizadas se tejen en 1 a 2 días hábiles y el envío tarda entre 2 y 4 días según la ciudad.",
            sugerencias: ["Quiero hacer un pedido", "Ver pulseras"]
        };
    }

    // Respuesta por defecto
    return {
        texto: "¡Hola! Soy <strong>Lumi</strong>, la asistente virtual de Lume ✨. ¿En qué te puedo asesorar hoy? Con gusto te cuento sobre nuestras pulseras hechas a mano, precios, cómo personalizarlas o coordinar tu pedido.",
        sugerencias: ["¿Quiénes son María y Ángeles?", "¿Qué precios tienen?", "¿Cómo personalizar?"]
    };
}

// Función para pintar mensajes en el cuerpo del chat
function agregarMensajeAlChat(mensaje, remitente, sugerencias = []) {
    const cuerpo = document.getElementById('lumi-chat-body');
    if (!cuerpo) return;

    const divMensaje = document.createElement('div');
    divMensaje.className = `mensaje-chat mensaje-${remitente}`;
    
    let htmlSugerencias = '';
    if (sugerencias.length > 0) {
        htmlSugerencias = `
            <div class="botones-sugerencias">
                ${sugerencias.map(sug => `<button type="button" class="btn-chip" onclick="preguntarRapido('${sug}')">${sug}</button>`).join('')}
            </div>
        `;
    }

    divMensaje.innerHTML = `
        <div class="burbuja-texto">
            ${mensaje}
            ${htmlSugerencias}
        </div>
    `;

    cuerpo.appendChild(divMensaje);
    cuerpo.scrollTop = cuerpo.scrollHeight;
}

// Función cuando el usuario hace clic en una sugerencia rápida
function preguntarRapido(texto) {
    agregarMensajeAlChat(texto, 'usuario');
    setTimeout(() => {
        const respuestaBot = generarRespuestaIA(texto);
        agregarMensajeAlChat(respuestaBot.texto, 'bot', respuestaBot.sugerencias);
    }, 400);
}

// Inicializar eventos del chat al cargar
document.addEventListener('DOMContentLoaded', () => {
    const botonToggle = document.getElementById('lumi-toggle-btn');
    const botonCerrar = document.getElementById('lumi-close-btn');
    const formChat = document.getElementById('lumi-form');

    if (botonToggle) botonToggle.addEventListener('click', alternarChatIA);
    if (botonCerrar) botonCerrar.addEventListener('click', cerrarChatIA);
    if (formChat) formChat.addEventListener('submit', enviarPreguntaIA);
});
