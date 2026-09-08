# Lume 

## DESCRIPCIÓN
Lume es un emprendimiento dedicado a la elaboración de pulseras artesanales modernas y personalizadas, ofreciendo accesorios atractivos y de calidad a precios accesibles.

## OBJETIVOS
- Ofrecer accesorios atractivos y de calidad a precios accesibles.
- Conectar emociones y recuerdos a través de piezas hechas a mano con dedicación.
- Brindar una experiencia de compra personalizada y moderna, tanto digital como física.

## PÚBLICO OBJETIVO
Jóvenes y adultos interesados en accesorios artesanales modernos, significativos y personalizados.

## INTEGRANTES
- **María González**
- **Ángeles Navas**

---

## 🌟 CARACTERÍSTICAS PRINCIPALES DEL PROYECTO

### 1. Frontend Femenino, Elegante & Artesanal
- **Diseño Editorial y Moderno**: Paleta de colores cálida y sofisticada (oro rosa, terracota suave, arena y marfil) combinada con tipografías `Playfair Display` y `Poppins`.
- **100% Responsivo**: Adaptado perfectamente para celulares (320px - 430px), tablets y pantallas de escritorio.
- **Microinteracciones y Feedback Visual**: Tarjetas con elevación suave, estados de carga con spinners, notificaciones toast y modales interactivos.

### 2. Catálogo Interactivo Conectado al Panel de Control
- Filtros por categoría en tiempo real: *Todas*, *Pulseras*, *Joyas & Collares*, *Sets de Pareja*, *Personalizadas*.
- Buscador instantáneo por nombre o materiales y selector de ordenamiento por precio.
- Modal de vista rápida y personalizador (selección de iniciales y color de hilo).
- Botón de pedido directo por WhatsApp con mensaje preconfigurado.

### 3. Formulario de Contacto Real y Funcional
- Validación de campos en tiempo real (nombre, email válido, motivo y mensaje detallado).
- Estados de carga (spinner en botón durante el envío).
- Retroalimentación mediante alertas elegantes y notificaciones toast.
- Las consultas se guardan de forma persistente y pueden gestionarse desde el Panel de Administración.

### 4. Asistente Virtual Inteligente ("Lumi")
- Widget conversacional personalizado flotante en la esquina inferior derecha.
- Conoce a fondo la marca Lume: historia de María González y Ángeles Navas, productos, precios, personalización, materiales (macramé, acero, oro golfi, piedras naturales) y cuidados de las piezas.
- Botones de preguntas frecuentes y recomendaciones dinámicas de productos con enlace a la vista rápida.

### 5. Autenticación y Panel Privado de Administración (Dashboard)
- **Acceso seguro**: Pantalla de login (`frontend/login.html`) con validación de credenciales y protección de sesión.
- **Métricas en tiempo real**: Conteo de piezas en catálogo, consultas totales y mensajes nuevos.
- **CRUD Completo de Productos**: Crear, previsualizar imagen, editar información y eliminar piezas con confirmación.
- **Bandeja de Mensajes de Clientes**: Ver mensajes recibidos, marcar como atendidos y responder directamente por WhatsApp o correo.

### 6. Backend RESTful, Base de Datos y Adaptador Híbrido
- **Backend PHP**: Endpoints REST modulares y organizados:
  - `GET / POST / PUT / DELETE /backend/api/products.php`
  - `POST / GET /backend/api/auth.php`
  - `POST / GET / PUT /backend/api/contact.php`
  - `POST /backend/api/ai.php`
- **Base de Datos**: Esquema relacional SQL (`backend/data/schema.sql`) y persistencia estructurada (`backend/data/seed.json`).
- **Adaptador Híbrido para GitHub Pages**: El cliente `frontend/js/api.js` detecta automáticamente si hay servidor PHP activo o si se ejecuta en un hosting estático como GitHub Pages; en este último caso, utiliza una capa persistente en `localStorage` preconfigurada, permitiendo que la tienda, el panel administrativo, el CRUD y la IA funcionen al 100% sin caídas ni errores 404.

---

## 🔐 CREDENCIALES DEL PANEL DE ADMINISTRACIÓN

- **URL de Acceso**: `frontend/login.html` (o desde el enlace en el menú y pie de página)
- **Correo**: `admin@lume.com`
- **Contraseña**: `lume123`

---

## 🚀 CÓMO EJECUTAR EL PROYECTO LOCALMENTE

### Opción A: Modo Estático / Servidor Web (o Doble Clic)
1. Abre directamente el archivo `index.html` o `frontend/index.html` en tu navegador.
2. La plataforma operará inmediatamente con todas sus funciones activas (catálogo, filtros, formulario, admin y asistente IA).

### Opción B: Con Servidor PHP Local
1. Abre una terminal en la carpeta raíz del proyecto:
   ```bash
   php -S localhost:8000
   ```
2. Abre tu navegador en `http://localhost:8000`.

---

## 🌐 PUBLICACIÓN EN GITHUB PAGES

El proyecto está preparado para publicarse en GitHub Pages con 1 solo clic:
1. Ve a tu repositorio en GitHub: **Settings > Pages**.
2. En **Build and deployment > Branch**, selecciona la rama `main` y la carpeta `/ (root)`.
3. Haz clic en **Save**.
4. ¡Listo! Tu página estará en línea en `https://<tu-usuario>.github.io/Lume/`.

---

## 📁 ESTRUCTURA DEL PROYECTO

```
Lume/
├── index.html                   # Redirección y punto de entrada para GitHub Pages
├── .nojekyll                    # Configuración para compatibilidad con GitHub Pages
├── .gitignore                   # Exclusiones de Git
├── README.md                    # Descripción y documentación general
├── docs/
│   └── documentacion.md         # Especificaciones técnicas de APIs y arquitectura
├── backend/
│   ├── app.php                  # Router y estado del servicio backend
│   ├── config.php               # CORS, encabezados y helpers
│   ├── db.php                   # Capa de datos y persistencia
│   ├── data/
│   │   ├── schema.sql           # Esquema SQL relacional
│   │   └── seed.json            # Datos semilla iniciales
│   └── api/
│       ├── auth.php             # Endpoint de autenticación
│       ├── products.php         # Endpoint CRUD de productos
│       ├── contact.php          # Endpoint de formulario de contacto
│       └── ai.php               # Endpoint del asistente de IA Lumi
└── frontend/
    ├── index.html               # Página web principal de Lume
    ├── login.html               # Login del panel privado
    ├── admin.html               # Dashboard y panel de administración
    ├── style.css                # Estilos generales del diseño artesanal femenino
    ├── css/
    │   ├── admin.css            # Estilos del panel de control y login
    │   └── ai-chat.css          # Estilos del asistente virtual Lumi
    ├── js/
    │   ├── storage.js           # Persistencia local y datos semilla
    │   ├── api.js               # Cliente API y adaptador híbrido
    │   ├── catalog.js           # Lógica reactiva del catálogo y filtros
    │   ├── contact.js           # Validación y envío de contacto
    │   ├── ai-assistant.js      # Inteligencia Artificial conversacional
    │   ├── auth.js              # Manejo de sesiones y protección de rutas
    │   └── admin.js             # Lógica de dashboard y CRUD del admin
    └── img/
        └── basic/               # Archivos de recursos y ejercicios conservados
```

---
© Lumegn — Emprendimiento creado con amor por María González y Ángeles Navas.
