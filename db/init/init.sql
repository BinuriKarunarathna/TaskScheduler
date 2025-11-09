-- Initialize schema for TaskScheduler
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS tasks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL,
  title VARCHAR(100) NOT NULL,
  description TEXT,
  priority ENUM('low','medium','high') DEFAULT 'low',
  due_date DATE,
  status ENUM('pending','in_progress','completed') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX (username)
);

INSERT INTO users (username, password) VALUES ('demo', 'demo123') ON DUPLICATE KEY UPDATE username=username;
INSERT INTO tasks (username, title, description, priority, status) VALUES
  ('demo', 'Welcome Task', 'Example task created on DB init.', 'medium', 'pending')
  ON DUPLICATE KEY UPDATE title=title;
