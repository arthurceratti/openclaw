-- PostgreSQL Database Schema for Student Management System
-- Initialize on database startup

-- Create database if not exists
CREATE DATABASE student_db;
\c student_db

-- Users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    student_id VARCHAR(50) UNIQUE NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'student',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Courses table
CREATE TABLE courses (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    credits INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Enrollments table
CREATE TABLE enrollments (
    id SERIAL PRIMARY KEY,
    student_id INTEGER REFERENCES users(student_id),
    course_id INTEGER REFERENCES courses(id),
    score DECIMAL(5, 2),
    enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(student_id, course_id)
);

-- AI chat history table
CREATE TABLE ai_chat_history (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    prompt TEXT NOT NULL,
    response TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert initial sample data
-- Sample users
INSERT INTO users (name, password_hash, student_id, role) VALUES
('John Doe', '$2b$10$EixZa2NKcjkQWxXNUaA9mKCoijwJPBj6BZt27VYt4qJQwX6lAaMW.', 'STU001', 'student'),
('Jane Smith', '$2b$10$EixZa2NKcjkQWxXNUaA9mKCoijwJPBj6BZt27VYt4qJQwX6lAaMW.', 'STU002', 'student'),
('Prof. Anderson', '$2b$10$EixZa2NKcjkQWxXNUaA9mKCoijwJPBj6BZt27VYt4qJQwX6lAaMW.', 'STU003', 'instructor');

-- Sample courses
INSERT INTO courses (title, description, credits) VALUES
('Introduction to Programming', 'Learn the fundamentals of programming', 3),
('Data Structures & Algorithms', 'Advanced data structures and algorithm analysis', 4),
('Web Development', 'Full-stack web development with modern frameworks', 3);

-- Sample enrollments
INSERT INTO enrollments (student_id, course_id, score) VALUES
(1, 1, NULL),
(1, 2, NULL),
(1, 3, NULL),
(2, 1, NULL),
(2, 2, 95.50),
(2, 3, NULL),
(3, 2, 88.00);

-- Sample AI chat history
INSERT INTO ai_chat_history (user_id, prompt, response) VALUES
(1, 'What is a good way to learn Python?', 'Python is an excellent language for beginners. Start with tutorials on Python.org, practice with coding challenges, and build small projects.'),
(1, 'What are the best data structures for a tree?', 'A binary tree is ideal for hierarchical data. Each node has at most two children. Common implementations include BST, AVL trees, and heaps.');
