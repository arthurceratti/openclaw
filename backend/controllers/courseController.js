const Course = require('../models/Course');

// @desc    Listar todos os cursos
// @route   GET /api/courses
// @access  Public
exports.getCourses = async (req, res) => {
  try {
    const courses = await Course.find().sort({ createdAt: -1 });
    res.json(courses);
  } catch (error) {
    console.error('Erro ao listar cursos:', error);
    res.status(500).json({ message: 'Erro ao listar cursos' });
  }
};

// @desc    Obter curso por ID
// @route   GET /api/courses/:id
// @access  Public
exports.getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    
    if (!course) {
      return res.status(404).json({ message: 'Curso não encontrado' });
    }

    res.json(course);
  } catch (error) {
    console.error('Erro ao obter curso:', error);
    res.status(500).json({ message: 'Erro ao obter curso' });
  }
};

// @desc    Criar novo curso
// @route   POST /api/courses
// @access  Private/Admin
exports.createCourse = async (req, res) => {
  try {
    const { nome, descricao, instructorId, nivel, categoria } = req.body;

    const course = await Course.create({
      nome,
      descricao,
      instructorId,
      nivel,
      categoria,
      autorId: req.user.id
    });

    res.status(201).json(course);
  } catch (error) {
    console.error('Erro ao criar curso:', error);
    res.status(500).json({ message: 'Erro ao criar curso' });
  }
};

// @desc    Atualizar curso
// @route   PUT /api/courses/:id
// @access  Private/Admin
exports.updateCourse = async (req, res) => {
  try {
    const { nome, descricao, nivel, categoria } = req.body;

    const course = await Course.findByIdAndUpdate(
      req.params.id,
      {
        ...(nome && { nome }),
        ...(descricao && { descricao }),
        ...(nivel && { nivel }),
        ...(categoria && { categoria })
      },
      { new: true, runValidators: true }
    );

    if (!course) {
      return res.status(404).json({ message: 'Curso não encontrado' });
    }

    res.json(course);
  } catch (error) {
    console.error('Erro ao atualizar curso:', error);
    res.status(500).json({ message: 'Erro ao atualizar curso' });
  }
};

// @desc    Deletar curso
// @route   DELETE /api/courses/:id
// @access  Private/Admin
exports.deleteCourse = async (req, res) => {
  try {
    await Course.findByIdAndDelete(req.params.id);
    res.json({ message: 'Curso deletado com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar curso:', error);
    res.status(500).json({ message: 'Erro ao deletar curso' });
  }
};

// @desc    Inscrever-se em curso
// @route   POST /api/courses/:id/enroll
// @access  Private
exports.enrollInCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    
    if (!course) {
      return res.status(404).json({ message: 'Curso não encontrado' });
    }

    // Verificar se já está inscrito
    const alreadyEnrolled = await Course.findOne({
      _id: req.params.id,
      inscritos: req.user.id
    });

    if (alreadyEnrolled) {
      return res.status(400).json({ message: 'Já está inscrito neste curso' });
    }

    // Adicionar inscrito
    await Course.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { inscritos: req.user.id } }
    );

    res.json({ message: 'Inscrição realizada com sucesso' });
  } catch (error) {
    console.error('Erro ao inscrever-se:', error);
    res.status(500).json({ message: 'Erro ao inscrever-se' });
  }
};

// @desc    Remover inscrição
// @route   DELETE /api/courses/:id/enroll
// @access  Private
exports.removeEnrollment = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    
    if (!course) {
      return res.status(404).json({ message: 'Curso não encontrado' });
    }

    // Verificar se é o dono do curso ou inscrito
    if (course.autorId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Acesso negado' });
    }

    await Course.findByIdAndUpdate(
      req.params.id,
      { $pull: { inscritos: req.user.id } }
    );

    res.json({ message: 'Inscrição removida com sucesso' });
  } catch (error) {
    console.error('Erro ao remover inscrição:', error);
    res.status(500).json({ message: 'Erro ao remover inscrição' });
  }
};

// @desc    Obter cursos inscritos
// @route   GET /api/courses/my-courses
// @access  Private
exports.getMyCourses = async (req, res) => {
  try {
    const courses = await Course.find({ inscritos: req.user.id }).sort({ createdAt: -1 });
    res.json(courses);
  } catch (error) {
    console.error('Erro ao obter cursos inscritos:', error);
    res.status(500).json({ message: 'Erro ao obter cursos inscritos' });
  }
};
