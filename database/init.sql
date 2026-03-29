-- Create tables
CREATE TABLE IF NOT EXISTS courses (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS students (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    course VARCHAR(255),
    progress INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS modules (
    id VARCHAR(255) PRIMARY KEY,
    course_id VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    duration VARCHAR(50),
    completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);

-- Insert sample data
INSERT INTO courses (id, name, description) VALUES
('course_123', 'React Avançado', 'Curso completo de React para desenvolvedores'),
('course_456', 'Node.js Backend', 'Aprenda a criar APIs com Node.js'),
('course_789', 'JavaScript Moderno', 'ES6+ e boas práticas');

INSERT INTO students (id, name, email, course) VALUES
('user_123', 'Arthur', 'arthur@example.com', 'React Avançado'),
('user_456', 'Maria', 'maria@example.com', 'Node.js Backend'),
('user_789', 'João', 'joao@example.com', 'JavaScript Moderno');

INSERT INTO modules (id, course_id, title, description, duration) VALUES
('mod_1', 'course_123', 'Introdução ao React', 'Fundamentos do React', '2 horas'),
('mod_2', 'course_123', 'Hooks e Context API', 'Hooks avançados', '3 horas'),
('mod_3', 'course_123', 'Roteamento', 'React Router', '2 horas');
