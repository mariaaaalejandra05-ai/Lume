// ========================================================
// Catálogo de Productos y Pulseras de Lume
// Proyecto creado por: María González
// ========================================================

// Lista inicial de productos por si se abre directamente en el navegador o en GitHub Pages
const productosIniciales = [
    {
        id: 1,
        nombre: "Pulsera Hilo Rojo Destino",
        categoria: "pulseras",
        precio: 18000,
        descripcion: "Elaborada a mano con la técnica de macramé y dije en oro golfi. Simboliza protección y amor.",
        materiales: "Hilo encerado resistente y dije dorado hipoalergénico",
        imagen: "https://images.unsplash.com/photo-1611591475883-8a39ec8c6c57?auto=format&fit=crop&w=800&q=80",
        personalizable: true,
        stock: 20
    },
    {
        id: 2,
        nombre: "Dúo de Pulseras para Pareja",
        categoria: "parejas",
        precio: 32000,
        descripcion: "Set de dos pulseras ajustables con piedras semipreciosas de Ónix negro mate y Cuarzo blanco.",
        materiales: "Piedras naturales seleccionadas de 8mm e hilo elástico o ajustable",
        imagen: "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&w=800&q=80",
        personalizable: true,
        stock: 15
    },
    {
        id: 3,
        nombre: "Pulsera con Inicial Personalizada",
        categoria: "personalizadas",
        precio: 22000,
        descripcion: "Pulsera tejida con la letra que elijas en dije de nácar o medalla en acero inoxidable.",
        materiales: "Hilo italiano de alta durabilidad e inicial a tu elección",
        imagen: "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?auto=format&fit=crop&w=800&q=80",
        personalizable: true,
        stock: 25
    },
    {
        id: 4,
        nombre: "Gargantilla Destellos de Luz",
        categoria: "joyas",
        precio: 28000,
        descripcion: "Collar delicado con cadena en acero inoxidable y dije de circonia brillante que no se oxida.",
        materiales: "Acero inoxidable resistente al agua y circonia facetada",
        imagen: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80",
        personalizable: false,
        stock: 10
    },
    {
        id: 5,
        nombre: "Pulsera Mostacilla Flor Silvestre",
        categoria: "pulseras",
        precio: 16000,
        descripcion: "Diseño tejido a mano con mostacilla checa formando pequeñas flores de colores pastel.",
        materiales: "Mostacilla checa calibrada y broche regulable",
        imagen: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80",
        personalizable: true,
        stock: 18
    },
    {
        id: 6,
        nombre: "Tobillera Bohemia Marina",
        categoria: "joyas",
        precio: 19000,
        descripcion: "Tobillera artesanal con caracolas naturales seleccionadas y esferas doradas.",
        materiales: "Hilo resistente al agua, caracolas y acero",
        imagen: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=800&q=80",
        personalizable: false,
        stock: 12
    }
];

// Variable global donde guardamos los productos cargados
let listaProductos = [];
let categoriaActual = 'todos';

// Función para inicializar los productos desde localStorage
function obtenerProductos() {
    const guardados = localStorage.getItem('lume_productos');
    if (guardados) {
        try {
            listaProductos = JSON.parse(guardados);
        } catch(e) {
            listaProductos = productosIniciales;
        }
    } else {
        listaProductos = productosIniciales;
        localStorage.setItem('lume_productos', JSON.stringify(listaProductos));
    }
    mostrarProductos(listaProductos);
}

// Función para pintar las tarjetas de los productos en el HTML
function mostrarProductos(productos) {
    const contenedor = document.getElementById('catalogo-grid');
    if (!contenedor) return;

    if (productos.length === 0) {
        contenedor.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 40px 20px;">
                <p style="font-size: 18px; color: #8c4843;">No se encontraron piezas con ese filtro.</p>
                <button class="btn-categoria" onclick="filtrarCategoria('todos')">Ver todos los productos</button>
            </div>
        `;
        return;
    }

    // Recorremos los productos y creamos el HTML de cada tarjeta
    contenedor.innerHTML = productos.map(item => {
        // Formatear precio en pesos colombianos (ej. $ 18.000)
        const precioFormateado = '$ ' + item.precio.toLocaleString('es-CO');
        
        return `
            <article class="tarjeta-producto">
                <div class="imagen-producto">
                    <img src="${item.imagen}" alt="${item.nombre}" loading="lazy">
                </div>
                <div class="contenido-producto">
                    <span class="tag-categoria">${formatearNombreCategoria(item.categoria)}</span>
                    <h3>${item.nombre}</h3>
                    <p class="descripcion-corta">${item.descripcion}</p>
                    <div class="fila-precio">
                        <span class="precio">${precioFormateado}</span>
                        <span class="stock">${item.stock > 0 ? 'En stock' : 'Agotado'}</span>
                    </div>
                    <div class="botones-tarjeta">
                        <button class="btn-detalle" onclick="abrirModalDetalle(${item.id})">Ver detalles</button>
                        <a href="${crearEnlaceWhatsApp(item)}" target="_blank" class="btn-pedir-wa" title="Pedir por WhatsApp">
                            Pedir por WhatsApp
                        </a>
                    </div>
                </div>
            </article>
        `;
    }).join('');
}

// Función para filtrar productos según el botón de categoría
function filtrarCategoria(categoria) {
    categoriaActual = categoria;
    
    // Cambiar la clase activa en los botones
    const botones = document.querySelectorAll('.btn-categoria');
    botones.forEach(btn => {
        if (btn.dataset.categoria === categoria) {
            btn.classList.add('activo');
        } else {
            btn.classList.remove('activo');
        }
    });

    aplicarFiltros();
}

// Función para buscar productos por texto (nombre, materiales o descripción)
function buscarProductos() {
    aplicarFiltros();
}

// Función para ordenar productos por precio
function ordenarProductos() {
    aplicarFiltros();
}

// Función que junta la categoría, la búsqueda y el ordenamiento
function aplicarFiltros() {
    let resultado = [...listaProductos];

    // 1. Filtro de categoría
    if (categoriaActual !== 'todos') {
        resultado = resultado.filter(p => p.categoria.toLowerCase() === categoriaActual.toLowerCase());
    }

    // 2. Filtro de búsqueda por texto
    const inputBuscar = document.getElementById('catalogo-search');
    if (inputBuscar && inputBuscar.value.trim() !== '') {
        const texto = inputBuscar.value.toLowerCase().trim();
        resultado = resultado.filter(p => 
            p.nombre.toLowerCase().includes(texto) ||
            p.descripcion.toLowerCase().includes(texto) ||
            p.materiales.toLowerCase().includes(texto)
        );
    }

    // 3. Ordenamiento
    const selectOrden = document.getElementById('catalogo-sort');
    if (selectOrden) {
        const orden = selectOrden.value;
        if (orden === 'precio-menor') {
            resultado.sort((a, b) => a.precio - b.precio);
        } else if (orden === 'precio-mayor') {
            resultado.sort((a, b) => b.precio - a.precio);
        } else if (orden === 'nombre') {
            resultado.sort((a, b) => a.nombre.localeCompare(b.nombre));
        }
    }

    mostrarProductos(resultado);
}

// Función para abrir la ventana modal con los detalles de una pieza
function abrirModalDetalle(id) {
    const producto = listaProductos.find(p => p.id === id);
    if (!producto) return;

    const modal = document.getElementById('product-modal');
    const contenido = document.getElementById('product-modal-content');
    if (!modal || !contenido) return;

    const precioFormateado = '$ ' + producto.precio.toLocaleString('es-CO');

    contenido.innerHTML = `
        <div class="modal-grid">
            <div class="modal-foto">
                <img src="${producto.imagen}" alt="${producto.nombre}">
            </div>
            <div class="modal-info">
                <span class="tag-categoria">${formatearNombreCategoria(producto.categoria)}</span>
                <h2>${producto.nombre}</h2>
                <div class="precio-grande">${precioFormateado}</div>
                <p class="descripcion-modal">${producto.descripcion}</p>
                
                <div class="caja-materiales">
                    <strong>Materiales:</strong>
                    <p>${producto.materiales}</p>
                </div>

                ${producto.personalizable ? `
                    <div class="caja-personalizar">
                        <h4>Personaliza tu pulsera:</h4>
                        <label for="input-inicial">Inicial o nombre:</label>
                        <input type="text" id="input-inicial" placeholder="Ejemplo: M & A" maxlength="20">

                        <label for="select-color-hilo" style="margin-top: 8px;">Color de hilo preferido:</label>
                        <select id="select-color-hilo">
                            <option value="Rojo">Rojo tradicional</option>
                            <option value="Negro">Negro elegante</option>
                            <option value="Beige">Beige / Lino</option>
                            <option value="Palo de Rosa">Palo de rosa</option>
                        </select>
                    </div>
                ` : ''}

                <div class="tip-cuidado">
                    <small>✨ <strong>Tip Lume:</strong> No mojes la pulsera con cloro ni perfumes directos para mantener el brillo.</small>
                </div>

                <div class="acciones-modal">
                    <button class="btn-comprar-modal" onclick="pedirConPersonalizacion(${producto.id})">
                        Pedir esta pieza por WhatsApp
                    </button>
                    <button class="btn-cerrar-modal" onclick="cerrarModalDetalle()">Cerrar</button>
                </div>
            </div>
        </div>
    `;

    modal.classList.add('activo');
    document.body.style.overflow = 'hidden';
}

// Función para cerrar la ventana modal
function cerrarModalDetalle() {
    const modal = document.getElementById('product-modal');
    if (modal) {
        modal.classList.remove('activo');
    }
    document.body.style.overflow = '';
}

// Función para abrir WhatsApp con los datos de personalización incluidos
function pedirConPersonalizacion(id) {
    const producto = listaProductos.find(p => p.id === id);
    if (!producto) return;

    let mensaje = `Hola María! Quiero pedir la pieza "${producto.nombre}" de Lume ($ ${producto.precio.toLocaleString('es-CO')}).`;
    
    const inputInicial = document.getElementById('input-inicial');
    const selectColor = document.getElementById('select-color-hilo');

    if (inputInicial && inputInicial.value.trim()) {
        mensaje += ` Inicial o nombre: ${inputInicial.value.trim()}.`;
    }
    if (selectColor) {
        mensaje += ` Color de hilo: ${selectColor.value}.`;
    }

    const url = `https://wa.me/573001234567?text=${encodeURIComponent(mensaje)}`;
    window.open(url, '_blank');
}

// Función para generar el enlace directo a WhatsApp desde la tarjeta
function crearEnlaceWhatsApp(producto) {
    const mensaje = `Hola María! Me interesa la pieza "${producto.nombre}" de Lume ($ ${producto.precio.toLocaleString('es-CO')}). ¿Tienes disponibilidad?`;
    return `https://wa.me/573001234567?text=${encodeURIComponent(mensaje)}`;
}

// Función helper para que las categorías se lean bonitas
function formatearNombreCategoria(cat) {
    const nombres = {
        'pulseras': 'Pulsera Artesanal',
        'joyas': 'Joya & Collar',
        'parejas': 'Set Parejas',
        'personalizadas': 'Personalizada'
    };
    return nombres[cat] || 'Accesorio';
}

// Inicializar cuando el documento esté listo
document.addEventListener('DOMContentLoaded', () => {
    obtenerProductos();

    // Evento de búsqueda
    const inputBuscar = document.getElementById('catalogo-search');
    if (inputBuscar) {
        inputBuscar.addEventListener('input', buscarProductos);
    }

    // Evento de orden
    const selectOrden = document.getElementById('catalogo-sort');
    if (selectOrden) {
        selectOrden.addEventListener('change', ordenarProductos);
    }

    // Cerrar modal al hacer clic en el fondo
    const modal = document.getElementById('product-modal');
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                cerrarModalDetalle();
            }
        });
    }
});
