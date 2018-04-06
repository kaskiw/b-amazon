USE bamazon_schema;
CREATE TABLE products (
    item_id INTEGER(11) NOT NULL,
    product_name VARCHAR(45) NOT NULL,
    department_name VARCHAR(45) NOT NULL,
    price DECIMAL(2) NOT NULL,
    stock_quanity INTEGER(100) NOT NULL,
    PRIMARY KEY (item_id)
);