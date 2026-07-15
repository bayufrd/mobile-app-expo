const { query } = require('../db/mysql');
const { createHttpError } = require('../utils/httpError');

function normalizeStudentPayload(payload = {}) {
  return {
    nim: String(payload.nim || '').trim(),
    name: String(payload.name || '').trim(),
    studyProgram: String(payload.studyProgram || '').trim(),
    semester: Number(payload.semester),
    gpa: Number(payload.gpa),
  };
}

function validateStudentPayload(payload, isUpdate = false) {
  const data = normalizeStudentPayload(payload);
  const errors = {};

  if (!data.nim) errors.nim = 'NIM wajib diisi';
  if (!data.name) errors.name = 'Nama mahasiswa wajib diisi';
  if (!data.studyProgram) errors.studyProgram = 'Program studi wajib diisi';
  if (!Number.isInteger(data.semester) || data.semester < 1 || data.semester > 14) {
    errors.semester = 'Semester harus berupa bilangan bulat antara 1 sampai 14';
  }
  if (Number.isNaN(data.gpa) || data.gpa < 0 || data.gpa > 4) {
    errors.gpa = 'IPK harus berada pada rentang 0.00 sampai 4.00';
  }

  if (Object.keys(errors).length > 0) {
    throw createHttpError(400, isUpdate ? 'Validasi ubah data gagal' : 'Validasi tambah data gagal', errors);
  }

  return {
    ...data,
    gpa: Number(data.gpa.toFixed(2)),
  };
}

async function ensureUniqueNim(nim, excludeId = null) {
  const sql = excludeId
    ? 'SELECT id FROM students WHERE nim = ? AND id != ? LIMIT 1'
    : 'SELECT id FROM students WHERE nim = ? LIMIT 1';
  const params = excludeId ? [nim, excludeId] : [nim];
  const rows = await query(sql, params);

  if (rows.length > 0) {
    throw createHttpError(409, 'NIM sudah digunakan mahasiswa lain');
  }
}

async function listStudents(search = '') {
  const keyword = String(search || '').trim();
  const hasKeyword = keyword.length > 0;
  const rows = await query(
    `SELECT s.id, s.nim, s.name, s.study_program AS studyProgram, s.semester, s.gpa,
            CASE WHEN COUNT(a.id) > 0 THEN TRUE ELSE FALSE END AS hasAcademicScores,
            s.created_at AS createdAt,
            s.updated_at AS updatedAt
     FROM students s
     LEFT JOIN academic_scores a ON a.student_id = s.id
     ${hasKeyword ? 'WHERE s.nim LIKE ? OR s.name LIKE ?' : ''}
     GROUP BY s.id
     ORDER BY s.name ASC, s.nim ASC`,
    hasKeyword ? [`%${keyword}%`, `%${keyword}%`] : []
  );

  return rows;
}

async function createStudent(payload) {
  const data = validateStudentPayload(payload);
  await ensureUniqueNim(data.nim);

  const result = await query(
    `INSERT INTO students (nim, name, study_program, semester, gpa)
     VALUES (?, ?, ?, ?, ?)`,
    [data.nim, data.name, data.studyProgram, data.semester, data.gpa]
  );

  return getStudentById(result.insertId);
}

async function getStudentById(id) {
  const rows = await query(
    `SELECT s.id, s.nim, s.name, s.study_program AS studyProgram, s.semester, s.gpa,
            CASE WHEN COUNT(a.id) > 0 THEN TRUE ELSE FALSE END AS hasAcademicScores,
            s.created_at AS createdAt,
            s.updated_at AS updatedAt
     FROM students s
     LEFT JOIN academic_scores a ON a.student_id = s.id
     WHERE s.id = ?
     GROUP BY s.id
     LIMIT 1`,
    [id]
  );

  if (rows.length === 0) {
    throw createHttpError(404, 'Data mahasiswa tidak ditemukan');
  }

  return rows[0];
}

async function updateStudent(id, payload) {
  const data = validateStudentPayload(payload, true);
  await getStudentById(id);
  await ensureUniqueNim(data.nim, id);

  await query(
    `UPDATE students
     SET nim = ?, name = ?, study_program = ?, semester = ?, gpa = ?
     WHERE id = ?`,
    [data.nim, data.name, data.studyProgram, data.semester, data.gpa, id]
  );

  return getStudentById(id);
}

async function deleteStudent(id) {
  await getStudentById(id);

  const scores = await query(
    'SELECT id FROM academic_scores WHERE student_id = ? LIMIT 1',
    [id]
  );

  if (scores.length > 0) {
    throw createHttpError(400, 'Mahasiswa yang sudah memiliki nilai akademik tidak boleh dihapus');
  }

  await query('DELETE FROM students WHERE id = ?', [id]);
}

module.exports = {
  listStudents,
  createStudent,
  getStudentById,
  updateStudent,
  deleteStudent,
};