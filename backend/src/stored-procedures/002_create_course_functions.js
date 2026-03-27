/**
 * Stored Procedures for Course Management Functions
 * User: Laura
 */

const mysql = require('mysql2/promise');

/**
 * Create a new course
 * @param {string} title - Course title
 * @param {string} description - Course description
 * @param {string} code - Course code
 * @param {number} maxStudents - Maximum number of students
 * @returns {Object} Created course
 */
async function createCourse(title, description, code, maxStudents) {
    const connection = await mysql.createConnection({
        host: process.env.DATABASE_HOST || 'localhost',
        user: process.env.DATABASE_USER || 'root',
        password: process.env.DATABASE_PASSWORD || '',
        database: process.env.DATABASE_NAME || 'school_db'
    });

    try {
        const [result] = await connection.execute(
            'INSERT INTO courses (title, description, code, max_students, created_at) VALUES (?, ?, ?, ?, NOW())',
            [title, description, code, maxStudents]
        );
        
        const courseId = result.insertId;
        
        // Create course settings
        await connection.execute(
            'INSERT INTO course_settings (course_id, duration_hours, language) VALUES (?, 0, NULL)',
            [courseId]
        );

        return { id: courseId, title, code, maxStudents };
    } finally {
        await connection.end();
    }
}

/**
 * Get course by ID
 * @param {number} courseId - Course ID
 * @returns {Object|null} Course or null
 */
async function getCourseById(courseId) {
    const connection = await mysql.createConnection({
        host: process.env.DATABASE_HOST || 'localhost',
        user: process.env.DATABASE_USER || 'root',
        password: process.env.DATABASE_PASSWORD || '',
        database: process.env.DATABASE_NAME || 'school_db'
    });

    try {
        const [rows] = await connection.execute(
            'SELECT c.*, cs.duration_hours, cs.language FROM courses c LEFT JOIN course_settings cs ON c.id = cs.course_id WHERE c.id = ?',
            [courseId]
        );

        return rows[0] || null;
    } finally {
        await connection.end();
    }
}

/**
 * Get course by code
 * @param {string} courseCode - Course code
 * @returns {Object|null} Course or null
 */
async function getCourseByCode(courseCode) {
    const connection = await mysql.createConnection({
        host: process.env.DATABASE_HOST || 'localhost',
        user: process.env.DATABASE_USER || 'root',
        password: process.env.DATABASE_PASSWORD || '',
        database: process.env.DATABASE_NAME || 'school_db'
    });

    try {
        const [rows] = await connection.execute(
            'SELECT c.*, cs.duration_hours, cs.language FROM courses c LEFT JOIN course_settings cs ON c.id = cs.course_id WHERE c.code = ?',
            [courseCode]
        );

        return rows[0] || null;
    } finally {
        await connection.end();
    }
}

/**
 * Update course information
 * @param {number} courseId - Course ID
 * @param {Object} updates - Fields to update
 * @returns {Object} Updated course
 */
async function updateCourse(courseId, updates) {
    const allowedFields = ['title', 'description', 'code', 'max_students'];
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

    values.push(courseId);
    values.push('updated_at');

    const connection = await mysql.createConnection({
        host: process.env.DATABASE_HOST || 'localhost',
        user: process.env.DATABASE_USER || 'root',
        password: process.env.DATABASE_PASSWORD || '',
        database: process.env.DATABASE_NAME || 'school_db'
    });

    try {
        const [result] = await connection.execute(
            `UPDATE courses SET ${updateFields.join(', ')} WHERE id = ?`,
            values
        );

        return getCourseById(courseId);
    } finally {
        await connection.end();
    }
}

/**
 * Delete course
 * @param {number} courseId - Course ID
 * @returns {boolean} Success
 */
async function deleteCourse(courseId) {
    const connection = await mysql.createConnection({
        host: process.env.DATABASE_HOST || 'localhost',
        user: process.env.DATABASE_USER || 'root',
        password: process.env.DATABASE_PASSWORD || '',
        database: process.env.DATABASE_NAME || 'school_db'
    });

    try {
        await connection.execute('DELETE FROM courses WHERE id = ?', [courseId]);
        return true;
    } finally {
        await connection.end();
    }
}

/**
 * Get all courses
 * @returns {Array} List of courses
 */
async function getAllCourses() {
    const connection = await mysql.createConnection({
        host: process.env.DATABASE_HOST || 'localhost',
        user: process.env.DATABASE_USER || 'root',
        password: process.env.DATABASE_PASSWORD || '',
        database: process.env.DATABASE_NAME || 'school_db'
    });

    try {
        const [rows] = await connection.execute(
            'SELECT c.*, cs.duration_hours, cs.language FROM courses c LEFT JOIN course_settings cs ON c.id = cs.course_id ORDER BY c.created_at DESC'
        );

        return rows;
    } finally {
        await connection.end();
    }
}

module.exports = {
    createCourse,
    getCourseById,
    getCourseByCode,
    updateCourse,
    deleteCourse,
    getAllCourses
};
