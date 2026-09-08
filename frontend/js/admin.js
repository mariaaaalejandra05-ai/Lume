/**
 * Lume - Panel Privado de Administración (Dashboard & CRUD)
 * Permite a María González y Ángeles Navas gestionar el catálogo en tiempo real
 * y revisar las consultas enviadas a través del formulario de contacto.
 * 
 * Emprendimiento: Lume
 */

const LumeAdmin = {
    products: [],
    inquiries: [],
    currentTab: 'products',
    editingProductId: null,

    async init() {
        await this.loadData();
        this.bindEvents();
        this.renderStats();
        this.renderProducts();
        this.renderInquiries();
    },

    async loadData() {
        try {
            const [products, inquiries] = await Promise.all([
                LumeAPI.getProducts(),
                LumeAPI.getInquiries()
            ]);
            this.products = products;
            this.inquiries = inquiries;
        } catch (error) {
            console.error("Error cargando datos de administración:", error);
            LumeUI.toast("Error al cargar los datos del sistema.", "error");
        }
    },

    bindEvents() {
        // Pestañas del Panel
        const tabBtns = document.querySelectorAll('.admin-tab-btn');
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                tabBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.currentTab = btn.dataset.tab;
                
                document.getElementById('tab-products-section').style.display = 
                    this.currentTab === 'products' ? 'block' : 'none';
                document.getElementById('tab-inquiries-section').style.display = 
                    this.currentTab === 'inquiries' ? 'block' : 'none';
            });
        });

        // Búsqueda en el panel de productos
        const adminSearch = document.getElementById('admin-product-search');
        if (adminSearch) {
            adminSearch.addEventListener('input', (e) => {
                this.renderProducts(e.target.value.toLowerCase().trim());
            });
        }

        // Modal Nuevo / Editar Producto
        const openCreateBtn = document.getElementById('btn-open-create-product');
        if (openCreateBtn) {
            openCreateBtn.addEventListener('click', () => this.openProductModal());
        }

        const productForm = document.getElementById('admin-product-form');
        if (productForm) {
            productForm.addEventListener('submit', (e) => this.handleSaveProduct(e));
        }

        // Preview en vivo de la URL de imagen en el formulario
        const imgInput = document.getElementById('product-form-image');
        const imgPreview = document.getElementById('product-form-img-preview');
        if (imgInput && imgPreview) {
            imgInput.addEventListener('input', () => {
                imgPreview.src = imgInput.value.trim() || 'https://images.unsplash.com/photo-1611591475883-8a39ec8c6c57?auto=format&fit=crop&w=800&q=80';
            });
        }
    },

    renderStats() {
        const totalProdsEl = document.getElementById('stat-total-products');
        const totalInqEl = document.getElementById('stat-total-inquiries');
        const unreadInqEl = document.getElementById('stat-unread-inquiries');

        if (totalProdsEl) totalProdsEl.textContent = this.products.length;
        if (totalInqEl) totalInqEl.textContent = this.inquiries.length;
        if (unreadInqEl) {
            const unread = this.inquiries.filter(i => i.status === 'nuevo').length;
            unreadInqEl.textContent = unread;
        }
    },

    renderProducts(searchTerm = '') {
        const tbody = document.getElementById('admin-products-table-body');
        if (!tbody) return;

        let list = [...this.products];
        if (searchTerm) {
            list = list.filter(p => 
                (p.name || '').toLowerCase().includes(searchTerm) ||
                (p.category || '').toLowerCase().includes(searchTerm)
            );
        }

        if (list.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="7" class="table-empty">No se encontraron piezas en el catálogo.</td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = list.map(p => `
            <tr>
                <td>
                    <img src="${p.image}" alt="${p.name}" class="table-thumb" onerror="this.src='https://images.unsplash.com/photo-1611591475883-8a39ec8c6c57?auto=format&fit=crop&w=800&q=80'">
                </td>
                <td>
                    <strong>${p.name}</strong>
                    ${p.badge ? `<br><span class="table-badge">${p.badge}</span>` : ''}
                </td>
                <td><span class="table-cat-pill">${p.category}</span></td>
                <td><strong>${LumeUI.formatCurrency(p.price)}</strong></td>
                <td>${p.stock} un.</td>
                <td>${p.customizable ? '✓ Sí' : 'No'}</td>
                <td class="table-actions">
                    <button class="btn-action-edit" onclick="LumeAdmin.openProductModal(${p.id})" title="Editar pieza">
                        ✏️ Editar
                    </button>
                    <button class="btn-action-delete" onclick="LumeAdmin.confirmDeleteProduct(${p.id}, '${p.name.replace(/'/g, "\\'")}')" title="Eliminar pieza">
                        🗑️ Borrar
                    </button>
                </td>
            </tr>
        `).join('');
    },

    renderInquiries() {
        const container = document.getElementById('admin-inquiries-list');
        if (!container) return;

        if (this.inquiries.length === 0) {
            container.innerHTML = `
                <div class="inquiries-empty">
                    <p>Aún no hay mensajes de contacto registrados.</p>
                </div>
            `;
            return;
        }

        container.innerHTML = this.inquiries.map(inq => `
            <div class="inquiry-card ${inq.status === 'nuevo' ? 'inquiry-new' : ''}">
                <div class="inquiry-header">
                    <div>
                        <h4 class="inquiry-sender">${inq.name}</h4>
                        <span class="inquiry-meta">📧 ${inq.email} • 📞 ${inq.phone || 'Sin teléfono'} • 🕒 ${inq.date}</span>
                    </div>
                    <span class="inquiry-status-pill status-${inq.status}">${inq.status === 'nuevo' ? 'Nuevo' : 'Atendido'}</span>
                </div>
                <div class="inquiry-subject"><strong>Asunto:</strong> ${inq.subject}</div>
                <div class="inquiry-message">${inq.message}</div>
                <div class="inquiry-actions">
                    ${inq.phone ? `
                        <a href="https://wa.me/${inq.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hola ${inq.name}, te escribimos de Lume en respuesta a tu consulta.`)}" target="_blank" rel="noopener" class="btn-inq-wa">
                            💬 Responder por WhatsApp
                        </a>
                    ` : ''}
                    <a href="mailto:${inq.email}?subject=${encodeURIComponent(`Respuesta Lume: ${inq.subject}`)}" class="btn-inq-email">
                        ✉️ Responder por Correo
                    </a>
                    ${inq.status === 'nuevo' ? `
                        <button class="btn-inq-mark" onclick="LumeAdmin.markInquiryRead(${inq.id})">
                            ✓ Marcar como Atendido
                        </button>
                    ` : ''}
                </div>
            </div>
        `).join('');
    },

    openProductModal(productId = null) {
        this.editingProductId = productId;
        const modal = document.getElementById('admin-product-modal');
        const modalTitle = document.getElementById('modal-form-title');
        const form = document.getElementById('admin-product-form');
        const imgPreview = document.getElementById('product-form-img-preview');

        if (!modal || !form) return;

        if (productId) {
            // Modo Edición
            const product = this.products.find(p => p.id === productId);
            if (!product) return;

            modalTitle.textContent = "Editar Pieza Artesanal";
            document.getElementById('product-form-name').value = product.name;
            document.getElementById('product-form-category').value = product.category;
            document.getElementById('product-form-price').value = product.price;
            document.getElementById('product-form-stock').value = product.stock;
            document.getElementById('product-form-badge').value = product.badge || '';
            document.getElementById('product-form-materials').value = product.materials || '';
            document.getElementById('product-form-description').value = product.description;
            document.getElementById('product-form-image').value = product.image;
            document.getElementById('product-form-customizable').checked = Boolean(product.customizable);
            if (imgPreview) imgPreview.src = product.image;
        } else {
            // Modo Creación
            modalTitle.textContent = "Nueva Pieza Artesanal Lume";
            form.reset();
            document.getElementById('product-form-customizable').checked = true;
            if (imgPreview) imgPreview.src = 'https://images.unsplash.com/photo-1611591475883-8a39ec8c6c57?auto=format&fit=crop&w=800&q=80';
        }

        modal.classList.add('active');
    },

    closeProductModal() {
        const modal = document.getElementById('admin-product-modal');
        if (modal) modal.classList.remove('active');
        this.editingProductId = null;
    },

    async handleSaveProduct(e) {
        e.preventDefault();
        const submitBtn = e.target.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = `<span class="btn-spinner"></span> Guardando...`;

        const payload = {
            name: document.getElementById('product-form-name').value.trim(),
            category: document.getElementById('product-form-category').value,
            price: parseFloat(document.getElementById('product-form-price').value),
            stock: parseInt(document.getElementById('product-form-stock').value) || 0,
            badge: document.getElementById('product-form-badge').value.trim(),
            materials: document.getElementById('product-form-materials').value.trim(),
            description: document.getElementById('product-form-description').value.trim(),
            image: document.getElementById('product-form-image').value.trim(),
            customizable: document.getElementById('product-form-customizable').checked
        };

        try {
            if (this.editingProductId) {
                // Actualizar
                await LumeAPI.updateProduct(this.editingProductId, payload);
                LumeUI.toast("¡Pieza actualizada con éxito!", "success");
            } else {
                // Crear
                await LumeAPI.createProduct(payload);
                LumeUI.toast("¡Nueva pieza agregada al catálogo de Lume!", "success");
            }

            this.closeProductModal();
            await this.loadData();
            this.renderStats();
            this.renderProducts();
        } catch (error) {
            console.error("Error guardando producto:", error);
            LumeUI.toast("Error al guardar la pieza.", "error");
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
        }
    },

    async confirmDeleteProduct(id, name) {
        const confirmed = confirm(`¿Estás segura de eliminar la pieza "${name}" del catálogo de Lume? Esta acción no se puede deshacer.`);
        if (!confirmed) return;

        try {
            await LumeAPI.deleteProduct(id);
            LumeUI.toast("Pieza eliminada correctamente.", "info");
            await this.loadData();
            this.renderStats();
            this.renderProducts();
        } catch (error) {
            console.error("Error al eliminar producto:", error);
            LumeUI.toast("No se pudo eliminar el producto.", "error");
        }
    },

    async markInquiryRead(id) {
        try {
            await LumeAPI.updateInquiryStatus(id, 'leido');
            LumeUI.toast("Consulta marcada como atendida.", "success");
            await this.loadData();
            this.renderStats();
            this.renderInquiries();
        } catch (error) {
            console.error("Error actualizando consulta:", error);
            LumeUI.toast("No se pudo actualizar el estado.", "error");
        }
    }
};

document.addEventListener('DOMContentLoaded', () => {
    LumeAdmin.init();
});
