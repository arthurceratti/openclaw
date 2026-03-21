const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const authMiddleware = require('../middleware/authMiddleware');

// Rotas de estudantes (protegidas)
router.get('/', authMiddleware.verifyToken, studentController.getAllStudents);
router.get('/:id', authMiddleware.verifyToken, studentController.getStudentById);
router.post('/', authMiddleware.verifyToken, studentController.createStudent);
router.put('/:id', authMiddleware.verifyToken, studentController.updateStudent);
router.delete('/:id', authMiddleware.verifyToken, studentController.deleteStudent);

// Rotas de matrículas
router('/:studentId/enrollments', authMiddleware.verifyToken, studentController.getEnrollments);
router('/:studentId/enrollments/:courseId', authMiddleware.verifyToken, studentController.getEnrollment);
router.post('/enroll', authMiddleware.verifyToken, studentController.enrollStudent);

module.exports = router;
