const Student = require('../models/Student');

// @desc    Listar todos os estudantes
// @route   GET /api/students
// @access  Private/Admin
exports.getStudents = async (req, res) => {
  try {
    const students = await Student.find().sort({ createdAt: -1 });
    res.json(students);
  } catch (error) {
    console.error('Erro ao listar estudantes:', error);
    res.status(500).json({ message: 'Erro ao listar estudantes' });
  }
};

// @desc    Obter estudante por ID
// @route   GET /api/students/:id
// @access  Private
exports.getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    
    if (!student) {
      return res.status(404).json({ message: 'Estudante não encontrado' });
    }

    res.json(student);
  } catch (error) {
    console.error('Erro ao obter estudante:', error);
    res.status(500).json({ message: 'Erro ao obter estudante' });
  }
};

// @desc    Criar novo estudante
// @route   POST /api/students
// @access  Private/Admin
exports.createStudent = async (req, res) => {
  try {
    const { nome, email, cursoId, nivel } = req.body;

    const student = await Student.create({
      nome,
      email,
      cursoId,
      nivel,
      autorId: req.user.id
    });

    res.status(201).json(student);
  } catch (error) {
    console.error('Erro ao criar estudante:', error);
    res.status(500).json({ message: 'Erro ao criar estudante' });
  }
};

// @desc    Atualizar estudante
// @route   PUT /api/students/:id
// @access  Private/Admin
exports.updateStudent = async (req, res) => {
  try {
    const { nome, email, nivel, foto } = req.body;

    const student = await Student.findByIdAndUpdate(
      req.params.id,
      {
        ...(nome && { nome }),
        ...(email && { email }),
        ...(nivel && { nivel }),
        ...(foto && { foto })
      },
      { new: true, runValidators: true }
    );

    if (!student) {
      return res.status(404).json({ message: 'Estudante não encontrado' });
    }

    res.json(student);
  } catch (error) {
    console.error('Erro ao atualizar estudante:', error);
    res.status(500).json({ message: 'Erro ao atualizar estudante' });
  }
};

// @desc    Deletar estudante
// @route   DELETE /api/students/:id
// @access  Private/Admin
exports.deleteStudent = async (req, res) => {
  try {
    await Student.findByIdAndDelete(req.params.id);
    res.json({ message: 'Estudante deletado com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar estudante:', error);
    res.status(500).json({ message: 'Erro ao deletar estudante' });
  }
};

// @desc    Obter estudantes de um curso específico
// @route   GET /api/students/course/:courseId
// @access  Private/Admin
exports.getStudentsByCourse = async (req, res) => {
  try {
    const students = await Student.find({ cursoId: req.params.courseId }).sort({ createdAt: -1 });
    res.json(students);
  } catch (error) {
    console.error('Erro ao obter estudantes do curso:', error);
    res.status(500).json({ message: 'Erro ao obter estudantes do curso' });
  }
};

// @desc    Atualizar progresso do estudante
// @route   PUT /api/students/:id/progress
// @access  Private
exports.updateProgress = async (req, res) => {
  try {
    const { progresso } = req.body;

    const student = await Student.findByIdAndUpdate(
      req.params.id,
      { progresso },
      { new: true }
    );

    if (!student) {
      return res.status(404).json({ message: 'Estudante não encontrado' });
    }

    res.json(student);
  } catch (error) {
    console.error('Erro ao atualizar progresso:', error);
    res.status(500).json({ message: 'Erro ao atualizar progresso' });
  }
};
