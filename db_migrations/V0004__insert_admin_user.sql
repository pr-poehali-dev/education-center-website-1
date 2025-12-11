-- Обновляем пароль для администратора shafi
UPDATE admins 
SET password_hash = '12344321' 
WHERE username = 'shafi';

-- Если пользователь не существует, создаём его
INSERT INTO admins (username, password_hash) 
SELECT 'shafi', '12344321'
WHERE NOT EXISTS (SELECT 1 FROM admins WHERE username = 'shafi');
