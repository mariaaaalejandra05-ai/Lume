/**
 * Lume - Capa de Almacenamiento Local y Respaldo Persistente
 * Garantiza que la aplicación funcione al 100% de manera estática en GitHub Pages
 * o sin conexión activa al servidor PHP.
 * 
 * Emprendimiento: Lume
 * Fundadoras: María González & Ángeles Navas
 */

const LUME_STORAGE_KEYS = {
    PRODUCTS: 'lume_products_v1',
    INQUIRIES: 'lume_inquiries_v1',
    AUTH: 'lume_auth_session_v1',
    BRAND: 'lume_brand_v1'
};

// Datos semilla de inicio basados en la identidad de Lume
const LUME_SEED_DATA = {
    brand: {
        name: "Lume",
        legalName: "Lumegn",
        tagline: "Pulseras y accesorios artesanales modernos y personalizados",
        description: "Lume es un emprendimiento dedicado a la elaboración de pulseras artesanales modernas y personalizadas, ofreciendo accesorios atractivos y de calidad a precios accesibles.",
        founders: ["María González", "Ángeles Navas"],
        targetAudience: "Jóvenes y adultos interesados en accesorios artesanales con significado.",
        whatsapp: "+57 300 123 4567",
        whatsappMessage: "¡Hola María y Ángeles! Me encantó su catálogo de Lume y quisiera hacer un pedido de pulseras personalizadas.",
        email: "contacto@lume.com",
        instagram: "@lume.accesorios"
    },
    products: [
        {
            id: 1,
            name: "Pulsera Hilo Rojo Destino",
            category: "pulseras",
            price: 18000,
            badge: "Más Vendido",
            description: "Elaborada a mano en técnica de macramé con nudo franciscano y dije en oro golfi hipoalergénico. Simboliza conexión eterna y protección.",
            materials: "Hilo encerado de alta resistencia, dije en oro golfi",
            customizable: true,
            stock: 25,
            image: "https://images.unsplash.com/photo-1611591475883-8a39ec8c6c57?auto=format&fit=crop&w=800&q=80"
        },
        {
            id: 2,
            name: "Pulseras Dúo Pareja Cuarzo y Ónix",
            category: "parejas",
            price: 32000,
            badge: "Especial Parejas",
            description: "Set de 2 pulseras ajustables con piedras semipreciosas naturales: Ónix negro mate y Cuarzo blanco. Representan el equilibrio y la unión.",
            materials: "Piedras naturales 8mm, hilo reforzado regulable",
            customizable: true,
            stock: 18,
            image: "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&w=800&q=80"
        },
        {
            id: 3,
            name: "Pulsera Personalizada con Inicial",
            category: "personalizadas",
            price: 22000,
            badge: "100% Personalizable",
            description: "Pulsera tejida con la letra de tu elección en dije de nácar o medalla dorada. Puedes elegir el tono del hilo a tu gusto.",
            materials: "Hilo italiano premium, dije de inicial en acero quirúrgico o nácar",
            customizable: true,
            stock: 30,
            image: "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?auto=format&fit=crop&w=800&q=80"
        },
        {
            id: 4,
            name: "Joya Gargantilla Destellos de Luz",
            category: "joyas",
            price: 28000,
            badge: "Nueva Colección",
            description: "Collar delicado con cadena de acero inoxidable y dije de circonia facetada brillante. Resistente al agua y de estilo minimalista.",
            materials: "Cadena de acero inoxidable resistente al agua, dije de circonia",
            customizable: false,
            stock: 12,
            image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80"
        },
        {
            id: 5,
            name: "Pulsera Mostacilla Flor Silvestre",
            category: "pulseras",
            price: 16000,
            badge: "Artesanal",
            description: "Diseño tejido a mano con mostacilla checa calibrada formando pequeñas flores en tonos pastel. Alegre, juvenil y veraniega.",
            materials: "Mostacilla checa de primera calidad, broche ajustable en macramé",
            customizable: true,
            stock: 20,
            image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80"
        },
        {
            id: 6,
            name: "Joya Tobillera Bohemia Marina",
            category: "joyas",
            price: 19000,
            badge: "Favorito de Verano",
            description: "Tobillera artesanal con pequeñas caracolas naturales seleccionadas y esferas doradas inoxidables. Regulable.",
            materials: "Hilo impermeable, caracolas naturales y acero inoxidable",
            customizable: false,
            stock: 15,
            image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=800&q=80"
        }
    ],
    inquiries: [
        {
            id: 1,
            name: "Camila Restrepo",
            email: "camila.r@example.com",
            phone: "+57 312 987 6543",
            subject: "Personalización de pulseras para regalo de grado",
            message: "Hola María y Ángeles! Me encantaron sus pulseras. Quisiera saber si pueden hacer 5 pulseras con iniciales doradas e hilo beige para fin de mes.",
            date: "2026-03-01 10:15",
            status: "leido"
        },
        {
            id: 2,
            name: "Valentina Osorio",
            email: "valentina.o@example.com",
            phone: "+57 320 456 7890",
            subject: "Consulta sobre envíos a Medellín",
            message: "¿Cuánto tarda en llegar el pedido de las pulseras de pareja a Medellín?",
            date: "2026-03-05 16:40",
            status: "nuevo"
        }
    ]
};

const LumeStorage = {
    init() {
        if (!localStorage.getItem(LUME_STORAGE_KEYS.PRODUCTS)) {
            localStorage.setItem(LUME_STORAGE_KEYS.PRODUCTS, JSON.stringify(LUME_SEED_DATA.products));
        }
        if (!localStorage.getItem(LUME_STORAGE_KEYS.INQUIRIES)) {
            localStorage.setItem(LUME_STORAGE_KEYS.INQUIRIES, JSON.stringify(LUME_SEED_DATA.inquiries));
        }
        if (!localStorage.getItem(LUME_STORAGE_KEYS.BRAND)) {
            localStorage.setItem(LUME_STORAGE_KEYS.BRAND, JSON.stringify(LUME_SEED_DATA.brand));
        }
    },

    getProducts() {
        this.init();
        try {
            return JSON.parse(localStorage.getItem(LUME_STORAGE_KEYS.PRODUCTS)) || [];
        } catch(e) {
            return LUME_SEED_DATA.products;
        }
    },

    saveProducts(products) {
        localStorage.setItem(LUME_STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    },

    getInquiries() {
        this.init();
        try {
            return JSON.parse(localStorage.getItem(LUME_STORAGE_KEYS.INQUIRIES)) || [];
        } catch(e) {
            return LUME_SEED_DATA.inquiries;
        }
    },

    saveInquiries(inquiries) {
        localStorage.setItem(LUME_STORAGE_KEYS.INQUIRIES, JSON.stringify(inquiries));
    },

    getAuth() {
        try {
            return JSON.parse(sessionStorage.getItem(LUME_STORAGE_KEYS.AUTH) || localStorage.getItem(LUME_STORAGE_KEYS.AUTH));
        } catch(e) {
            return null;
        }
    },

    setAuth(authData, persist = false) {
        const serialized = JSON.stringify(authData);
        sessionStorage.setItem(LUME_STORAGE_KEYS.AUTH, serialized);
        if (persist) {
            localStorage.setItem(LUME_STORAGE_KEYS.AUTH, serialized);
        }
    },

    clearAuth() {
        sessionStorage.removeItem(LUME_STORAGE_KEYS.AUTH);
        localStorage.removeItem(LUME_STORAGE_KEYS.AUTH);
    }
};

// Inicializar almacenamiento al cargar el script
LumeStorage.init();
