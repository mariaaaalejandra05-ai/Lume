# Documentación Técnica del Proyecto Lume

Este proyecto corresponde al proyecto de Lume.

Emprendimiento: **Lume** (Lumegn)  
Fundadoras: **María González** & **Ángeles Navas**  
Giro: Elaboración de pulseras artesanales modernas y personalizadas, y joyería delicada de alta calidad a precios accesibles.

---

## 1. Arquitectura del Sistema

El proyecto Lume está diseñado bajo un patrón de **Separación de Responsabilidades** (Frontend desacoplado de Backend), garantizando tanto la ejecución completa en servidores web con soporte PHP/MySQL como la publicación estática autónoma en **GitHub Pages**.

```
         ┌──────────────────────────────────────────────┐
         │              CLIENTE FRONTEND                │
         │  (HTML5 Semántico, CSS3 Vanilla, JavaScript) │
         └───────────────────────┬──────────────────────┘
                                 │
                     ┌───────────┴───────────┐
                     ▼                       ▼
          [ Entorno con PHP ]       [ GitHub Pages / Offline ]
                     │                       │
                     ▼                       ▼
         ┌───────────────────────┐   ┌───────────────────────┐
         │  Backend RESTful PHP  │   │ Capa LocalStorage     │
         │  (Endpoints modulares)│   │ (Persistencia cliente)│
         └───────────┬───────────┘   └───────────────────────┘
                     │
                     ▼
         ┌───────────────────────┐
         │ Base de Datos / Store │
         │ (SQL / seed.json)     │
         └───────────────────────┘
```

---

## 2. Especificación de Endpoints (API REST)

Todos los endpoints retornan respuestas en formato estándar JSON:
```json
{
  "success": true,
  "message": "Mensaje descriptivo",
  "data": { ... },
  "timestamp": "2026-03-08 17:30:00"
}
```

### 2.1. Catálogo de Productos (`/backend/api/products.php`)
- **GET `?category={categoria}&search={termino}`**: Lista productos filtrados o todos si no se especifican parámetros.
- **GET `?id={id}`**: Obtiene la información detallada de una pieza específica.
- **POST**: Crea una nueva pieza artesanal en el catálogo. Requiere payload con `name`, `category`, `price`, `description`, `image`, `stock`, `customizable`.
- **PUT `?id={id}`**: Actualiza los campos de un producto existente.
- **DELETE `?id={id}`**: Elimina un producto del catálogo.

### 2.2. Autenticación (`/backend/api/auth.php`)
- **POST `action=login`**: Valida credenciales (`email`, `password`) y genera sesión / token.
- **GET**: Verifica si existe una sesión activa y retorna el usuario autenticado.
- **POST `action=logout`**: Destruye la sesión activa.

### 2.3. Formulario de Contacto (`/backend/api/contact.php`)
- **POST**: Registra una nueva consulta de un cliente con validación de nombre, correo, asunto y mensaje.
- **GET**: Lista todas las consultas registradas para el panel de administración.
- **PUT**: Permite actualizar el estado de una consulta (marcar como `leido` / `atendido`).

### 2.4. Asistente Inteligente Lumi (`/backend/api/ai.php`)
- **POST**: Recibe un mensaje en lenguaje natural (`query` o `message`), realiza análisis semántico del texto y devuelve respuesta empática, sugerencias interactivas y productos recomendados del catálogo de Lume.

---

## 3. Modelo de Datos

### Tabla `users`
- `id`: Entero, clave primaria autoincremental.
- `name`: Nombre de las administradoras (María González & Ángeles Navas).
- `email`: Correo electrónico único (`admin@lume.com`).
- `password`: Contraseña de acceso.
- `role`: Rol de usuario (`admin`).

### Tabla `products`
- `id`: Entero, clave primaria autoincremental.
- `name`: Nombre de la pieza artesanal.
- `category`: Categoría (`pulseras`, `joyas`, `parejas`, `personalizadas`).
- `price`: Precio en moneda local (COP $).
- `badge`: Distintivo promocional opcional (*Más Vendido*, *Artesanal*, etc.).
- `description`: Descripción y significado de la pieza.
- `materials`: Materiales utilizados (hilo macramé, acero inoxidable, oro golfi, piedras naturales).
- `customizable`: Booleano (1 si permite personalizar dijes/hilos, 0 si no).
- `stock`: Cantidad disponible.
- `image`: URL de la imagen ilustrativa.

### Tabla `inquiries`
- `id`: Entero, clave primaria autoincremental.
- `name`: Nombre del cliente.
- `email`: Correo del cliente.
- `phone`: Número de contacto o WhatsApp.
- `subject`: Motivo de la consulta.
- `message`: Contenido del mensaje.
- `status`: Estado (`nuevo`, `leido`).
- `created_at`: Fecha y hora de recepción.

---

## 4. Guía de Uso del Panel de Administración

1. Ingresar a `frontend/login.html`.
2. Digitar las credenciales de administradora:
   - Correo: `admin@lume.com`
   - Contraseña: `lume123`
3. En el **Dashboard**:
   - Monitorear métricas de piezas en inventario y consultas nuevas.
   - En la pestaña **Gestión de Catálogo**:
     - Presionar **+ Nueva Pieza Artesanal** para agregar un nuevo diseño al catálogo.
     - Presionar **✏️ Editar** en cualquier fila para modificar precios, stock o descripción.
     - Presionar **🗑️ Borrar** para remover un producto agotado.
   - En la pestaña **Bandeja de Contacto**:
     - Revisar los mensajes enviados por los clientes.
     - Hacer clic en **💬 Responder por WhatsApp** o **✉️ Responder por Correo** para contactar inmediatamente al cliente.
     - Marcar el mensaje como atendido.
4. Para salir, presionar **Cerrar Sesión** en la barra superior.