/**
 * Lume - Servicio de API Unificado y Adaptador Híbrido
 * Conecta con el Backend PHP cuando está disponible y conmuta transparentemente
 * a la capa de persistencia local en GitHub Pages o modo estático.
 * 
 * Emprendimiento: Lume
 * Fundadoras: María González & Ángeles Navas
 */

const LumeConfig = {
    // Rutas relativas para detectar el backend PHP
    apiBase: '../backend/api',
    isStaticMode: false
};

const LumeAPI = {
    // Determina si el entorno puede comunicarse con endpoints PHP
    async checkBackendAvailable() {
        if (window.location.protocol === 'file:') {
            LumeConfig.isStaticMode = true;
            return false;
        }
        try {
            const res = await fetch(`${LumeConfig.apiBase}/products.php?limit=1`, {
                method: 'GET',
                headers: { 'Accept': 'application/json' }
            });
            if (res.ok) {
                LumeConfig.isStaticMode = false;
                return true;
            }
        } catch (e) {
            // Error de red, CORS o 404 => Activar modo autónomo/GitHub Pages
        }
        LumeConfig.isStaticMode = true;
        return false;
    },

    // ==========================================
    // PRODUCTOS (CRUD)
    // ==========================================

    async getProducts(params = {}) {
        await this.delay(120);
        if (!LumeConfig.isStaticMode) {
            try {
                const query = new URLSearchParams(params).toString();
                const res = await fetch(`${LumeConfig.apiBase}/products.php?${query}`);
                const data = await res.json();
                if (data.success) return data.data;
            } catch (e) {
                console.warn("Fallo al conectar con PHP, usando almacenamiento local:", e);
            }
        }

        // Modo autónomo (GitHub Pages / Offline)
        let products = LumeStorage.getProducts();
        if (params.category && params.category !== 'todos' && params.category !== 'all') {
            const cat = params.category.toLowerCase();
            products = products.filter(p => (p.category || '').toLowerCase() === cat);
        }
        if (params.search) {
            const term = params.search.toLowerCase().trim();
            products = products.filter(p => 
                (p.name || '').toLowerCase().includes(term) ||
                (p.description || '').toLowerCase().includes(term) ||
                (p.materials || '').toLowerCase().includes(term)
            );
        }
        return products;
    },

    async getProductById(id) {
        await this.delay(80);
        const products = await this.getProducts();
        return products.find(p => String(p.id) === String(id)) || null;
    },

    async createProduct(productData) {
        await this.delay(200);
        if (!LumeConfig.isStaticMode) {
            try {
                const res = await fetch(`${LumeConfig.apiBase}/products.php`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(productData)
                });
                const data = await res.json();
                if (data.success) return data.data;
            } catch (e) {
                console.warn("Fallo en creación con PHP, guardando localmente:", e);
            }
        }

        // Modo autónomo
        const products = LumeStorage.getProducts();
        const maxId = products.reduce((max, p) => Math.max(max, Number(p.id) || 0), 0);
        const newProduct = {
            id: maxId + 1,
            name: productData.name.trim(),
            category: productData.category.trim().toLowerCase(),
            price: Number(productData.price) || 0,
            badge: productData.badge ? productData.badge.trim() : '',
            description: productData.description ? productData.description.trim() : '',
            materials: productData.materials ? productData.materials.trim() : '',
            customizable: Boolean(productData.customizable),
            stock: Number(productData.stock) || 10,
            image: productData.image && productData.image.trim() ? productData.image.trim() : 'https://images.unsplash.com/photo-1611591475883-8a39ec8c6c57?auto=format&fit=crop&w=800&q=80',
            created_at: new Date().toISOString()
        };
        products.push(newProduct);
        LumeStorage.saveProducts(products);
        return newProduct;
    },

    async updateProduct(id, productData) {
        await this.delay(200);
        if (!LumeConfig.isStaticMode) {
            try {
                const res = await fetch(`${LumeConfig.apiBase}/products.php?id=${id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(productData)
                });
                const data = await res.json();
                if (data.success) return data.data;
            } catch (e) {
                console.warn("Fallo en actualización PHP, guardando localmente:", e);
            }
        }

        // Modo autónomo
        const products = LumeStorage.getProducts();
        const idx = products.findIndex(p => String(p.id) === String(id));
        if (idx !== -1) {
            products[idx] = {
                ...products[idx],
                ...productData,
                price: Number(productData.price) || products[idx].price,
                stock: Number(productData.stock) || products[idx].stock,
                customizable: Boolean(productData.customizable),
                updated_at: new Date().toISOString()
            };
            LumeStorage.saveProducts(products);
            return products[idx];
        }
        throw new Error("Producto no encontrado");
    },

    async deleteProduct(id) {
        await this.delay(180);
        if (!LumeConfig.isStaticMode) {
            try {
                const res = await fetch(`${LumeConfig.apiBase}/products.php?id=${id}`, {
                    method: 'DELETE'
                });
                const data = await res.json();
                if (data.success) return true;
            } catch (e) {
                console.warn("Fallo en eliminación PHP, borrando localmente:", e);
            }
        }

        // Modo autónomo
        const products = LumeStorage.getProducts();
        const filtered = products.filter(p => String(p.id) !== String(id));
        LumeStorage.saveProducts(filtered);
        return true;
    },

    // ==========================================
    // FORMULARIO DE CONTACTO
    // ==========================================

    async sendContact(inquiryData) {
        await this.delay(300);
        if (!LumeConfig.isStaticMode) {
            try {
                const res = await fetch(`${LumeConfig.apiBase}/contact.php`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(inquiryData)
                });
                const data = await res.json();
                if (data.success) return data;
            } catch (e) {
                console.warn("Fallo envío contacto PHP, guardando localmente:", e);
            }
        }

        // Modo autónomo
        const inquiries = LumeStorage.getInquiries();
        const maxId = inquiries.reduce((max, inq) => Math.max(max, Number(inq.id) || 0), 0);
        const newInquiry = {
            id: maxId + 1,
            name: inquiryData.name.trim(),
            email: inquiryData.email.trim(),
            phone: inquiryData.phone ? inquiryData.phone.trim() : '',
            subject: inquiryData.subject ? inquiryData.subject.trim() : 'Consulta general',
            message: inquiryData.message.trim(),
            date: new Date().toISOString().replace('T', ' ').substring(0, 16),
            status: 'nuevo'
        };
        inquiries.unshift(newInquiry);
        LumeStorage.saveInquiries(inquiries);
        return { success: true, message: "¡Gracias por contactar a Lume! Te responderemos muy pronto.", data: newInquiry };
    },

    async getInquiries() {
        await this.delay(100);
        if (!LumeConfig.isStaticMode) {
            try {
                const res = await fetch(`${LumeConfig.apiBase}/contact.php`);
                const data = await res.json();
                if (data.success) return data.data;
            } catch (e) {
                console.warn("Fallo listado consultas PHP:", e);
            }
        }
        return LumeStorage.getInquiries();
    },

    async updateInquiryStatus(id, status) {
        await this.delay(100);
        const inquiries = LumeStorage.getInquiries();
        const item = inquiries.find(inq => String(inq.id) === String(id));
        if (item) {
            item.status = status;
            LumeStorage.saveInquiries(inquiries);
            return item;
        }
        return null;
    },

    // ==========================================
    // AUTENTICACIÓN
    // ==========================================

    async login(email, password, remember = false) {
        await this.delay(350);
        if (!LumeConfig.isStaticMode) {
            try {
                const res = await fetch(`${LumeConfig.apiBase}/auth.php`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });
                const data = await res.json();
                if (data.success) {
                    LumeStorage.setAuth(data.data, remember);
                    return data.data;
                } else {
                    throw new Error(data.message || "Credenciales incorrectas");
                }
            } catch (e) {
                if (e.message && !e.message.includes('fetch')) {
                    throw e;
                }
            }
        }

        // Autenticación en modo autónomo / GitHub Pages
        const cleanEmail = email.toLowerCase().trim();
        if (cleanEmail === 'admin@lume.com' && password === 'lume123') {
            const authPayload = {
                user: {
                    id: 1,
                    name: "María González & Ángeles Navas",
                    email: "admin@lume.com",
                    role: "admin"
                },
                token: "lume_session_token_" + Date.now()
            };
            LumeStorage.setAuth(authPayload, remember);
            return authPayload;
        }
        throw new Error("Credenciales incorrectas. Verifique su correo y contraseña (admin@lume.com / lume123)");
    },

    logout() {
        LumeStorage.clearAuth();
    },

    getCurrentUser() {
        const auth = LumeStorage.getAuth();
        return auth ? auth.user : null;
    },

    // ==========================================
    // ASISTENTE DE INTELIGENCIA ARTIFICIAL (LUMI)
    // ==========================================

    async askAi(message) {
        await this.delay(450); // Simula pensamiento natural de la IA
        if (!LumeConfig.isStaticMode) {
            try {
                const res = await fetch(`${LumeConfig.apiBase}/ai.php`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ message })
                });
                const data = await res.json();
                if (data.success) return data.data;
            } catch (e) {
                console.warn("Fallo endpoint IA PHP, utilizando motor local:", e);
            }
        }

        // Motor local de IA con conocimiento profundo de Lume
        return this.localAiInference(message);
    },

    localAiInference(query) {
        const normalized = query.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        const products = LumeStorage.getProducts();

        let reply = "";
        let suggestions = [];
        let recommendedProducts = [];

        if (/(quien|quienes|fundador|fundadora|creador|equipo|duena|maria|angeles)/i.test(normalized)) {
            reply = "✨ ¡Hola! Lume fue fundado con mucho cariño por María González y Ángeles Navas. Ellas son dos emprendedoras apasionadas por diseñar accesorios y pulseras artesanales modernas, con significado y a precios accesibles para todos.";
            suggestions = ["¿Qué pulseras tienen?", "¿Cómo puedo personalizar una pulsera?", "¿Hacen envíos?"];
        } else if (/(precio|costo|cuanto vale|cuanto cuesta|valor|economico|barato)/i.test(normalized)) {
            reply = "Nuestras pulseras y accesorios tienen precios muy accesibles, desde $16.000 hasta $32.000 COP en sets especiales de pareja. Todo está elaborado a mano con materiales duraderos como acero inoxidable, oro golfi e hilo impermeable.";
            suggestions = ["Ver pulseras de pareja", "Ver pulseras personalizadas", "¿Cómo comprar?"];
            recommendedProducts = products.slice(0, 3);
        } else if (/(personaliz|inicial|letra|nombre|dije|hilo|color)/i.test(normalized)) {
            reply = "¡Nos encanta personalizar tus accesorios! 🥰 Puedes elegir la inicial de tu persona favorita, el color del hilo (rojo, negro, beige, palo de rosa, etc.) y dijes especiales en oro golfi o acero quirúrgico. ¡Hacemos que tu pulsera sea verdaderamente única!";
            suggestions = ["Ver Pulsera con Inicial", "Escribir por WhatsApp", "¿Tienen para parejas?"];
            recommendedProducts = products.filter(p => p.customizable);
        } else if (/(pareja|novio|novia|duo|san valentin|aniversario)/i.test(normalized)) {
            reply = "¡Nuestro Set Dúo de Parejas es el más pedido! 🖤🤍 Incluye dos pulseras ajustables con piedras naturales de Ónix negro mate y Cuarzo blanco, que representan equilibrio y amor eterno. Cuesta solo $32.000 el par.";
            suggestions = ["Ver Pulseras de Pareja", "Pedir por WhatsApp", "¿Cómo saber mi talla?"];
            recommendedProducts = products.filter(p => p.category === 'parejas');
        } else if (/(cuidado|limpiar|agua|banar|oxida|dura|despinta)/i.test(normalized)) {
            reply = "Para que tus pulseras y joyas Lume brillen como nuevas: 1) Evita el contacto directo con perfumes y lociones, 2) Límpialas suavemente con un paño seco y suave, y 3) Guárdalas en su bolsita de tela cuando no las estés usando. ¡Nuestros herrajes son de alta resistencia!";
            suggestions = ["¿De qué material son?", "Ver catálogo", "Contactar a Lume"];
        } else if (/(envio|domicilio|entrega|tiempo|tarda|ciudad|donde estan)/i.test(normalized)) {
            reply = "Hacemos envíos a nivel nacional 📦. Los pedidos personalizados toman 1 a 2 días hábiles en elaborarse a mano, y el envío toma entre 2 y 4 días hábiles según tu ciudad. ¡También coordinamos entregas locales rápidas!";
            suggestions = ["¿Cuánto cuesta el envío?", "Quiero hacer un pedido", "Ver productos"];
        } else if (/(material|oro|plata|acero|piedra|hilo)/i.test(normalized)) {
            reply = "En Lume seleccionamos materiales de excelente calidad: hilos encerados italianos de alta tenacidad, piedras naturales semipreciosas (cuarzo, ónix), mostacilla checa calibrada y herrajes hipoalergénicos en acero inoxidable y oro golfi.";
            suggestions = ["¿Se pueden mojar?", "Ver catálogo", "¿Cómo personalizar?"];
        } else if (/(hola|buenas|saludos|que tal|buen dia)/i.test(normalized)) {
            reply = "¡Hola! Bienvenida a Lume ✨. Soy Lumi, tu asesora virtual de accesorios y pulseras artesanales. Estoy aquí para ayudarte a elegir la joya perfecta, responder dudas sobre personalización, materiales o precios. ¿En qué puedo ayudarte hoy?";
            suggestions = ["Ver colección más vendida", "¿Cómo personalizar una pulsera?", "¿Quiénes crearon Lume?"];
        } else {
            reply = "¡Gracias por tu mensaje! En Lume creamos pulseras artesanales modernas y personalizadas. Con gusto puedo contarte sobre nuestros productos, materiales, precios, opciones de regalo o contactar directamente a María y Ángeles.";
            suggestions = ["Ver catálogo de pulseras", "¿Cómo personalizar?", "¿Quiénes crearon Lume?", "Hablar por WhatsApp"];
            recommendedProducts = products.slice(0, 2);
        }

        return {
            reply,
            suggestions,
            recommendedProducts
        };
    },

    // Utilidad de retardo simulado
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
};

// Sistema UI de Notificaciones Toast y Modales amigables
const LumeUI = {
    toast(message, type = 'info') {
        let container = document.getElementById('lume-toast-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'lume-toast-container';
            container.className = 'lume-toast-container';
            document.body.appendChild(container);
        }

        const toast = document.createElement('div');
        toast.className = `lume-toast lume-toast-${type}`;
        
        let icon = '✨';
        if (type === 'success') icon = '✓';
        if (type === 'error') icon = '✕';
        if (type === 'warning') icon = '⚠';

        toast.innerHTML = `
            <span class="lume-toast-icon">${icon}</span>
            <span class="lume-toast-text">${message}</span>
        `;
        container.appendChild(toast);

        setTimeout(() => {
            toast.classList.add('fade-out');
            setTimeout(() => toast.remove(), 400);
        }, 3600);
    },

    formatCurrency(amount) {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            maximumFractionDigits: 0
        }).format(amount);
    }
};

// Detección inicial de backend
LumeAPI.checkBackendAvailable();
