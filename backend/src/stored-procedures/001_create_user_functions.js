/**
 * Stored Procedures for User Management Functions
 * User: Laura
 */

const mysql = require('mysql2/promise');

/**
 * Create a new user
 * @param {string} email - User email
 * @param {string} password - User password
 * @param {string} name - User name
 * @param {string} role - User role (admin, teacher, student)
 * @returns {Object} Created user
 */
async function createUser(email, password, name, role = 'student') {
    const connection = await mysql.createConnection({
        host: process.env.DATABASE_HOST || 'localhost',
        user: process.env.DATABASE_USER || 'root',
        password: process.env.DATABASE_PASSWORD || '',
        database: process.env.DATABASE_NAME || 'school_db'
    });

    try {
        const [result] = await connection.execute(
            'INSERT INTO users (email, password, name, role, created_at) VALUES (?, ?, ?, ?, NOW())',
            [email, password, name, role]
        );
        
        const userId = result.insertId;
        
        // Create user profile
        await connection.execute(
            'INSERT INTO user_profiles (user_id, bio, avatar_url) VALUES (?, NULL, NULL)',
            [userId]
        );

        return { id: userId, email, name, role };
    } finally {
        await connection.end();
    }
}

/**
 * Get user by ID
 * @param {number} userId - User ID
 * @returns {Object|null} User or null
 */
async function getUserById(userId) {
    const connection = await mysql.createConnection({
        host: process.env.DATABASE_HOST || 'localhost',
        user: process.env.DATABASE_USER || 'root',
        password: process.env.DATABASE_PASSWORD || '',
        database: process.env.DATABASE_NAME || 'school_db'
    });

    try {
        const [rows] = await connection.execute(
            'SELECT u.*, up.bio, up.avatar_url FROM users u LEFT JOIN user_profiles up ON u.id = up.user_id WHERE u.id = ?',
            [userId]
        );

        return rows[0] || null;
    } finally {
        await connection.end();
    }
}

/**
 * Get user by email
 * @param {string} email - User email
 * @returns {Object|null} User or null
 */
async function getUserByEmail(email) {
    const connection = await mysql.createConnection({
        host: process.env.DATABASE_HOST || 'localhost',
        user: process.env.DATABASE_USER || 'root',
        password: process.env.DATABASE_PASSWORD || '',
        database: process.env.DATABASE_NAME || 'school_db'
    });

    try {
        const [rows] = await connection.execute(
            'SELECT u.*, up.bio, up.avatar_url FROM users u LEFT JOIN user_profiles up ON u.id = up.user_id WHERE u.email = ?',
            [email]
        );

        return rows[0] || null;
    } finally {
        await connection.end();
    }
}

/**
 * Update user information
 * @param {number} userId - User ID
 * @param {Object} updates - Fields to update
 * @returns {Object} Updated user
 */
async function updateUser(userId, updates) {
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

    values.push(userId);
    values.push('updated_at');

    const connection = await mysql.createConnection({
        host: process.env.DATABASE_HOST || 'localhost',
        user: process.env.DATABASE_USER || 'root',
        password: process.env.DATABASE_PASSWORD || '',
        database: process.env.DATABASE_NAME || 'school_db'
    });

    try {
        const [result] = await connection.execute(
            `UPDATE users SET ${updateFields.join(', ')} WHERE id = ?`,
            values
        );

        return getUserById(userId);
    } finally {
        await connection.end();
    }
}

/**
 * Delete user
 * @param {number} userId - User ID
 * @returns {boolean} Success
 */
async function deleteUser(userId) {
    const connection = await mysql.createConnection({
        host: process.env.DATABASE_HOST || 'localhost',
        user: process.env.DATABASE_USER || 'root',
        password: process.env.DATABASE_PASSWORD || '',
        database: process.env.DATABASE_NAME || 'school_db'
    });

    try {
        await connection.execute('DELETE FROM users WHERE id = ?', [userId]);
        return true;
    } finally {
        await connection.end();
    }
}

module.exports = {
    createUser,
    getUserById,
    getUserByEmail,
    updateUser,
    deleteUser
};
