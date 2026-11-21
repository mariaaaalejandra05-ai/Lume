// ===============================================
// admin.js - login y panel de administrador
// NOTA: el usuario y contraseña estan aqui en el codigo
// porque no tenemos servidor. En un proyecto real esto
// tendria que ir en un backend.
// ===============================================

const USUARIO = "admin";
const CLAVE = "lume2026";

const seccionLogin = document.getElementById("login");
const seccionPanel = document.getElementById("panel");

// Si ya habia iniciado sesion, mostramos el panel directo
if (sessionStorage.getItem("lume_sesion") === "si") {
  mostrarPanel();
}

document.getElementById("formLogin").addEventListener("submit", (e) => {
  e.preventDefault();
  const usuario = document.getElementById("usuario").value;
  const clave = document.getElementById("clave").value;
  const error = document.getElementById("errorLogin");

  if (usuario === USUARIO && clave === CLAVE) {
    sessionStorage.setItem("lume_sesion", "si");
    error.textContent = "";
    mostrarPanel();
  } else {
    error.textContent = "Usuario o contraseña incorrectos.";
  }
});

function mostrarPanel() {
  seccionLogin.classList.add("oculto");
  seccionPanel.classList.remove("oculto");
  cargarTabla();
}

document.getElementById("btnSalir").addEventListener("click", () => {
  sessionStorage.removeItem("lume_sesion");
  location.reload();
});

// Llenar la tabla con los productos
function cargarTabla() {
  const tabla = document.getElementById("tablaProductos");
  tabla.innerHTML = "";

  obtenerProductos().forEach(p => {
    const fila = document.createElement("tr");
    const mini = p.imagen ? `<img src="${p.imagen}" class="mini" alt="">` : "";
    fila.innerHTML = `
      <td>${mini}</td>
      <td>${p.nombre}</td>
      <td>${p.categoria}</td>
      <td>$${Number(p.precio).toFixed(2)}</td>
      <td><button class="btn-borrar" data-id="${p.id}">Eliminar</button></td>
    `;
    tabla.appendChild(fila);
  });

  document.querySelectorAll(".btn-borrar").forEach(boton => {
    boton.addEventListener("click", () => {
      if (confirm("¿Seguro que quieres eliminar este producto?")) {
        eliminarProducto(Number(boton.dataset.id));
        cargarTabla();
      }
    });
  });
}

// Foto tomada con el celular o elegida de la galeria.
// La hacemos mas pequeña con un canvas para que quepa en el localStorage.
let fotoSubida = "";

document.getElementById("pFoto").addEventListener("change", (e) => {
  const archivo = e.target.files[0];
  if (!archivo) return;

  const lector = new FileReader();
  lector.onload = () => {
    const img = new Image();
    img.onload = () => {
      const ancho = 600;
      const escala = Math.min(1, ancho / img.width);
      const canvas = document.createElement("canvas");
      canvas.width = img.width * escala;
      canvas.height = img.height * escala;
      canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
      fotoSubida = canvas.toDataURL("image/jpeg", 0.75);

      const vista = document.getElementById("vistaFoto");
      vista.src = fotoSubida;
      vista.classList.remove("oculto");
    };
    img.src = lector.result;
  };
  lector.readAsDataURL(archivo);
});

// Agregar producto nuevo
document.getElementById("formProducto").addEventListener("submit", (e) => {
  e.preventDefault();
  const nombre = document.getElementById("pNombre").value.trim();
  const precio = document.getElementById("pPrecio").value;
  const error = document.getElementById("errorProducto");

  if (nombre === "" || precio === "") {
    error.textContent = "El nombre y el precio son obligatorios.";
    return;
  }

  agregarProducto({
    nombre: nombre,
    categoria: document.getElementById("pCategoria").value,
    precio: Number(precio),
    descripcion: document.getElementById("pDesc").value.trim(),
    imagen: fotoSubida || document.getElementById("pImagen").value.trim()
  });

  error.textContent = "";
  e.target.reset();
  fotoSubida = "";
  document.getElementById("vistaFoto").classList.add("oculto");
  cargarTabla();
  alert("Producto guardado");
});

document.getElementById("btnReiniciar").addEventListener("click", () => {
  if (confirm("Se borrarán los cambios y volverán los productos iniciales. ¿Continuar?")) {
    reiniciarProductos();
    cargarTabla();
  }
});
