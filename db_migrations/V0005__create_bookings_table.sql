-- Таблица заявок от учеников
CREATE TABLE IF NOT EXISTS student_bookings (
    id SERIAL PRIMARY KEY,
    student_name VARCHAR(255) NOT NULL,
    student_phone VARCHAR(50) NOT NULL,
    student_email VARCHAR(255),
    selected_teacher VARCHAR(255),
    selected_subject VARCHAR(255),
    selected_time VARCHAR(50),
    status VARCHAR(50) DEFAULT 'new',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_bookings_status ON student_bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_created ON student_bookings(created_at DESC);
