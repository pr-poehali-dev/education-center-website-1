-- Добавляем недостающие столбцы в teachers
ALTER TABLE t_p90313977_education_center_web.teachers 
ADD COLUMN IF NOT EXISTS name VARCHAR(255),
ADD COLUMN IF NOT EXISTS photo_url TEXT,
ADD COLUMN IF NOT EXISTS description TEXT,
ADD COLUMN IF NOT EXISTS specialization VARCHAR(255),
ADD COLUMN IF NOT EXISTS experience VARCHAR(255),
ADD COLUMN IF NOT EXISTS sort_order INTEGER DEFAULT 0;

-- Добавляем недостающие столбцы в schedule
ALTER TABLE t_p90313977_education_center_web.schedule 
ADD COLUMN IF NOT EXISTS time VARCHAR(100),
ADD COLUMN IF NOT EXISTS title VARCHAR(255),
ADD COLUMN IF NOT EXISTS description TEXT,
ADD COLUMN IF NOT EXISTS teacher_id INTEGER,
ADD COLUMN IF NOT EXISTS sort_order INTEGER DEFAULT 0;

-- Добавляем недостающие столбцы в contacts
ALTER TABLE t_p90313977_education_center_web.contacts 
ADD COLUMN IF NOT EXISTS type VARCHAR(50),
ADD COLUMN IF NOT EXISTS value TEXT,
ADD COLUMN IF NOT EXISTS icon VARCHAR(50),
ADD COLUMN IF NOT EXISTS label VARCHAR(255),
ADD COLUMN IF NOT EXISTS sort_order INTEGER DEFAULT 0;

-- Добавляем недостающие столбцы в reviews
ALTER TABLE t_p90313977_education_center_web.reviews 
ADD COLUMN IF NOT EXISTS author_name VARCHAR(255),
ADD COLUMN IF NOT EXISTS author_photo TEXT,
ADD COLUMN IF NOT EXISTS rating INTEGER,
ADD COLUMN IF NOT EXISTS review_text TEXT,
ADD COLUMN IF NOT EXISTS date DATE,
ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT TRUE,
ADD COLUMN IF NOT EXISTS sort_order INTEGER DEFAULT 0;

-- Создаем results если не существует
CREATE TABLE IF NOT EXISTS t_p90313977_education_center_web.results (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    image_url TEXT,
    metric_value VARCHAR(50),
    metric_label VARCHAR(100),
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Создаем calendar_events если не существует
CREATE TABLE IF NOT EXISTS t_p90313977_education_center_web.calendar_events (
    id SERIAL PRIMARY KEY,
    date DATE NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    event_type VARCHAR(50),
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);