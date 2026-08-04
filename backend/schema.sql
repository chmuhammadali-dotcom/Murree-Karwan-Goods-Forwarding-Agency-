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

-- Create Table for App Shippers (B2C & B2B Credit/Cash)
CREATE TABLE IF NOT EXISTS `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `phone_number` VARCHAR(50) UNIQUE NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `account_type` ENUM('individual', 'corporate') NOT NULL DEFAULT 'individual',
  `ntn_number` VARCHAR(50) NULL,
  `ntn_verified` BOOLEAN DEFAULT FALSE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_phone` (`phone_number`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create Table for App Drivers (Vetted Logistics Partners)
CREATE TABLE IF NOT EXISTS `drivers` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `phone_number` VARCHAR(50) UNIQUE NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `cnic` VARCHAR(50) UNIQUE NOT NULL,
  `license_number` VARCHAR(50) UNIQUE NOT NULL,
  `is_verified` BOOLEAN DEFAULT FALSE,
  `selfie_url` VARCHAR(500) NULL,
  `cnic_front_url` VARCHAR(500) NULL,
  `cnic_back_url` VARCHAR(500) NULL,
  `license_url` VARCHAR(500) NULL,
  `smart_card_url` VARCHAR(500) NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_driver_phone` (`phone_number`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create Table for App Bookings
CREATE TABLE IF NOT EXISTS `bookings` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `shipper_id` INT NOT NULL,
  `driver_id` INT NULL,
  `vehicle_type` VARCHAR(100) NOT NULL,
  `pickup_location` VARCHAR(255) NOT NULL,
  `pickup_lat` DECIMAL(10, 8) NULL,
  `pickup_lon` DECIMAL(11, 8) NULL,
  `destination` VARCHAR(255) NOT NULL,
  `destination_lat` DECIMAL(10, 8) NULL,
  `destination_lon` DECIMAL(11, 8) NULL,
  `payment_method` ENUM('cash_dispatch', 'split_50_50', 'cod', 'credit_invoice') NOT NULL DEFAULT 'cash_dispatch',
  `status` ENUM('pending', 'assigned', 'dispatched', 'delivered', 'cancelled') NOT NULL DEFAULT 'pending',
  `fare` DECIMAL(12, 2) NOT NULL,
  `landmark_guide` VARCHAR(500) NULL,
  `voice_guide_url` VARCHAR(500) NULL,
  `is_consolidated` BOOLEAN DEFAULT FALSE,
  `consolidation_group_id` INT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`shipper_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`driver_id`) REFERENCES `drivers`(`id`) ON DELETE SET NULL,
  INDEX `idx_shipper` (`shipper_id`),
  INDEX `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create Table for Live GPS Tracking (Time Series Logs)
CREATE TABLE IF NOT EXISTS `gps_logs` (
  `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
  `booking_id` INT NOT NULL,
  `lat` DECIMAL(10, 8) NOT NULL,
  `lon` DECIMAL(11, 8) NOT NULL,
  `timestamp` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`booking_id`) REFERENCES `bookings`(`id`) ON DELETE CASCADE,
  INDEX `idx_booking_timestamp` (`booking_id`, `timestamp`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
