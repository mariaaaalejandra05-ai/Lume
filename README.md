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

## 🌸 FUNCIONALIDADES DEL PROYECTO

1. **Página de Inicio y Marca:**
   - Presentación de la marca Lume y su historia.
   - Diseño femenino, elegante y artesanal.
   - Totalmente responsivo para celulares, tablets y computadoras.

2. **Catálogo Interactivo de Productos:**
   - Filtros por categoría (*Todos*, *Pulseras*, *Joyas*, *Parejas*, *Personalizadas*).
   - Buscador por nombre y opción de ordenar por precio.
   - Modal de detalle con personalización de iniciales y color de hilo.
   - Botón directo para pedir por WhatsApp.

3. **Formulario de Contacto Funcional:**
   - Validaciones de campos (nombre, correo válido y mensaje).
   - Mensaje de confirmación y guardado para el panel de administración.
   - Botón de contacto directo por WhatsApp.

4. **Asistente Virtual (Inteligencia Artificial):**
   - Asistente "Lumi" que responde preguntas sobre precios, modelos, cuidados y personalización analizando palabras clave.

5. **Panel Privado de Administración (CRUD):**
   - Acceso con usuario y contraseña:
     - **Correo:** `admin@lume.com`
     - **Contraseña:** `lume123`
   - Gestión de productos: agregar nuevos modelos, editar datos y eliminar piezas.
   - Bandeja para revisar los mensajes que envían los clientes.

6. **Backend y Base de Datos:**
   - Archivos en PHP organizados en la carpeta `backend/api/`.
   - Script SQL (`backend/base_datos.sql`) para crear las tablas de usuarios, productos y mensajes.

---

## 📁 ESTRUCTURA DE CARPETAS

```
Lume/
├── backend/
│   ├── api/
│   │   ├── productos.php
│   │   ├── contacto.php
│   │   ├── login.php
│   │   └── chat-ia.php
│   ├── app.php
│   ├── conexion.php
│   └── base_datos.sql
├── frontend/
│   ├── css/
│   │   ├── style.css
│   │   └── admin.css
│   ├── js/
│   │   ├── productos.js
│   │   ├── contacto.js
│   │   ├── chat-ia.js
│   │   └── admin.js
│   ├── img/
│   ├── index.html
│   ├── login.html
│   └── admin.html
├── docs/
│   └── documentacion.md
├── index.html
└── README.md
```

---

## 🚀 CÓMO ABRIR EL PROYECTO

1. **Ver la tienda:** Abre directamente el archivo `frontend/index.html` en cualquier navegador web.
2. **Entrar al panel de administración:** Abre `frontend/login.html` e ingresa con:
   - Correo: `admin@lume.com`
   - Contraseña: `lume123`

---
© Lumegn — Proyecto desarrollado por María González y Ángeles Navas.
