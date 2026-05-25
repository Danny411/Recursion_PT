CREATE DATABASE recursion_visualizer;

USE recursion_visualizer;

CREATE TABLE execution_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    example_name VARCHAR(255),
    input_value INT,
    result VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);