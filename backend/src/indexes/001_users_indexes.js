/**
 * Indexes for Users Model
 * @author arthurceratti
 * @date 2026-03-27
 */

const usersModel = require('../models/users');

// Index by email
usersModel.index('email', { unique: true, text: 'email' });

// Index by name
usersModel.index('name', { text: 'name' });

// Index by createdAt
usersModel.index('createdAt', { text: 'createdAt' });

module.exports = usersModel;
