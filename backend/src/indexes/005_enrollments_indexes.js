/**
 * Indexes for Enrollments Model
 * @author arthurceratti
 * @date 2026-03-27
 */

const enrollmentsModel = require('../models/enrollments');

// Index by student
enrollmentsModel.index('student', { text: 'student' });

// Index by course
enrollmentsModel.index('course', { text: 'course' });

// Index by enrollmentDate
enrollmentsModel.index('enrollmentDate', { text: 'enrollmentDate' });

module.exports = enrollmentsModel;
