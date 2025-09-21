-- Создание таблицы для учеников
CREATE TABLE students (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255),
    grade INTEGER CHECK (grade >= 9 AND grade <= 11),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Создание таблицы для преподавателей
CREATE TABLE teachers (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    subject VARCHAR(100) NOT NULL,
    experience_years INTEGER NOT NULL,
    rating DECIMAL(2,1) DEFAULT 5.0,
    phone VARCHAR(20),
    email VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Создание таблицы для предметов
CREATE TABLE subjects (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    exam_type VARCHAR(10) CHECK (exam_type IN ('ОГЭ', 'ЕГЭ', 'ОГЭ/ЕГЭ')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Создание таблицы для записей на занятия
CREATE TABLE bookings (
    id SERIAL PRIMARY KEY,
    student_id INTEGER REFERENCES students(id),
    teacher_id INTEGER REFERENCES teachers(id),
    subject_id INTEGER REFERENCES subjects(id),
    lesson_date DATE NOT NULL,
    lesson_time TIME NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Создание индексов для оптимизации запросов
CREATE INDEX idx_students_phone ON students(phone);
CREATE INDEX idx_students_email ON students(email);
CREATE INDEX idx_bookings_student_id ON bookings(student_id);
CREATE INDEX idx_bookings_teacher_id ON bookings(teacher_id);
CREATE INDEX idx_bookings_lesson_date ON bookings(lesson_date);
CREATE INDEX idx_bookings_status ON bookings(status);