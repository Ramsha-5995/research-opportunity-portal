-- Research Opportunity Portal - Database Schema
-- Run this in MySQL to create the database and table before starting the server.

CREATE DATABASE IF NOT EXISTS research_portal;
USE research_portal;

CREATE TABLE IF NOT EXISTS opportunities (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    research_area VARCHAR(150) NOT NULL,
    faculty_name VARCHAR(150) NOT NULL,
    department VARCHAR(150) NOT NULL,
    required_skills VARCHAR(255) NOT NULL,
    available_positions INT NOT NULL DEFAULT 1,
    application_deadline DATE NOT NULL,
    status ENUM('Open', 'Closed') NOT NULL DEFAULT 'Open',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Optional sample data (remove before final submission if you want a clean DB)
INSERT INTO opportunities
(title, description, research_area, faculty_name, department, required_skills, available_positions, application_deadline, status)
VALUES
('Machine Learning for Crop Yield Prediction',
 'Research assistant needed to work on ML models predicting crop yield using satellite data.',
 'Machine Learning', 'Dr. Ayesha Khan', 'Computer Science',
 'Python, TensorFlow, Data Analysis', 2, '2026-12-15', 'Open'),
('Network Security in IoT Devices',
 'Investigate vulnerabilities in low-power IoT communication protocols.',
 'Cybersecurity', 'Dr. Bilal Ahmed', 'Computer Science',
 'Networking, C, Wireshark', 1, '2026-11-30', 'Open');
