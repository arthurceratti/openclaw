const express = require('express');
const router = express.Router();
const assignmentController = require('../controllers/assignmentController');
const authMiddleware = require('../middleware/authMiddleware');

// Rotas de atividades (protegidas)
router.get('/', authMiddleware.verifyToken, assignmentController.getAllAssignments);
router.get('/:id', authMiddleware.verifyToken, assignmentController.getAssignmentById);
router.post('/', authMiddleware.verifyToken, assignmentController.createAssignment);
router.put('/:id', authMiddleware.verifyToken, assignmentController.updateAssignment);
router.delete('/:id', authMiddleware.verifyToken, assignmentController.deleteAssignment);

// Rotas de entregas
router('/:id/submissions', authMiddleware.verifyToken, assignmentController.getSubmissions);
router('/:id/submissions/:submissionId', authMiddleware.verifyToken, assignmentController.getSubmission);
router.post('/:id/submissions', authMiddleware.verifyToken, assignmentController.submitAssignment);

module.exports = router;
