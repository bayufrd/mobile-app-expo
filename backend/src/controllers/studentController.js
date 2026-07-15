const studentService = require('../services/studentService');

async function listStudents(req, res, next) {
  try {
    const students = await studentService.listStudents(req.query.search);
    res.json({ data: students });
  } catch (error) {
    next(error);
  }
}

async function getStudent(req, res, next) {
  try {
    const student = await studentService.getStudentById(Number(req.params.id));
    res.json({ data: student });
  } catch (error) {
    next(error);
  }
}

async function createStudent(req, res, next) {
  try {
    const student = await studentService.createStudent(req.body);
    res.status(201).json({
      message: 'Data mahasiswa berhasil ditambahkan',
      data: student,
    });
  } catch (error) {
    next(error);
  }
}

async function updateStudent(req, res, next) {
  try {
    const student = await studentService.updateStudent(Number(req.params.id), req.body);
    res.json({
      message: 'Data mahasiswa berhasil diperbarui',
      data: student,
    });
  } catch (error) {
    next(error);
  }
}

async function listAcademicScores(req, res, next) {
  try {
    const scores = await studentService.listAcademicScores(Number(req.params.id));
    res.json({ data: scores });
  } catch (error) {
    next(error);
  }
}

async function createAcademicScore(req, res, next) {
  try {
    const score = await studentService.createAcademicScore(Number(req.params.id), req.body);
    res.status(201).json({
      message: 'Nilai akademik berhasil ditambahkan',
      data: score,
    });
  } catch (error) {
    next(error);
  }
}

async function deleteStudent(req, res, next) {
  try {
    await studentService.deleteStudent(Number(req.params.id));
    res.json({
      message: 'Data mahasiswa berhasil dihapus',
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  listStudents,
  getStudent,
  createStudent,
  updateStudent,
  listAcademicScores,
  createAcademicScore,
  deleteStudent,
};