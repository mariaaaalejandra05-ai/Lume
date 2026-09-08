// ========================================================
// Panel de Administración de Lume
// Realizado por: María González y Ángeles Navas
// ========================================================

// 1. FUNCIONES DE LOGIN Y SEGURIDAD
function verificarAccesoAdmin() {
    const usuario = localStorage.getItem('lume_admin_activo');
    if (!usuario) {
        // Si no ha iniciado sesión, lo devolvemos a login.html
        window.location.replace('login.html');
    }
}

function iniciarSesion(evento) {
    evento.preventDefault();
    const correo = document.getElementById('login-email').value.trim();
    const clave = document.getElementById('login-password').value.trim();
    const errorBox = document.getElementById('login-error-alert');

    // Validación sencilla de credenciales
    if (correo === 'admin@lume.com' && clave === 'lume123') {
        localStorage.setItem('lume_admin_activo', JSON.stringify({
            nombre: 'María González y Ángeles Navas',
            correo: correo
        }));
        window.location.replace('admin.html');
    } else {
        if (errorBox) {
            errorBox.textContent = 'Correo o contraseña incorrectos. Usa: admin@lume.com y clave: lume123';
            errorBox.style.display = 'block';
        } else {
            alert('Correo o contraseña incorrectos.');
        }
    }
}

function cerrarSesion() {
    localStorage.removeItem('lume_admin_activo');
    window.location.replace('login.html');
}

// 2. FUNCIONES DEL CRUD DE PRODUCTOS
let idProductoEditando = null;

function cargarDatosAdmin() {
    // Obtenemos los productos guardados
    let productos = [];
    try {
        productos = JSON.parse(localStorage.getItem('lume_productos')) || [];
    } catch(e) {
        productos = [];
    }

    // Obtenemos los mensajes guardados
    let mensajes = [];
    try {
        mensajes = JSON.parse(localStorage.getItem('lume_mensajes')) || [];
    } catch(e) {
        mensajes = [];
    }

    // Actualizamos las tarjetas de estadísticas
    const statProds = document.getElementById('stat-total-products');
    const statMensajes = document.getElementById('stat-total-inquiries');
    if (statProds) statProds.textContent = productos.length;
    if (statMensajes) statMensajes.textContent = mensajes.length;

    // Pintamos la tabla de productos
    mostrarTablaProductos(productos);

    // Pintamos la lista de mensajes de clientes
    mostrarListaMensajes(mensajes);
}

function mostrarTablaProductos(productos) {
    const tbody = document.getElementById('admin-products-table-body');
    if (!tbody) return;

    if (productos.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding: 20px;">No hay productos registrados.</td></tr>`;
        return;
    }

    tbody.innerHTML = productos.map(item => `
        <tr>
            <td>
                <img src="${item.imagen}" alt="${item.nombre}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 8px;">
            </td>
            <td><strong>${item.nombre}</strong></td>
            <td><span style="background: #fbf0ec; color: #8c4843; padding: 4px 10px; border-radius: 12px; font-size: 12px;">${item.categoria}</span></td>
            <td>$ ${item.precio.toLocaleString('es-CO')}</td>
            <td>${item.stock} uds.</td>
            <td>
                <button type="button" class="btn-editar" onclick="abrirModalEditar(${item.id})">Editar</button>
                <button type="button" class="btn-eliminar" onclick="eliminarProducto(${item.id}, '${item.nombre}')">Eliminar</button>
            </td>
        </tr>
    `).join('');
}

function abrirModalCrear() {
    idProductoEditando = null;
    const modal = document.getElementById('admin-product-modal');
    const form = document.getElementById('admin-product-form');
    const titulo = document.getElementById('modal-form-title');

    if (modal && form) {
        form.reset();
        titulo.textContent = 'Nueva Pieza Artesanal';
        modal.classList.add('activo');
    }
}

function abrirModalEditar(id) {
    const productos = JSON.parse(localStorage.getItem('lume_productos')) || [];
    const prod = productos.find(p => p.id === id);
    if (!prod) return;

    idProductoEditando = id;
    const modal = document.getElementById('admin-product-modal');
    const titulo = document.getElementById('modal-form-title');

    document.getElementById('product-form-name').value = prod.nombre;
    document.getElementById('product-form-category').value = prod.categoria;
    document.getElementById('product-form-price').value = prod.precio;
    document.getElementById('product-form-stock').value = prod.stock;
    document.getElementById('product-form-materials').value = prod.materiales || '';
    document.getElementById('product-form-description').value = prod.descripcion;
    document.getElementById('product-form-image').value = prod.imagen;

    if (modal) {
        titulo.textContent = 'Editar Pieza';
        modal.classList.add('activo');
    }
}

function cerrarModalAdmin() {
    const modal = document.getElementById('admin-product-modal');
    if (modal) {
        modal.classList.remove('activo');
    }
    idProductoEditando = null;
}

function guardarProductoAdmin(evento) {
    evento.preventDefault();

    let productos = JSON.parse(localStorage.getItem('lume_productos')) || [];

    const nombre = document.getElementById('product-form-name').value.trim();
    const categoria = document.getElementById('product-form-category').value;
    const precio = parseInt(document.getElementById('product-form-price').value);
    const stock = parseInt(document.getElementById('product-form-stock').value) || 0;
    const materiales = document.getElementById('product-form-materials').value.trim();
    const descripcion = document.getElementById('product-form-description').value.trim();
    const imagen = document.getElementById('product-form-image').value.trim() || 'https://images.unsplash.com/photo-1611591475883-8a39ec8c6c57?w=800';

    if (idProductoEditando) {
        // Modo Editar
        const indice = productos.findIndex(p => p.id === idProductoEditando);
        if (indice !== -1) {
            productos[indice].nombre = nombre;
            productos[indice].categoria = categoria;
            productos[indice].precio = precio;
            productos[indice].stock = stock;
            productos[indice].materiales = materiales;
            productos[indice].descripcion = descripcion;
            productos[indice].imagen = imagen;
        }
    } else {
        // Modo Crear
        const nuevoId = productos.length > 0 ? Math.max(...productos.map(p => p.id)) + 1 : 1;
        productos.push({
            id: nuevoId,
            nombre: nombre,
            categoria: categoria,
            precio: precio,
            stock: stock,
            materiales: materiales,
            descripcion: descripcion,
            imagen: imagen,
            personalizable: true
        });
    }

    // Guardar en localStorage y refrescar la tabla
    localStorage.setItem('lume_productos', JSON.stringify(productos));
    cerrarModalAdmin();
    cargarDatosAdmin();
}

function eliminarProducto(id, nombre) {
    if (confirm(`¿Estás segura de eliminar la pulsera "${nombre}" del catálogo?`)) {
        let productos = JSON.parse(localStorage.getItem('lume_productos')) || [];
        productos = productos.filter(p => p.id !== id);
        localStorage.setItem('lume_productos', JSON.stringify(productos));
        cargarDatosAdmin();
    }
}

// 3. MOSTRAR MENSAJES DE CONTACTO EN EL PANEL
function mostrarListaMensajes(mensajes) {
    const contenedor = document.getElementById('admin-inquiries-list');
    if (!contenedor) return;

    if (mensajes.length === 0) {
        contenedor.innerHTML = `<p style="text-align:center; padding: 20px; color:#7d6b63;">No hay mensajes de contacto registrados todavía.</p>`;
        return;
    }

    contenedor.innerHTML = mensajes.map(m => `
        <div class="caja-mensaje-admin">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                <strong>${m.nombre}</strong>
                <small style="color: #8c4843;">${m.fecha}</small>
            </div>
            <p style="font-size: 13px; color: #5c4d4d; margin-bottom: 4px;">
                📧 <b>Correo:</b> ${m.correo} | 📞 <b>Tel:</b> ${m.telefono || 'No especificado'}
            </p>
            <p style="font-size: 14px; margin-bottom: 8px;">
                <b>Asunto:</b> ${m.asunto}
            </p>
            <div style="background: #fbf7f4; padding: 10px; border-radius: 8px; font-size: 13px; line-height: 1.5; color: #2d2424; margin-bottom: 10px;">
                ${m.mensaje}
            </div>
            <div>
                ${m.telefono ? `
                    <a href="https://wa.me/${m.telefono.replace(/[^0-9]/g, '')}?text=Hola%20${encodeURIComponent(m.nombre)},%20te%20escribimos%20de%20Lume%20en%20respuesta%20a%20tu%20mensaje." target="_blank" class="btn-responder-wa">
                        Responder por WhatsApp
                    </a>
                ` : ''}
                <a href="mailto:${m.correo}?subject=Respuesta%20Lume:%20${encodeURIComponent(m.asunto)}" class="btn-responder-correo">
                    Responder por Correo
                </a>
            </div>
        </div>
    `).join('');
}

// Eventos al cargar
document.addEventListener('DOMContentLoaded', () => {
    // Si estamos en la página de login
    const formLogin = document.getElementById('lume-login-form');
    if (formLogin) {
        formLogin.addEventListener('submit', iniciarSesion);
    }

    // Si estamos en el panel de administración
    if (window.location.pathname.includes('admin.html')) {
        verificarAccesoAdmin();
        cargarDatosAdmin();

        const btnCerrar = document.querySelector('.btn-cerrar-sesion');
        if (btnCerrar) btnCerrar.addEventListener('click', cerrarSesion);

        const btnNuevo = document.getElementById('btn-open-create-product');
        if (btnNuevo) btnNuevo.addEventListener('click', abrirModalCrear);

        const formProducto = document.getElementById('admin-product-form');
        if (formProducto) formProducto.addEventListener('submit', guardarProductoAdmin);

        // Pestañas
        const tabBtns = document.querySelectorAll('.admin-tab-btn');
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                tabBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const pestana = btn.dataset.tab;
                document.getElementById('tab-products-section').style.display = pestana === 'products' ? 'block' : 'none';
                document.getElementById('tab-inquiries-section').style.display = pestana === 'inquiries' ? 'block' : 'none';
            });
        });
    }
});
