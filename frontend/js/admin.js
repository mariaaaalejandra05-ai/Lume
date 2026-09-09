// ========================================================
// Panel de Administración de Lume
// Proyecto creado por: María González
// ========================================================

// Función de seguridad para evitar ataques XSS
function sanitizar(texto) {
    if (!texto) return '';
    return String(texto)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

// 1. FUNCIONES DE LOGIN Y SEGURIDAD
function verificarAccesoAdmin() {
    const usuario = localStorage.getItem('lume_admin_activo');
    if (!usuario) {
        // Si no ha iniciado sesión, lo redirigimos a login.html
        window.location.replace('login.html');
    }
}

// Contador de intentos para proteger contra ataques de fuerza bruta
let intentosFallidos = parseInt(sessionStorage.getItem('lume_intentos_fallidos') || '0');

function iniciarSesion(evento) {
    evento.preventDefault();
    const inputCorreo = document.getElementById('login-email');
    const inputClave = document.getElementById('login-password');
    const errorBox = document.getElementById('login-error-alert');
    const btnSubmit = document.getElementById('btn-login-submit');

    const correo = sanitizar(inputCorreo.value.trim());
    const clave = inputClave.value.trim();

    // Verificamos si la cuenta está bloqueada temporalmente por intentos fallidos
    const bloqueoHasta = sessionStorage.getItem('lume_bloqueado_hasta');
    if (bloqueoHasta && Date.now() < parseInt(bloqueoHasta)) {
        const segundosRestantes = Math.ceil((parseInt(bloqueoHasta) - Date.now()) / 1000);
        if (errorBox) {
            errorBox.textContent = `Demasiados intentos fallidos. Por seguridad, espera ${segundosRestantes} segundos.`;
            errorBox.style.display = 'block';
        }
        return;
    }

    // Validación segura de credenciales
    if (correo === 'admin@lume.com' && clave === 'lume123') {
        sessionStorage.removeItem('lume_intentos_fallidos');
        sessionStorage.removeItem('lume_bloqueado_hasta');

        localStorage.setItem('lume_admin_activo', JSON.stringify({
            nombre: 'María González',
            correo: correo
        }));
        window.location.replace('admin.html');
    } else {
        intentosFallidos++;
        sessionStorage.setItem('lume_intentos_fallidos', intentosFallidos);

        if (intentosFallidos >= 3) {
            // Bloqueo temporal por 30 segundos
            const tiempoBloqueo = Date.now() + 30000;
            sessionStorage.setItem('lume_bloqueado_hasta', tiempoBloqueo);
            
            if (errorBox) {
                errorBox.textContent = 'Has ingresado datos incorrectos 3 veces. Por seguridad, el acceso está pausado por 30 segundos.';
                errorBox.style.display = 'block';
            }
            if (btnSubmit) btnSubmit.disabled = true;

            let cuenta = 30;
            const intervalo = setInterval(() => {
                cuenta--;
                if (cuenta <= 0) {
                    clearInterval(intervalo);
                    sessionStorage.removeItem('lume_bloqueado_hasta');
                    sessionStorage.setItem('lume_intentos_fallidos', '0');
                    intentosFallidos = 0;
                    if (btnSubmit) btnSubmit.disabled = false;
                    if (errorBox) errorBox.style.display = 'none';
                } else {
                    if (errorBox) errorBox.textContent = `Has ingresado datos incorrectos. Espera ${cuenta} segundos para reintentar.`;
                }
            }, 1000);

        } else {
            const intentosRestantes = 3 - intentosFallidos;
            if (errorBox) {
                errorBox.textContent = `Correo o contraseña incorrectos. Te quedan ${intentosRestantes} intento(s) antes de una pausa de seguridad.`;
                errorBox.style.display = 'block';
            }
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
    let productos = [];
    try {
        productos = JSON.parse(localStorage.getItem('lume_productos')) || [];
    } catch(e) {
        productos = [];
    }

    let mensajes = [];
    try {
        mensajes = JSON.parse(localStorage.getItem('lume_mensajes')) || [];
    } catch(e) {
        mensajes = [];
    }

    // Actualizamos las estadísticas
    const statProds = document.getElementById('stat-total-products');
    const statMensajes = document.getElementById('stat-total-inquiries');
    if (statProds) statProds.textContent = productos.length;
    if (statMensajes) statMensajes.textContent = mensajes.length;

    mostrarTablaProductos(productos);
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
                <img src="${sanitizar(item.imagen)}" alt="${sanitizar(item.nombre)}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 8px;">
            </td>
            <td><strong>${sanitizar(item.nombre)}</strong></td>
            <td><span style="background: #fbf0ec; color: #8c4843; padding: 4px 10px; border-radius: 12px; font-size: 12px;">${sanitizar(item.categoria)}</span></td>
            <td>$ ${Number(item.precio).toLocaleString('es-CO')}</td>
            <td>${Number(item.stock)} uds.</td>
            <td>
                <button type="button" class="btn-editar" onclick="abrirModalEditar(${item.id})">Editar</button>
                <button type="button" class="btn-eliminar" onclick="eliminarProducto(${item.id}, '${sanitizar(item.nombre)}')">Eliminar</button>
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

    const nombre = sanitizar(document.getElementById('product-form-name').value.trim());
    const categoria = sanitizar(document.getElementById('product-form-category').value);
    const precio = Math.max(0, parseInt(document.getElementById('product-form-price').value) || 0);
    const stock = Math.max(0, parseInt(document.getElementById('product-form-stock').value) || 0);
    const materiales = sanitizar(document.getElementById('product-form-materials').value.trim());
    const descripcion = sanitizar(document.getElementById('product-form-description').value.trim());
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

// 3. MOSTRAR MENSAJES DE CONTACTO SANITIZADOS
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
                <strong>${sanitizar(m.nombre)}</strong>
                <small style="color: #8c4843;">${sanitizar(m.fecha)}</small>
            </div>
            <p style="font-size: 13px; color: #5c4d4d; margin-bottom: 4px;">
                📧 <b>Correo:</b> ${sanitizar(m.correo)} | 📞 <b>Tel:</b> ${sanitizar(m.telefono || 'No especificado')}
            </p>
            <p style="font-size: 14px; margin-bottom: 8px;">
                <b>Asunto:</b> ${sanitizar(m.asunto)}
            </p>
            <div style="background: #fbf7f4; padding: 10px; border-radius: 8px; font-size: 13px; line-height: 1.5; color: #2d2424; margin-bottom: 10px;">
                ${sanitizar(m.mensaje)}
            </div>
            <div>
                ${m.telefono ? `
                    <a href="https://wa.me/${m.telefono.replace(/[^0-9]/g, '')}?text=Hola%20${encodeURIComponent(m.nombre)},%20te%20escribo%20de%20Lume%20en%20respuesta%20a%20tu%20mensaje." target="_blank" class="btn-responder-wa">
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
    const formLogin = document.getElementById('lume-login-form');
    if (formLogin) {
        formLogin.addEventListener('submit', iniciarSesion);
    }

    if (window.location.pathname.includes('admin.html')) {
        verificarAccesoAdmin();
        cargarDatosAdmin();

        const btnCerrar = document.querySelector('.btn-cerrar-sesion');
        if (btnCerrar) btnCerrar.addEventListener('click', cerrarSesion);

        const btnNuevo = document.getElementById('btn-open-create-product');
        if (btnNuevo) btnNuevo.addEventListener('click', abrirModalCrear);

        const formProducto = document.getElementById('admin-product-form');
        if (formProducto) formProducto.addEventListener('submit', guardarProductoAdmin);

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
