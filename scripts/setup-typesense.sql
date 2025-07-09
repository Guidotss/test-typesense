-- Este script es para referencia de cómo estructurar los datos
-- Typesense usa JSON, no SQL, pero esto muestra la estructura

CREATE TABLE IF NOT EXISTS products (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    original_price DECIMAL(10,2),
    discount INTEGER,
    category VARCHAR(100) NOT NULL,
    image VARCHAR(500),
    rating DECIMAL(3,2) DEFAULT 0,
    reviews INTEGER DEFAULT 0,
    stock INTEGER DEFAULT 0,
    tags JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Índices para mejorar el rendimiento
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_price ON products(price);
CREATE INDEX idx_products_rating ON products(rating);
CREATE INDEX idx_products_stock ON products(stock);

-- Datos de ejemplo
INSERT INTO products (id, name, description, price, original_price, discount, category, image, rating, reviews, stock, tags) VALUES
('1', 'iPhone 15 Pro', 'El último iPhone con chip A17 Pro y cámara de 48MP', 999.99, 1099.99, 9, 'electronics', '/placeholder.svg', 4.8, 1250, 15, '["smartphone", "apple", "premium"]'),
('2', 'MacBook Air M2', 'Laptop ultradelgada con chip M2 y pantalla Liquid Retina', 1199.99, NULL, NULL, 'electronics', '/placeholder.svg', 4.9, 890, 8, '["laptop", "apple", "productivity"]'),
('3', 'Camiseta Premium Cotton', 'Camiseta 100% algodón orgánico, suave y cómoda', 29.99, 39.99, 25, 'clothing', '/placeholder.svg', 4.5, 324, 50, '["shirt", "cotton", "casual"]');
