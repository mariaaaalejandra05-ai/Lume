// ===============================================
// datos.js
// Aqui esta la "parte de datos" del proyecto.
// Como GitHub Pages no deja tener un servidor,
// guardamos los productos en el localStorage del navegador.
// Las demas paginas solo usan estas funciones.
// ===============================================

// Productos que salen la primera vez.
// imagen: poner la ruta de la foto, ej: "img/hilo-rojo.jpg"
const productosIniciales = [
  { id: 1, nombre: "Hilo rojo", categoria: "pulsera", precio: 3, descripcion: "La clásica de hilo rojo encerado. Se ajusta con nudo corredizo.", estilo: "hilo", colores: ["#b3322b"], imagen: "" },
  { id: 2, nombre: "Mostacilla Arcoíris", categoria: "pulsera", precio: 4, descripcion: "Mostacillas de colores en hilo elástico. Talla única.", estilo: "mostacilla", colores: ["#e0574f", "#f0a23b", "#f2d04b", "#5bb07a", "#4a8fc9", "#8a63b8"], imagen: "" },
  { id: 3, nombre: "Macramé Arena", categoria: "pulsera", precio: 5, descripcion: "Tejida nudo por nudo en tonos tierra. Tarda como una hora en salir.", estilo: "macrame", colores: ["#c9a27e", "#8b6a4f"], imagen: "" },
  { id: 4, nombre: "Con tu nombre", categoria: "pulsera", precio: 5, descripcion: "Letras blancas con las cuentas del color que nos digas.", estilo: "letras", letras: "LUME", colores: ["#f2b8c6", "#ffffff"], imagen: "" },
  { id: 5, nombre: "Collar Playa", categoria: "collar", precio: 7, descripcion: "Conchitas recogidas en la playa, lavadas y perforadas una por una.", estilo: "conchas", colores: ["#f4ece0", "#efdcc8"], imagen: "" },
  { id: 6, nombre: "Piedras del río", categoria: "collar", precio: 8, descripcion: "Piedritas de colores con hilo encerado café.", estilo: "piedras", colores: ["#6f8f8a", "#b88b5a", "#3f5f6f", "#a9a28f"], imagen: "" },
  { id: 7, nombre: "Media luna", categoria: "collar", precio: 6, descripcion: "Cadena fina dorada con un dije de luna. No se pone negra.", estilo: "luna", colores: ["#d9b45a"], imagen: "" }
];

const CLAVE_STORAGE = "lume_productos_v2";

// Devuelve la lista de productos
function obtenerProductos() {
  const guardados = localStorage.getItem(CLAVE_STORAGE);
  if (guardados) {
    return JSON.parse(guardados);
  }
  // si no hay nada guardado usamos los iniciales
  guardarProductos(productosIniciales);
  return productosIniciales;
}

function guardarProductos(lista) {
  localStorage.setItem(CLAVE_STORAGE, JSON.stringify(lista));
}

function agregarProducto(producto) {
  const lista = obtenerProductos();
  producto.id = Date.now(); // id simple usando la fecha
  lista.push(producto);
  guardarProductos(lista);
}

function eliminarProducto(id) {
  const lista = obtenerProductos().filter(p => p.id !== id);
  guardarProductos(lista);
}

function reiniciarProductos() {
  guardarProductos(productosIniciales);
}
