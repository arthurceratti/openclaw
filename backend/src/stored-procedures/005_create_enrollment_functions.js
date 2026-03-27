/**
 * Stored Procedures for Enrollment Management Functions
 * User: Laura
 */

const mysql = require('mysql2/promise');

/**
 * Enroll a student in a course
 * @param {number} studentId - Student ID
 * @param {number} courseId - Course ID
 * @param {string} status - Enrollment status (enrolled, waiting, dropped)
 * @returns {Object} Enrollment record
 */
async function enrollStudent(studentId, courseId, status = 'enrolled') {
    const connection = await mysql.createConnection({
        host: process.env.DATABASE_HOST || 'localhost',
        user: process.env.DATABASE_USER || 'root',
        password: process.env.DATABASE_PASSWORD || '',
        database: process.env.DATABASE_NAME || 'school_db'
    });

    try {
        // Check if already enrolled
        const [existing] = await connection.execute(
            'SELECT * FROM enrollments WHERE student_id = ? AND course_id = ?',
            [studentId, courseId]
        );

        if (existing.length > 0) {
            throw new Error('Student already enrolled in this course');
        }

        const [result] = await connection.execute(
            'INSERT INTO enrollments (student_id, course_id, status, enrolled_at) VALUES (?, ?, ?, NOW())',
            [studentId, courseId, status]
        );

        const enrollmentId = result.insertId;
        
        // Track enrollment
        await connection.execute(
            'INSERT INTO enrollment_tracking (enrollment_id, is_active, last_activity) VALUES (?, ?, NOW())',
            [enrollmentId, true]
        );

        return { id: enrollmentId, studentId, courseId, status };
    } finally {
        await connection.end();
    }
}

/**
 * Get enrollment by ID
 * @param {number} enrollmentId - Enrollment ID
 * @returns {Object|null} Enrollment or null
 */
async function getEnrollmentById(enrollmentId) {
    const connection = await mysql.createConnection({
        host: process.env.DATABASE_HOST || 'localhost',
        user: process.env.DATABASE_USER || 'root',
        password: process.env.DATABASE_PASSWORD || '',
        database: process.env.DATABASE_NAME || 'school_db'
    });

    try {
        const [rows] = await connection.execute(
            'SELECT e.*, et.is_active, et.last_activity FROM enrollments e LEFT JOIN enrollment_tracking et ON e.id = et.enrollment_id WHERE e.id = ?',
            [enrollmentId]
        );

        return rows[0] || null;
    } finally {
        await connection.end();
    }
}

/**
 * Get student enrollments
 * @param {number} studentId - Student ID
 * @returns {Array} List of enrollments
 */
async function getStudentEnrollments(studentId) {
    const connection = await mysql.createConnection({
        host: process.env.DATABASE_HOST || 'localhost',
        user: process.env.DATABASE_USER || 'root',
        password: process.env.DATABASE_PASSWORD || '',
        database: process.env.DATABASE_NAME || 'school_db'
    });

    try {
        const [rows] = await connection.execute(
            'SELECT e.*, c.title as course_title, c.code as course_code FROM enrollments e LEFT JOIN courses c ON e.course_id = c.id WHERE e.student_id = ? ORDER BY e.enrolled_at DESC',
            [studentId]
        );

        return rows;
    } finally {
        await connection.end();
    }
}

/**
 * Get course enrollments
 * @param {number} courseId - Course ID
 * @returns {Array} List of enrollments
 */
async function getCourseEnrollments(courseId) {
    const connection = await mysql.createConnection({
        host: process.env.DATABASE_HOST || 'localhost',
        user: process.env.DATABASE_USER || 'root',
        password: process.env.DATABASE_PASSWORD || '',
        database: process.env.DATABASE_NAME || 'school_db'
    });

    try {
        const [rows] = await connection.execute(
            'SELECT e.*, s.name as student_name, s.email as student_email FROM enrollments e LEFT JOIN students s ON e.student_id = s.id WHERE e.course_id = ? ORDER BY e.enrolled_at DESC',
            [courseId]
        );

        return rows;
    } finally {
        await connection.end();
    }
}

/**
 * Update enrollment status
 * @param {number} enrollmentId - Enrollment ID
 * @param {string} status - New status
 * @returns {Object} Updated enrollment
 */
async function updateEnrollment(enrollmentId, status) {
    const connection = await mysql.createConnection({
        host: process.env.DATABASE_HOST || 'localhost',
        user: process.env.DATABASE_USER || 'root',
        password: process.env.DATABASE_PASSWORD || '',
        database: process.env.DATABASE_NAME || 'school_db'
    });

    try {
        const [result] = await connection.execute(
            'UPDATE enrollments SET status = ?, updated_at = NOW() WHERE id = ?',
            [status, enrollmentId]
        );

        return getEnrollmentById(enrollmentId);
    } finally {
        await connection.end();
    }
}

/**
 * Drop student from course
 * @param {number} enrollmentId - Enrollment ID
 * @returns {boolean} Success
 */
async function dropStudent(enrollmentId) {
    const connection = await mysql.createConnection({
        host: process.env.DATABASE_HOST || 'localhost',
        user: process.env.DATABASE_USER || 'root',
        password: process.env.DATABASE_PASSWORD || '',
        database: process.env.DATABASE_NAME || 'school_db'
    });

    try {
        await connection.execute(
            'UPDATE enrollments SET status = "dropped", updated_at = NOW() WHERE id = ?',
            [enrollmentId]
        );

        // Update tracking
        await connection.execute(
            'UPDATE enrollment_tracking SET is_active = FALSE, last_activity = NOW() WHERE enrollment_id = ?',
            [enrollmentId]
        );

        return true;
    } finally {
        await connection.end();
    }
}

/**
 * Get all enrollments
 * @returns {Array} List of enrollments
 */
async function getAllEnrollments() {
    const connection = await mysql.createConnection({
        host: process.env.DATABASE_HOST || 'localhost',
        user: process.env.DATABASE_USER || 'root',
        password: process.env.DATABASE_PASSWORD || '',
        database: process.env.DATABASE_NAME || 'school_db'
    });

    try {
        const [rows] = await connection.execute(
            'SELECT e.*, et.is_active, et.last_activity, c.title as course_title, s.name as student_name FROM enrollments e LEFT JOIN enrollment_tracking et ON e.id = et.enrollment_id LEFT JOIN courses c ON e.course_id = c.id LEFT JOIN students s ON e.student_id = s.id ORDER BY e.enrolled_at DESC'
        );

        return rows;
    } finally {
        await connection.end();
    }
}

module.exports = {
    enrollStudent,
    getEnrollmentById,
    getStudentEnrollments,
    getCourseEnrollments,
    updateEnrollment,
    dropStudent,
    getAllEnrollments
};
