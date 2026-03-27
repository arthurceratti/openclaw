/**
 * Indexes for Courses Model
 * @author arthurceratti
 * @date 2026-03-27
 */

const coursesModel = require('../models/courses');

// Index by courseName
coursesModel.index('courseName', { text: 'courseName' });

// Index by category
coursesModel.index('category', { text: 'category' });

// Index by createdAt
coursesModel.index('createdAt', { text: 'createdAt' });

module.exports = coursesModel;
