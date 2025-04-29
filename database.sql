-- Create the database
CREATE DATABASE messaging_db;


-- Use the newly created database
USE messaging_db;


-- Create the messages table to store chat messages
CREATE TABLE messages (
    id INT AUTO_INCREMENT PRIMARY KEY,   -- Unique ID for each message
    username VARCHAR(50) NOT NULL,       -- The username of the sender
    content TEXT NOT NULL,               -- The message content
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP -- Time message was sent
);