DROP DATABASE IF EXISTS uas_mobile_students;
CREATE DATABASE IF NOT EXISTS uas_mobile_students;
USE uas_mobile_students;

CREATE TABLE IF NOT EXISTS students (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nim VARCHAR(30) NOT NULL,
  name VARCHAR(120) NOT NULL,
  study_program VARCHAR(120) NOT NULL,
  semester TINYINT NOT NULL,
  gpa DECIMAL(3,2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT uq_students_nim UNIQUE (nim),
  CONSTRAINT chk_students_semester CHECK (semester BETWEEN 1 AND 14),
  CONSTRAINT chk_students_gpa CHECK (gpa BETWEEN 0.00 AND 4.00)
);

CREATE TABLE IF NOT EXISTS academic_scores (
  id INT AUTO_INCREMENT PRIMARY KEY,
  student_id INT NOT NULL,
  course_name VARCHAR(120) NOT NULL,
  score DECIMAL(5,2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_academic_scores_student FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE RESTRICT,
  INDEX idx_academic_scores_student_id (student_id)
);

CREATE INDEX idx_students_name ON students(name);
CREATE INDEX idx_students_nim ON students(nim);

INSERT INTO students (nim, name, study_program, semester, gpa)
VALUES
  ('2201001', 'Andi Pratama', 'Informatika', 6, 3.52),
  ('2201002', 'Budi Santoso', 'Sistem Informasi', 4, 3.21),
  ('2201003', 'Citra Lestari', 'Informatika', 8, 3.78),
  ('2201004', 'Dewi Anggraini', 'Teknik Komputer', 2, 3.18),
  ('2201005', 'Eka Saputra', 'Sistem Informasi', 5, 3.44),
  ('2201006', 'Farhan Hidayat', 'Informatika', 7, 3.66),
  ('2201007', 'Gita Maharani', 'Teknologi Informasi', 3, 3.27),
  ('2201008', 'Hendra Kurniawan', 'Informatika', 9, 3.81),
  ('2201009', 'Indah Permata Sari', 'Sistem Informasi', 6, 3.35),
  ('2201010', 'Joko Susilo', 'Teknik Komputer', 4, 3.12),
  ('2201011', 'Kartika Ayu Lestari', 'Informatika', 10, 3.74),
  ('2201012', 'Lukman Hakim', 'Teknologi Informasi', 8, 3.49),
  ('2201013', 'Maya Oktaviani', 'Sistem Informasi', 2, 3.09),
  ('2201014', 'Nanda Prakoso', 'Informatika', 5, 3.58),
  ('2201015', 'Olivia Paramitha', 'Teknik Komputer', 1, 3.41),
  ('2201016', 'Putra Ramadhan', 'Informatika', 7, 3.63),
  ('2201017', 'Qori Azzahra', 'Sistem Informasi', 6, 3.56),
  ('2201018', 'Rafi Maulana', 'Teknologi Informasi', 3, 3.22),
  ('2201019', 'Salsa Nabila', 'Informatika', 4, 3.47),
  ('2201020', 'Teguh Firmansyah', 'Sistem Informasi', 9, 3.69),
  ('2201021', 'Ulfa Khairunnisa', 'Teknik Komputer', 5, 3.31),
  ('2201022', 'Vino Alfarizi', 'Informatika', 8, 3.72),
  ('2201023', 'Wulan Safitri', 'Teknologi Informasi', 2, 3.14),
  ('2201024', 'Yoga Prasetyo', 'Sistem Informasi', 6, 3.53),
  ('2201025', 'Zahra Nuraini', 'Informatika', 7, 3.88),
  ('2201026', 'Aditya Nugroho', 'Teknik Komputer', 3, 3.25),
  ('2201027', 'Bella Anindita', 'Sistem Informasi', 4, 3.39),
  ('2201028', 'Cahya Ramadhani', 'Informatika', 5, 3.61),
  ('2201029', 'Dimas Arya Putra', 'Teknologi Informasi', 1, 3.05),
  ('2201030', 'Elsa Rahmadini', 'Sistem Informasi', 8, 3.76)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  study_program = VALUES(study_program),
  semester = VALUES(semester),
  gpa = VALUES(gpa);

INSERT INTO academic_scores (student_id, course_name, score)
SELECT s.id, 'Pemrograman Mobile', 88.50
FROM students s
WHERE s.nim = '2201003'
  AND NOT EXISTS (
    SELECT 1 FROM academic_scores a
    WHERE a.student_id = s.id AND a.course_name = 'Pemrograman Mobile'
  );

INSERT INTO academic_scores (student_id, course_name, score)
SELECT s.id, 'Basis Data', 84.00
FROM students s
WHERE s.nim = '2201006'
  AND NOT EXISTS (
    SELECT 1 FROM academic_scores a
    WHERE a.student_id = s.id AND a.course_name = 'Basis Data'
  );

INSERT INTO academic_scores (student_id, course_name, score)
SELECT s.id, 'Algoritma Lanjut', 90.00
FROM students s
WHERE s.nim = '2201008'
  AND NOT EXISTS (
    SELECT 1 FROM academic_scores a
    WHERE a.student_id = s.id AND a.course_name = 'Algoritma Lanjut'
  );

INSERT INTO academic_scores (student_id, course_name, score)
SELECT s.id, 'Manajemen Proyek TI', 86.50
FROM students s
WHERE s.nim = '2201011'
  AND NOT EXISTS (
    SELECT 1 FROM academic_scores a
    WHERE a.student_id = s.id AND a.course_name = 'Manajemen Proyek TI'
  );

INSERT INTO academic_scores (student_id, course_name, score)
SELECT s.id, 'Jaringan Komputer', 82.75
FROM students s
WHERE s.nim = '2201016'
  AND NOT EXISTS (
    SELECT 1 FROM academic_scores a
    WHERE a.student_id = s.id AND a.course_name = 'Jaringan Komputer'
  );

INSERT INTO academic_scores (student_id, course_name, score)
SELECT s.id, 'Analisis Sistem', 87.25
FROM students s
WHERE s.nim = '2201020'
  AND NOT EXISTS (
    SELECT 1 FROM academic_scores a
    WHERE a.student_id = s.id AND a.course_name = 'Analisis Sistem'
  );

INSERT INTO academic_scores (student_id, course_name, score)
SELECT s.id, 'Machine Learning Dasar', 91.20
FROM students s
WHERE s.nim = '2201025'
  AND NOT EXISTS (
    SELECT 1 FROM academic_scores a
    WHERE a.student_id = s.id AND a.course_name = 'Machine Learning Dasar'
  );