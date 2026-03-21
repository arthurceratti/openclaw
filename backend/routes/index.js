const express = require('express');
const router = express.Router();

// Importar todas as rotas
const authRoutes = require('./authRoutes');
const userRoutes = require('./userRoutes');
const courseRoutes = require('./courseRoutes');
const studentRoutes = require('./studentRoutes');
const assignmentRoutes = require('./assignmentRoutes');

// Usar todas as rotas
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/courses', courseRoutes);
router.use('/students', studentRoutes);
router.use('/assignments', assignmentRoutes);

module.exports = router;
