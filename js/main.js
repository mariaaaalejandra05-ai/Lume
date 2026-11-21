// ===============================================
// main.js - pagina principal (catalogo, menu y formulario)
// ===============================================

const listaProductos = document.getElementById("listaProductos");
const textoCargando = document.getElementById("cargando");

// Mostrar productos en pantalla
function mostrarProductos(categoria) {
  const productos = obtenerProductos();
  listaProductos.innerHTML = "";

  const filtrados = categoria === "todos"
    ? productos
    : productos.filter(p => p.categoria === categoria);

  if (filtrados.length === 0) {
    listaProductos.innerHTML = "<p>No hay productos en esta categoría.</p>";
    return;
  }

  filtrados.forEach(p => {
    const tarjeta = document.createElement("div");
    tarjeta.className = "tarjeta aparecer";

    // la foto solo sale si el producto tiene una
    let imagenHTML = "";
    if (p.imagen) {
      imagenHTML = `<img src="${p.imagen}" alt="${p.nombre}">`;
      tarjeta.classList.add("con-foto");
    }

    // circulitos con los colores disponibles
    let coloresHTML = "";
    if (p.colores && p.colores.length > 0) {
      coloresHTML = `<div class="colores">` +
        p.colores.map(c => `<span style="background:${c}"></span>`).join("") +
        `</div>`;
    }

    tarjeta.innerHTML = `
      ${imagenHTML}
      <span class="tipo">${p.categoria}</span>
      <h3>${p.nombre}</h3>
      <p>${p.descripcion}</p>
      ${coloresHTML}
      <div class="tarjeta-pie">
        <span class="precio">$${Number(p.precio).toFixed(2)}</span>
        <a href="#contacto" class="pedir" data-nombre="${p.nombre}">Pedir</a>
      </div>
    `;
    listaProductos.appendChild(tarjeta);
  });
}

// Simulamos un pequeño tiempo de carga
setTimeout(() => {
  textoCargando.style.display = "none";
  mostrarProductos("todos");
}, 600);

// Botones de filtro
const botonesFiltro = document.querySelectorAll(".filtro");
botonesFiltro.forEach(boton => {
  boton.addEventListener("click", () => {
    botonesFiltro.forEach(b => b.classList.remove("activo"));
    boton.classList.add("activo");
    mostrarProductos(boton.dataset.cat);
  });
});

// Menu para celular
document.getElementById("menuBtn").addEventListener("click", () => {
  document.getElementById("menu").classList.toggle("abierto");
});

// Validacion del formulario de contacto
document.getElementById("formContacto").addEventListener("submit", (e) => {
  const nombre = document.getElementById("nombre").value.trim();
  const correo = document.getElementById("correo").value.trim();
  const mensaje = document.getElementById("mensaje").value.trim();
  const error = document.getElementById("errorForm");

  if (nombre === "" || correo === "" || mensaje === "") {
    e.preventDefault();
    error.textContent = "Por favor llena todos los campos.";
    return;
  }
  if (!correo.includes("@")) {
    e.preventDefault();
    error.textContent = "El correo no es válido.";
    return;
  }
  error.textContent = "";
  // si todo esta bien se envia con FormSubmit
});

// boton "Pedir": llena el mensaje con el nombre del producto
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("pedir")) {
    document.getElementById("mensaje").value = "Hola, me interesa: " + e.target.dataset.nombre + ". ";
  }
});

