const Assignment = require('../models/Assignment');

// @desc    Listar todas as atividades
// @route   GET /api/assignments
// @access  Private
exports.getAssignments = async (req, res) => {
  try {
    const assignments = await Assignment.find().sort({ createdAt: -1 });
    res.json(assignments);
  } catch (error) {
    console.error('Erro ao listar atividades:', error);
    res.status(500).json({ message: 'Erro ao listar atividades' });
  }
};

// @desc    Obter atividade por ID
// @route   GET /api/assignments/:id
// @access  Private
exports.getAssignmentById = async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id);
    
    if (!assignment) {
      return res.status(404).json({ message: 'Atividade não encontrada' });
    }

    res.json(assignment);
  } catch (error) {
    console.error('Erro ao obter atividade:', error);
    res.status(500).json({ message: 'Erro ao obter atividade' });
  }
};

// @desc    Criar nova atividade
// @route   POST /api/assignments
// @access  Private/Admin
exports.createAssignment = async (req, res) => {
  try {
    const { titulo, descricao, cursoId, estudanteId, prazo, tipo } = req.body;

    const assignment = await Assignment.create({
      titulo,
      descricao,
      cursoId,
      estudanteId,
      prazo,
      tipo,
      autorId: req.user.id
    });

    res.status(201).json(assignment);
  } catch (error) {
    console.error('Erro ao criar atividade:', error);
    res.status(500).json({ message: 'Erro ao criar atividade' });
  }
};

// @desc    Atualizar atividade
// @route   PUT /api/assignments/:id
// @access  Private/Admin
exports.updateAssignment = async (req, res) => {
  try {
    const { titulo, descricao, prazo, tipo } = req.body;

    const assignment = await Assignment.findByIdAndUpdate(
      req.params.id,
      {
        ...(titulo && { titulo }),
        ...(descricao && { descricao }),
        ...(prazo && { prazo }),
        ...(tipo && { tipo })
      },
      { new: true, runValidators: true }
    );

    if (!assignment) {
      return res.status(404).json({ message: 'Atividade não encontrada' });
    }

    res.json(assignment);
  } catch (error) {
    console.error('Erro ao atualizar atividade:', error);
    res.status(500).json({ message: 'Erro ao atualizar atividade' });
  }
};

// @desc    Deletar atividade
// @route   DELETE /api/assignments/:id
// @access  Private/Admin
exports.deleteAssignment = async (req, res) => {
  try {
    await Assignment.findByIdAndDelete(req.params.id);
    res.json({ message: 'Atividade deletada com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar atividade:', error);
    res.status(500).json({ message: 'Erro ao deletar atividade' });
  }
};

// @desc    Submeter atividade
// @route   POST /api/assignments/:id/submit
// @access  Private
exports.submitAssignment = async (req, res) => {
  try {
    const { conteudo, anexos } = req.body;

    const assignment = await Assignment.findByIdAndUpdate(
      req.params.id,
      {
        conteudo,
        dataEntrega: new Date(),
        status: 'entregue'
      },
      { new: true }
    );

    if (!assignment) {
      return res.status(404).json({ message: 'Atividade não encontrada' });
    }

    res.json({
      message: 'Atividade submetida com sucesso',
      assignment
    });
  } catch (error) {
    console.error('Erro ao submeter atividade:', error);
    res.status(500).json({ message: 'Erro ao submeter atividade' });
  }
};

// @desc    Obter atividades de um curso específico
// @route   GET /api/assignments/course/:courseId
// @access  Private
exports.getAssignmentsByCourse = async (req, res) => {
  try {
    const assignments = await Assignment.find({ cursoId: req.params.courseId }).sort({ createdAt: -1 });
    res.json(assignments);
  } catch (error) {
    console.error('Erro ao obter atividades do curso:', error);
    res.status(500).json({ message: 'Erro ao obter atividades do curso' });
  }
};

// @desc    Obter atividades pendentes do usuário
// @route   GET /api/assignments/pending
// @access  Private
exports.getPendingAssignments = async (req, res) => {
  try {
    const assignments = await Assignment.find({
      estudanteId: req.user.id,
      status: { $in: ['pendente', 'em andamento'] }
    }).sort({ prazo: 1 });
    res.json(assignments);
  } catch (error) {
    console.error('Erro ao obter atividades pendentes:', error);
    res.status(500).json({ message: 'Erro ao obter atividades pendentes' });
  }
};

// @desc    Obter atividades entregues do usuário
// @route   GET /api/assignments/submitted
// @access  Private
exports.getSubmittedAssignments = async (req, res) => {
  try {
    const assignments = await Assignment.find({
      estudanteId: req.user.id,
      status: 'entregue'
    }).sort({ dataEntrega: -1 });
    res.json(assignments);
  } catch (error) {
    console.error('Erro ao obter atividades entregues:', error);
    res.status(500).json({ message: 'Erro ao obter atividades entregues' });
  }
};
