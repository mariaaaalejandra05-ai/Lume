# Documentación del Proyecto: Lume

Este proyecto corresponde al proyecto de Lume.

- **Nombre del Emprendimiento:** Lume (Lumegn)
- **Fundadora:** María González
- **Descripción:** Emprendimiento de accesorios y pulseras artesanales modernas y personalizadas a precios accesibles.

---

## 1. Organización de Carpetas

La estructura del proyecto está separada y organizada de forma clara:

```
Lume/
├── backend/
│   ├── api/
│   │   ├── productos.php    -> API para consultar, crear y borrar productos
│   │   ├── contacto.php     -> API para recibir los mensajes del formulario
│   │   ├── login.php        -> API para validar el ingreso del administrador
│   │   └── chat-ia.php      -> API del chatbot con respuestas de la marca
│   ├── app.php              -> Archivo principal del backend
│   ├── conexion.php         -> Configuración básica y funciones de respuesta
│   └── base_datos.sql       -> Código SQL para crear las tablas en MySQL
│
├── frontend/
│   ├── css/
│   │   ├── style.css        -> Estilos principales de la tienda (responsive)
│   │   └── admin.css        -> Estilos para el login y el panel de administración
│   ├── js/
│   │   ├── productos.js     -> Catálogo interactivo, filtros, búsqueda y modal
│   │   ├── contacto.js      -> Validación y envío del formulario de contacto
│   │   ├── chat-ia.js       -> Asistente virtual Lumi con palabras clave
│   │   └── admin.js         -> Funciones para gestionar productos y ver mensajes
│   ├── img/                 -> Imágenes del proyecto y ejercicios
│   ├── index.html           -> Página web principal para los clientes
│   ├── login.html           -> Pantalla de inicio de sesión de admin
│   └── admin.html           -> Panel privado de control
│
├── docs/
│   └── documentacion.md     -> Esta documentación del proyecto
│
├── index.html               -> Redirección para publicación en GitHub Pages
└── README.md                -> Descripción general del proyecto
```

---

## 2. Cómo Explicar el Proyecto en la Presentación

Si el profesor o evaluador te pregunta cómo funciona cada parte, aquí tienes las explicaciones sencillas y claras:

### ¿Cómo funciona el Catálogo de Productos?
- Los datos de las pulseras se encuentran en un arreglo de objetos en JavaScript (`productos.js`).
- Con la función `mostrarProductos()`, recorremos el arreglo y generamos las tarjetas en pantalla con su foto, precio y descripción.
- Si el usuario hace clic en una categoría (ejemplo: *Parejas* o *Pulseras*), usamos el método `.filter()` para mostrar únicamente las piezas de esa categoría.
- También incluye un buscador en tiempo real y la opción de ordenar por precio.
- Al hacer clic en **Ver detalles**, se abre una ventana modal donde la persona puede elegir sus iniciales o color de hilo y hacer su pedido directamente por WhatsApp.

### ¿Cómo funciona el Formulario de Contacto?
- En `contacto.js`, capturamos el evento `submit` del formulario para evitar que la página se recargue.
- Validamos que el nombre no esté vacío, que el correo tenga el formato correcto (`@` y `.`) y que el mensaje tenga contenido suficiente.
- Mostramos un estado de carga mientras se procesa.
- El mensaje se almacena para que la administradora (María González) pueda leerlo en el panel de control.

### ¿Cómo funciona el Asistente Virtual (Inteligencia Artificial)?
- En `chat-ia.js`, creamos una función que analiza el texto que escribe el usuario buscando **palabras clave** (por ejemplo: si contiene *"precio"*, *"pareja"*, *"personalizar"*, *"envío"* o *"María"*).
- Dependiendo de la palabra clave, el asistente responde con información precisa del emprendimiento y ofrece botones con preguntas sugeridas.

### ¿Cómo funciona el Panel de Administración (CRUD)?
- Para entrar, se solicitan las credenciales:
  - **Correo:** `admin@lume.com`
  - **Clave:** `lume123`
- Al ingresar, el panel permite:
  1. **Crear:** Agregar una nueva pulsera con su nombre, categoría, precio, materiales y foto.
  2. **Leer:** Ver la lista de todas las piezas registradas y las estadísticas.
  3. **Editar:** Modificar el precio, stock o datos de una pulsera existente.
  4. **Eliminar:** Quitar una pieza del catálogo con confirmación previa.
  5. **Bandeja de Mensajes:** Ver las consultas enviadas por los clientes y responderles con un clic por WhatsApp o correo electrónico.

### ¿Cómo está adaptado para Celulares y Computadoras (Responsive)?
- En `style.css`, utilizamos `CSS Grid` y `Flexbox`, además de `@media (max-width: 768px)`.
- En computadoras, los productos se organizan en 3 columnas; en tablets en 2 columnas, y en celulares en 1 sola columna.
- En pantallas pequeñas, el menú de navegación se oculta y aparece un botón de menú tipo hamburguesa que se despliega al tocarlo.

---

## 3. Medidas de Seguridad Implementadas

Para que el proyecto sea seguro y profesional, aplicamos las siguientes buenas prácticas que puedes mencionar con orgullo en tu presentación:

1. **Protección contra Inyecciones XSS (Cross-Site Scripting):**
   - Creamos la función `sanitizar()` en JavaScript que limpia cualquier símbolo peligroso (`<`, `>`, `"`, `'`) antes de guardarlo o mostrarlo.
   - En PHP aplicamos `htmlspecialchars()` para asegurar que ningún usuario pueda inyectar código dañino a través del formulario de contacto ni en los productos.

2. **Protección contra Ataques de Fuerza Bruta (Login Bloqueable):**
   - El sistema cuenta con un límite de 3 intentos fallidos de inicio de sesión.
   - Si alguien se equivoca 3 veces, el botón de ingreso se deshabilita automáticamente y se bloquea el acceso durante 30 segundos con un temporizador en pantalla.

3. **Ocultamiento de Accesos Sensibles:**
   - No mostramos contraseñas en texto visible en la pantalla de login.
   - El acceso al panel de administración se retiró del menú principal de clientes para mantenerlo privado y discreto, tal como se hace en tiendas reales.
   - Incluimos un botón con ícono de ojo para mostrar u ocultar la contraseña de forma cómoda.

4. **Protección de Rutas Administrativas:**
   - Si alguien intenta escribir directamente en el navegador `admin.html` sin haber iniciado sesión antes, la función `verificarAccesoAdmin()` lo detecta de inmediato y lo expulsa a la pantalla de login.

5. **Cabeceras de Seguridad en el Servidor (HTTP Headers):**
   - `X-Content-Type-Options: nosniff`: Evita que el navegador interprete archivos con tipos MIME incorrectos.
   - `X-Frame-Options: SAMEORIGIN`: Protege contra ataques de Clickjacking.
   - `X-XSS-Protection: 1; mode=block`: Activa el filtro del navegador contra scripts sospechosos.