// ===============================================
// chatbot.js - "Luma", el asistente de Lume
// Funciona buscando palabras clave en lo que escribe el usuario.
// Conoce los productos porque los lee de datos.js
// ===============================================

const chat = document.getElementById("chat");
const chatMensajes = document.getElementById("chatMensajes");
const chatInput = document.getElementById("chatInput");

document.getElementById("abrirChat").addEventListener("click", () => {
  chat.classList.toggle("oculto");
  if (chatMensajes.innerHTML === "") {
    agregarMensaje("bot", "¡Hola! Soy Luma. Pregúntame por precios, pulseras, collares, pedidos o envíos.");
  }
});

document.getElementById("cerrarChat").addEventListener("click", () => {
  chat.classList.add("oculto");
});

function agregarMensaje(quien, texto) {
  const div = document.createElement("div");
  div.className = "msg " + quien;
  div.textContent = texto;
  chatMensajes.appendChild(div);
  chatMensajes.scrollTop = chatMensajes.scrollHeight;
}

// quita tildes y pone todo en minuscula para comparar mas facil
function limpiar(texto) {
  return texto.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
}

function responder(pregunta) {
  const p = limpiar(pregunta);
  const productos = obtenerProductos();

  // primero revisamos si pregunta por un producto en especifico
  for (const prod of productos) {
    const palabras = limpiar(prod.nombre).split(" ").filter(w => w.length > 3 && !["pulsera", "collar", "media"].includes(w));
    if (palabras.some(w => p.includes(w))) {
      return `${prod.nombre} cuesta $${Number(prod.precio).toFixed(2)}. ${prod.descripcion}`;
    }
  }

  if (p.includes("hola") || p.includes("buenas")) {
    return "¡Hola! ¿En qué te puedo ayudar?";
  }
  if (p.includes("pulsera")) {
    const lista = productos.filter(x => x.categoria === "pulsera").map(x => `${x.nombre} ($${x.precio})`);
    return "Tenemos estas pulseras: " + lista.join(", ") + ".";
  }
  if (p.includes("collar")) {
    const lista = productos.filter(x => x.categoria === "collar").map(x => `${x.nombre} ($${x.precio})`);
    return "Tenemos estos collares: " + lista.join(", ") + ".";
  }
  if (p.includes("precio") || p.includes("cuesta") || p.includes("barato")) {
    const precios = productos.map(x => Number(x.precio));
    return `Nuestros precios van desde $${Math.min(...precios)} hasta $${Math.max(...precios)}. ¡Todo hecho a mano!`;
  }
  if (p.includes("personaliz") || p.includes("nombre") || p.includes("color")) {
    return "¡Sí hacemos pedidos personalizados! Puedes elegir colores o poner un nombre. Escríbenos en la sección de Contacto.";
  }
  if (p.includes("envio") || p.includes("entrega") || p.includes("donde")) {
    return "Hacemos entregas en Panamá. Coordinamos el punto de entrega cuando nos escribes.";
  }
  if (p.includes("pedido") || p.includes("comprar")) {
    return "Para comprar, llena el formulario de Contacto con el producto que quieres y te respondemos pronto.";
  }
  if (p.includes("regalo")) {
    return "Para regalo te recomiendo la pulsera Con tu nombre o el collar Media luna. ¡Siempre gustan!";
  }
  if (p.includes("gracias")) {
    return "¡Con gusto! Que tengas un lindo día";
  }

  return "Uy, no te entendí bien Puedes preguntarme por pulseras, collares, precios, pedidos personalizados o entregas.";
}

document.getElementById("chatForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const texto = chatInput.value.trim();
  if (texto === "") return;

  agregarMensaje("usuario", texto);
  chatInput.value = "";

  // pequeño retraso para que parezca que esta pensando
  agregarMensaje("bot escribiendo", "Escribiendo...");
  setTimeout(() => {
    const escribiendo = document.querySelector(".escribiendo");
    if (escribiendo) escribiendo.remove();
    agregarMensaje("bot", responder(texto));
  }, 700);
});
