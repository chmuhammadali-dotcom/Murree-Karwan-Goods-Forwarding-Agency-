-- Create Database if not exists (Note: User needs privileges to execute CREATE DATABASE)
CREATE DATABASE IF NOT EXISTS `murree_karwan_db` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE `murree_karwan_db`;

-- Create Table for storing quote inquiries / contact submissions
CREATE TABLE IF NOT EXISTS `inquiries` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `phone_number` VARCHAR(50) NOT NULL,
  `service_needed` VARCHAR(100) NOT NULL,
  `pickup_location` VARCHAR(255) NOT NULL,
  `destination` VARCHAR(255) NOT NULL,
  `message` TEXT,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
