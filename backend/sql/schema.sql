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
SELECT '2201001', 'Andi Pratama', 'Informatika', 6, 3.52
WHERE NOT EXISTS (SELECT 1 FROM students WHERE nim = '2201001');

INSERT INTO students (nim, name, study_program, semester, gpa)
SELECT '2201002', 'Budi Santoso', 'Sistem Informasi', 4, 3.21
WHERE NOT EXISTS (SELECT 1 FROM students WHERE nim = '2201002');

INSERT INTO students (nim, name, study_program, semester, gpa)
SELECT '2201003', 'Citra Lestari', 'Informatika', 8, 3.78
WHERE NOT EXISTS (SELECT 1 FROM students WHERE nim = '2201003');

INSERT INTO academic_scores (student_id, course_name, score)
SELECT s.id, 'Pemrograman Mobile', 88.50
FROM students s
WHERE s.nim = '2201003'
  AND NOT EXISTS (
    SELECT 1 FROM academic_scores a
    WHERE a.student_id = s.id AND a.course_name = 'Pemrograman Mobile'
  );