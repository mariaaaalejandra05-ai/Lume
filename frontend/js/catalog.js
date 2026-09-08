/**
 * Lume - Módulo Interactivo del Catálogo
 * Maneja el renderizado reactivo de productos, filtros de categoría,
 * búsqueda en tiempo real, ordenamiento y modal de detalle/personalización.
 * 
 * Emprendimiento: Lume
 * Fundadoras: María González & Ángeles Navas
 */

const LumeCatalog = {
    products: [],
    currentCategory: 'todos',
    searchTerm: '',
    sortBy: 'default',
    selectedProduct: null,

    async init() {
        await this.loadProducts();
        this.bindEvents();
    },

    async loadProducts() {
        const container = document.getElementById('catalogo-grid');
        if (!container) return;

        // Mostrar estado de carga (skeleton / spinner elegante)
        container.innerHTML = `
            <div class="lume-loading-state">
                <div class="lume-spinner"></div>
                <p>Cargando piezas artesanales de Lume...</p>
            </div>
        `;

        try {
            this.products = await LumeAPI.getProducts();
            this.render();
        } catch (error) {
            console.error("Error cargando catálogo:", error);
            container.innerHTML = `
                <div class="lume-error-state">
                    <p>No pudimos cargar los productos en este momento.</p>
                    <button class="btn-lume-secondary" onclick="LumeCatalog.loadProducts()">Reintentar</button>
                </div>
            `;
        }
    },

    bindEvents() {
        // Filtros por categoría
        const filterBtns = document.querySelectorAll('.cat-filter-btn');
        filterBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.currentCategory = btn.dataset.category || 'todos';
                this.render();
            });
        });

        // Búsqueda en tiempo real
        const searchInput = document.getElementById('catalogo-search');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchTerm = e.target.value.toLowerCase().trim();
                this.render();
            });
        }

        // Ordenamiento
        const sortSelect = document.getElementById('catalogo-sort');
        if (sortSelect) {
            sortSelect.addEventListener('change', (e) => {
                this.sortBy = e.target.value;
                this.render();
            });
        }

        // Cerrar modal de producto al hacer clic fuera o en botón de cierre
        const modal = document.getElementById('product-modal');
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal || e.target.closest('.lume-modal-close')) {
                    this.closeModal();
                }
            });
        }
    },

    getFilteredProducts() {
        let list = [...this.products];

        // Filtro por categoría
        if (this.currentCategory !== 'todos') {
            list = list.filter(p => (p.category || '').toLowerCase() === this.currentCategory);
        }

        // Filtro por búsqueda
        if (this.searchTerm) {
            list = list.filter(p =>
                (p.name || '').toLowerCase().includes(this.searchTerm) ||
                (p.description || '').toLowerCase().includes(this.searchTerm) ||
                (p.materials || '').toLowerCase().includes(this.searchTerm)
            );
        }

        // Ordenamiento
        if (this.sortBy === 'price-low') {
            list.sort((a, b) => (a.price || 0) - (b.price || 0));
        } else if (this.sortBy === 'price-high') {
            list.sort((a, b) => (b.price || 0) - (a.price || 0));
        } else if (this.sortBy === 'name') {
            list.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
        }

        return list;
    },

    render() {
        const container = document.getElementById('catalogo-grid');
        if (!container) return;

        const filtered = this.getFilteredProducts();

        if (filtered.length === 0) {
            container.innerHTML = `
                <div class="catalogo-empty">
                    <div class="empty-icon">✨</div>
                    <h3>No encontramos piezas con ese criterio</h3>
                    <p>Prueba con otra palabra clave o selecciona otra categoría.</p>
                    <button class="btn-lume-primary" onclick="LumeCatalog.resetFilters()">Ver todas las piezas</button>
                </div>
            `;
            return;
        }

        container.innerHTML = filtered.map(product => {
            const badgeHtml = product.badge ? `<span class="product-badge">${product.badge}</span>` : '';
            const customBadge = product.customizable ? `<span class="custom-badge">✦ Personalizable</span>` : '';
            const formattedPrice = LumeUI.formatCurrency(product.price);

            return `
                <article class="product-card" data-id="${product.id}">
                    <div class="product-image-container">
                        ${badgeHtml}
                        <img src="${product.image}" alt="${product.name}" loading="lazy" onerror="this.src='img/pulsera.jpg'; this.onerror=null;">
                    </div>
                    <div class="product-card-body">
                        <div class="product-meta">
                            <span class="product-cat-tag">${this.formatCategory(product.category)}</span>
                            ${customBadge}
                        </div>
                        <h3 class="product-title">${product.name}</h3>
                        <p class="product-desc">${product.description}</p>
                        <div class="product-price-row">
                            <span class="product-price">${formattedPrice}</span>
                            <span class="product-stock-tag">${product.stock > 0 ? 'En stock' : 'Bajo pedido'}</span>
                        </div>
                        <div class="product-actions">
                            <button class="btn-card-detail" onclick="LumeCatalog.openModal(${product.id})">
                                Ver detalles
                            </button>
                            <a href="${this.buildWhatsAppLink(product)}" target="_blank" rel="noopener" class="btn-card-order" title="Pedir por WhatsApp">
                                <span>Pedir</span>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.007c.106.005.249-.04.39.298.144.347.491 1.2.534 1.288.043.088.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.2 1.002.893 1.848.91 2.022 1.026.174.116.275.101.376-.015.101-.116.433-.506.549-.679.116-.173.231-.145.39-.087.159.058 1.011.477 1.184.564.173.087.289.13.332.202.043.072.043.419-.101.824z"/>
                                </svg>
                            </a>
                        </div>
                    </div>
                </article>
            `;
        }).join('');
    },

    formatCategory(cat) {
        const map = {
            'pulseras': 'Pulsera Artesanal',
            'joyas': 'Joya & Accesorio',
            'parejas': 'Set Parejas',
            'personalizadas': 'Personalizada'
        };
        return map[cat] || 'Accesorio';
    },

    buildWhatsAppLink(product, customNotes = '') {
        const phone = "573001234567";
        let message = `¡Hola María y Ángeles! Me interesa la pieza "${product.name}" de Lume (${LumeUI.formatCurrency(product.price)}).`;
        if (customNotes) {
            message += ` Detalles de personalización: ${customNotes}.`;
        }
        message += ` ¿Tienen disponibilidad inmediata para envío?`;
        return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    },

    openModal(productId) {
        const product = this.products.find(p => p.id === productId);
        if (!product) return;
        this.selectedProduct = product;

        const modal = document.getElementById('product-modal');
        const modalBody = document.getElementById('product-modal-content');
        if (!modal || !modalBody) return;

        modalBody.innerHTML = `
            <div class="modal-product-layout">
                <div class="modal-product-media">
                    <img src="${product.image}" alt="${product.name}">
                    ${product.badge ? `<span class="modal-badge">${product.badge}</span>` : ''}
                </div>
                <div class="modal-product-info">
                    <span class="modal-category">${this.formatCategory(product.category)}</span>
                    <h2 class="modal-title">${product.name}</h2>
                    <div class="modal-price">${LumeUI.formatCurrency(product.price)}</div>
                    
                    <p class="modal-description">${product.description}</p>
                    
                    <div class="modal-spec-box">
                        <h4>Materiales & Confección:</h4>
                        <p>${product.materials || 'Elaborado artesanalmente con hilos finos y herrajes hipoalergénicos.'}</p>
                    </div>

                    ${product.customizable ? `
                        <div class="modal-customizer-box">
                            <h4>Personaliza tu pedido:</h4>
                            <div class="customizer-field">
                                <label for="modal-custom-initial">Inicial o Nombre (opcional):</label>
                                <input type="text" id="modal-custom-initial" placeholder="Ej. M & A" maxlength="20">
                            </div>
                            <div class="customizer-field">
                                <label for="modal-custom-color">Color de Hilo preferido:</label>
                                <select id="modal-custom-color">
                                    <option value="Rojo Protección">Rojo Protección</option>
                                    <option value="Negro Elegante">Negro Elegante</option>
                                    <option value="Beige / Crema">Beige / Crema</option>
                                    <option value="Palo de Rosa">Palo de Rosa</option>
                                    <option value="Lila Pastel">Lila Pastel</option>
                                </select>
                            </div>
                        </div>
                    ` : ''}

                    <div class="modal-care-tips">
                        <small>✨ <strong>Tip de cuidado Lume:</strong> Evita el contacto directo con perfumes y guarda tu pulsera en su empaque para mantener su brillo intacto.</small>
                    </div>

                    <div class="modal-footer-actions">
                        <button class="btn-lume-primary" id="btn-modal-order-wa">
                            Pedir esta pieza por WhatsApp
                        </button>
                        <button class="btn-lume-secondary lume-modal-close">Cerrar</button>
                    </div>
                </div>
            </div>
        `;

        // Conectar botón de orden WhatsApp con personalizaciones ingresadas
        const orderBtn = document.getElementById('btn-modal-order-wa');
        if (orderBtn) {
            orderBtn.addEventListener('click', () => {
                let notes = '';
                const initialInput = document.getElementById('modal-custom-initial');
                const colorInput = document.getElementById('modal-custom-color');
                if (initialInput && initialInput.value.trim()) {
                    notes += `Inicial/Texto: "${initialInput.value.trim()}". `;
                }
                if (colorInput) {
                    notes += `Hilo: ${colorInput.value}.`;
                }
                const url = this.buildWhatsAppLink(product, notes);
                window.open(url, '_blank');
            });
        }

        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    },

    closeModal() {
        const modal = document.getElementById('product-modal');
        if (modal) {
            modal.classList.remove('active');
        }
        document.body.style.overflow = '';
        this.selectedProduct = null;
    },

    resetFilters() {
        this.currentCategory = 'todos';
        this.searchTerm = '';
        const searchInput = document.getElementById('catalogo-search');
        if (searchInput) searchInput.value = '';
        const filterBtns = document.querySelectorAll('.cat-filter-btn');
        filterBtns.forEach(b => {
            b.classList.toggle('active', b.dataset.category === 'todos');
        });
        this.render();
    }
};
