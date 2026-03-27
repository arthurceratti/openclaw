/**
 * Stored Procedures for Student Management Functions
 * User: Laura
 */

const mysql = require('mysql2/promise');

/**
 * Create a new student
 * @param {string} email - Student email
 * @param {string} password - Student password
 * @param {string} name - Student name
 * @param {number} studentId - Student ID (unique identifier)
 * @returns {Object} Created student
 */
async function createStudent(email, password, name, studentId) {
    const connection = await mysql.createConnection({
        host: process.env.DATABASE_HOST || 'localhost',
        user: process.env.DATABASE_USER || 'root',
        password: process.env.DATABASE_PASSWORD || '',
        database: process.env.DATABASE_NAME || 'school_db'
    });

    try {
        const [result] = await connection.execute(
            'INSERT INTO students (email, password, name, student_id, created_at) VALUES (?, ?, ?, ?, NOW())',
            [email, password, name, studentId]
        );
        
        const studentId = result.insertId;
        
        // Create student profile
        await connection.execute(
            'INSERT INTO student_profiles (student_id, bio, avatar_url) VALUES (?, NULL, NULL)',
            [studentId]
        );

        return { id: studentId, email, name, studentId: studentId };
    } finally {
        await connection.end();
    }
}

/**
 * Get student by ID
 * @param {number} studentId - Student ID
 * @returns {Object|null} Student or null
 */
async function getStudentById(studentId) {
    const connection = await mysql.createConnection({
        host: process.env.DATABASE_HOST || 'localhost',
        user: process.env.DATABASE_USER || 'root',
        password: process.env.DATABASE_PASSWORD || '',
        database: process.env.DATABASE_NAME || 'school_db'
    });

    try {
        const [rows] = await connection.execute(
            'SELECT s.*, sp.bio, sp.avatar_url FROM students s LEFT JOIN student_profiles sp ON s.id = sp.student_id WHERE s.id = ?',
            [studentId]
        );

        return rows[0] || null;
    } finally {
        await connection.end();
    }
}

/**
 * Get student by student_id
 * @param {string} studentId - Student ID
 * @returns {Object|null} Student or null
 */
async function getStudentByStudentId(studentId) {
    const connection = await mysql.createConnection({
        host: process.env.DATABASE_HOST || 'localhost',
        user: process.env.DATABASE_USER || 'root',
        password: process.env.DATABASE_PASSWORD || '',
        database: process.env.DATABASE_NAME || 'school_db'
    });

    try {
        const [rows] = await connection.execute(
            'SELECT s.*, sp.bio, sp.avatar_url FROM students s LEFT JOIN student_profiles sp ON s.id = sp.student_id WHERE s.student_id = ?',
            [studentId]
        );

        return rows[0] || null;
    } finally {
        await connection.end();
    }
}

/**
 * Update student information
 * @param {number} studentId - Student ID
 * @param {Object} updates - Fields to update
 * @returns {Object} Updated student
 */
async function updateStudent(studentId, updates) {
    const allowedFields = ['name', 'email', 'bio', 'avatar_url'];
    const updateFields = [];
    const values = [];

    for (const [field, value] of Object.entries(updates)) {
        if (allowedFields.includes(field)) {
            updateFields.push(`${field} = ?`);
            values.push(value);
        }
    }

    if (updateFields.length === 0) {
        throw new Error('No valid fields to update');
    }

    values.push(studentId);
    values.push('updated_at');

    const connection = await mysql.createConnection({
        host: process.env.DATABASE_HOST || 'localhost',
        user: process.env.DATABASE_USER || 'root',
        password: process.env.DATABASE_PASSWORD || '',
        database: process.env.DATABASE_NAME || 'school_db'
    });

    try {
        const [result] = await connection.execute(
            `UPDATE students SET ${updateFields.join(', ')} WHERE id = ?`,
            values
        );

        return getStudentById(studentId);
    } finally {
        await connection.end();
    }
}

/**
 * Delete student
 * @param {number} studentId - Student ID
 * @returns {boolean} Success
 */
async function deleteStudent(studentId) {
    const connection = await mysql.createConnection({
        host: process.env.DATABASE_HOST || 'localhost',
        user: process.env.DATABASE_USER || 'root',
        password: process.env.DATABASE_PASSWORD || '',
        database: process.env.DATABASE_NAME || 'school_db'
    });

    try {
        await connection.execute('DELETE FROM students WHERE id = ?', [studentId]);
        return true;
    } finally {
        await connection.end();
    }
}

/**
 * Get all students
 * @returns {Array} List of students
 */
async function getAllStudents() {
    const connection = await mysql.createConnection({
        host: process.env.DATABASE_HOST || 'localhost',
        user: process.env.DATABASE_USER || 'root',
        password: process.env.DATABASE_PASSWORD || '',
        database: process.env.DATABASE_NAME || 'school_db'
    });

    try {
        const [rows] = await connection.execute(
            'SELECT s.*, sp.bio, sp.avatar_url FROM students s LEFT JOIN student_profiles sp ON s.id = sp.student_id ORDER BY s.created_at DESC'
        );

        return rows;
    } finally {
        await connection.end();
    }
}

module.exports = {
    createStudent,
    getStudentById,
    getStudentByStudentId,
    updateStudent,
    deleteStudent,
    getAllStudents
};
