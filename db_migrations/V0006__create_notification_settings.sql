-- Таблица настроек уведомлений
CREATE TABLE IF NOT EXISTS notification_settings (
    id SERIAL PRIMARY KEY,
    notification_type VARCHAR(50) NOT NULL,
    is_enabled BOOLEAN DEFAULT false,
    value TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Вставляем дефолтные настройки
INSERT INTO notification_settings (notification_type, is_enabled, value) 
VALUES 
    ('email', false, ''),
    ('telegram', false, '')
ON CONFLICT DO NOTHING;

CREATE UNIQUE INDEX IF NOT EXISTS idx_notification_type ON notification_settings(notification_type);
