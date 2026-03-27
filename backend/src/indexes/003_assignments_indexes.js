/**
 * Indexes for Assignments Model
 * @author arthurceratti
 * @date 2026-03-27
 */

const assignmentsModel = require('../models/assignments');

// Index by assignmentName
assignmentsModel.index('assignmentName', { text: 'assignmentName' });

// Index by course
assignmentsModel.index('course', { text: 'course' });

// Index by dueDate
assignmentsModel.index('dueDate', { text: 'dueDate' });

module.exports = assignmentsModel;
