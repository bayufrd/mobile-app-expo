const express = require('express');
const studentController = require('../controllers/studentController');

const router = express.Router();

router.get('/', studentController.listStudents);
router.get('/:id', studentController.getStudent);
router.get('/:id/scores', studentController.listAcademicScores);
router.post('/', studentController.createStudent);
router.post('/:id/scores', studentController.createAcademicScore);
router.put('/:id', studentController.updateStudent);
router.delete('/:id', studentController.deleteStudent);

module.exports = router;