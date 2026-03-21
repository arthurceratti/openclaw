const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const authMiddleware = require('../middleware/authMiddleware');

// Rotas de cursos (protegidas)
router.get('/', authMiddleware.verifyToken, courseController.getAllCourses);
router.get('/:id', authMiddleware.verifyToken, courseController.getCourseById);
router.post('/', authMiddleware.verifyToken, courseController.createCourse);
router.put('/:id', authMiddleware.verifyToken, courseController.updateCourse);
router.delete('/:id', authMiddleware.verifyToken, courseController.deleteCourse);

// Rotas de turmas
router('/:courseId/classes', authMiddleware.verifyToken, courseController.getClasses);
router('/:courseId/classes/:classId', authMiddleware.verifyToken, courseController.getClassById);

module.exports = router;
