-- Base de Datos para el proyecto Lume
-- Realizado por: María González

CREATE DATABASE IF NOT EXISTS lume_db;
USE lume_db;

-- Tabla para guardar el usuario administrador
CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    correo VARCHAR(100) NOT NULL UNIQUE,
    clave VARCHAR(100) NOT NULL,
    rol VARCHAR(20) DEFAULT 'admin'
);

-- Tabla para guardar las pulseras y productos
CREATE TABLE IF NOT EXISTS productos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    categoria VARCHAR(50) NOT NULL,
    precio INT NOT NULL,
    descripcion TEXT NOT NULL,
    materiales VARCHAR(200) NOT NULL,
    imagen TEXT NOT NULL,
    personalizable TINYINT(1) DEFAULT 1,
    stock INT DEFAULT 10
);

-- Tabla para guardar los mensajes de contacto
CREATE TABLE IF NOT EXISTS mensajes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    correo VARCHAR(100) NOT NULL,
    telefono VARCHAR(50),
    asunto VARCHAR(150) NOT NULL,
    mensaje TEXT NOT NULL,
    fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
    estado VARCHAR(20) DEFAULT 'nuevo'
);

-- Usuario administrador inicial
INSERT INTO usuarios (nombre, correo, clave, rol) 
VALUES ('María González', 'admin@lume.com', 'lume123', 'admin');

-- Algunos productos de ejemplo
INSERT INTO productos (nombre, categoria, precio, descripcion, materiales, imagen, personalizable, stock) VALUES
('Pulsera Hilo Rojo Destino', 'pulseras', 18000, 'Tejida a mano con nudo franciscano y dije dorado. Simboliza protección y amor.', 'Hilo encerado y oro golfi', 'https://images.unsplash.com/photo-1611591475883-8a39ec8c6c57?w=800', 1, 20),
('Dúo de Pulseras para Pareja', 'parejas', 32000, 'Set de 2 pulseras con piedras naturales de Ónix y Cuarzo blanco para parejas.', 'Piedras naturales 8mm', 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=800', 1, 15),
('Pulsera con Inicial Personalizada', 'personalizadas', 22000, 'Pulsera hecha a mano con la letra que elijas en dije de nácar o medalla.', 'Hilo italiano e inicial en acero', 'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=800', 1, 25),
('Gargantilla Destellos', 'joyas', 28000, 'Collar delicado con cadena en acero inoxidable y dije de circonia brillante.', 'Acero inoxidable y circonia', 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800', 0, 10);
