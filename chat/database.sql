-- Create the database
CREATE DATABASE messaging_db;

-- Use the newly created database
USE messaging_db;

-- Create the messages table to store chat messages
CREATE TABLE messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    content TEXT NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);
