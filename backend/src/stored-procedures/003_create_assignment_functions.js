/**
 * Stored Procedures for Assignment Management Functions
 * User: Laura
 */

const mysql = require('mysql2/promise');

/**
 * Create a new assignment
 * @param {number} courseId - Course ID
 * @param {string} title - Assignment title
 * @param {string} description - Assignment description
 * @param {Date} dueDate - Assignment due date
 * @param {number} maxPoints - Maximum points
 * @returns {Object} Created assignment
 */
async function createAssignment(courseId, title, description, dueDate, maxPoints) {
    const connection = await mysql.createConnection({
        host: process.env.DATABASE_HOST || 'localhost',
        user: process.env.DATABASE_USER || 'root',
        password: process.env.DATABASE_PASSWORD || '',
        database: process.env.DATABASE_NAME || 'school_db'
    });

    try {
        const [result] = await connection.execute(
            'INSERT INTO assignments (course_id, title, description, due_date, max_points, created_at) VALUES (?, ?, ?, ?, ?, NOW())',
            [courseId, title, description, dueDate, maxPoints]
        );
        
        const assignmentId = result.insertId;
        
        // Create submission settings
        await connection.execute(
            'INSERT INTO submission_settings (assignment_id, allow_late_submission, allow_multiple_submissions) VALUES (?, ?, ?)',
            [assignmentId, true, false]
        );

        return { id: assignmentId, title, courseId, maxPoints };
    } finally {
        await connection.end();
    }
}

/**
 * Get assignment by ID
 * @param {number} assignmentId - Assignment ID
 * @returns {Object|null} Assignment or null
 */
async function getAssignmentById(assignmentId) {
    const connection = await mysql.createConnection({
        host: process.env.DATABASE_HOST || 'localhost',
        user: process.env.DATABASE_USER || 'root',
        password: process.env.DATABASE_PASSWORD || '',
        database: process.env.DATABASE_NAME || 'school_db'
    });

    try {
        const [rows] = await connection.execute(
            'SELECT a.*, as2.allow_late_submission, as2.allow_multiple_submissions FROM assignments a LEFT JOIN submission_settings as2 ON a.id = as2.assignment_id WHERE a.id = ?',
            [assignmentId]
        );

        return rows[0] || null;
    } finally {
        await connection.end();
    }
}

/**
 * Get assignment by course ID
 * @param {number} courseId - Course ID
 * @returns {Array} List of assignments
 */
async function getAssignmentsByCourse(courseId) {
    const connection = await mysql.createConnection({
        host: process.env.DATABASE_HOST || 'localhost',
        user: process.env.DATABASE_USER || 'root',
        password: process.env.DATABASE_PASSWORD || '',
        database: process.env.DATABASE_NAME || 'school_db'
    });

    try {
        const [rows] = await connection.execute(
            'SELECT a.*, as2.allow_late_submission, as2.allow_multiple_submissions FROM assignments a LEFT JOIN submission_settings as2 ON a.id = as2.assignment_id WHERE a.course_id = ? ORDER BY a.due_date ASC',
            [courseId]
        );

        return rows;
    } finally {
        await connection.end();
    }
}

/**
 * Update assignment information
 * @param {number} assignmentId - Assignment ID
 * @param {Object} updates - Fields to update
 * @returns {Object} Updated assignment
 */
async function updateAssignment(assignmentId, updates) {
    const allowedFields = ['title', 'description', 'due_date', 'max_points'];
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

    values.push(assignmentId);
    values.push('updated_at');

    const connection = await mysql.createConnection({
        host: process.env.DATABASE_HOST || 'localhost',
        user: process.env.DATABASE_USER || 'root',
        password: process.env.DATABASE_PASSWORD || '',
        database: process.env.DATABASE_NAME || 'school_db'
    });

    try {
        const [result] = await connection.execute(
            `UPDATE assignments SET ${updateFields.join(', ')} WHERE id = ?`,
            values
        );

        return getAssignmentById(assignmentId);
    } finally {
        await connection.end();
    }
}

/**
 * Delete assignment
 * @param {number} assignmentId - Assignment ID
 * @returns {boolean} Success
 */
async function deleteAssignment(assignmentId) {
    const connection = await mysql.createConnection({
        host: process.env.DATABASE_HOST || 'localhost',
        user: process.env.DATABASE_USER || 'root',
        password: process.env.DATABASE_PASSWORD || '',
        database: process.env.DATABASE_NAME || 'school_db'
    });

    try {
        await connection.execute('DELETE FROM assignments WHERE id = ?', [assignmentId]);
        return true;
    } finally {
        await connection.end();
    }
}

/**
 * Get all assignments
 * @returns {Array} List of assignments
 */
async function getAllAssignments() {
    const connection = await mysql.createConnection({
        host: process.env.DATABASE_HOST || 'localhost',
        user: process.env.DATABASE_USER || 'root',
        password: process.env.DATABASE_PASSWORD || '',
        database: process.env.DATABASE_NAME || 'school_db'
    });

    try {
        const [rows] = await connection.execute(
            'SELECT a.*, as2.allow_late_submission, as2.allow_multiple_submissions FROM assignments a LEFT JOIN submission_settings as2 ON a.id = as2.assignment_id ORDER BY a.created_at DESC'
        );

        return rows;
    } finally {
        await connection.end();
    }
}

module.exports = {
    createAssignment,
    getAssignmentById,
    getAssignmentsByCourse,
    updateAssignment,
    deleteAssignment,
    getAllAssignments
};
