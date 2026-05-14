-- Kalyan Robotic Hospital Database Setup
-- Generated for MySQL/MariaDB

-- 1. Create Tables
CREATE TABLE IF NOT EXISTS `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `role` VARCHAR(255) DEFAULT 'admin',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS `states` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL UNIQUE,
  `slug` VARCHAR(255) NOT NULL UNIQUE,
  `is_active` BOOLEAN DEFAULT TRUE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS `districts` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `state_id` INT,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`state_id`) REFERENCES `states`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS `locations` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `slug` VARCHAR(255) NOT NULL UNIQUE,
  `state_id` INT,
  `district_id` INT,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`state_id`) REFERENCES `states`(`id`) ON DELETE SET NULL,
  FOREIGN KEY (`district_id`) REFERENCES `districts`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS `services` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `slug` VARCHAR(255) NOT NULL UNIQUE,
  `description` TEXT,
  `content` LONGTEXT,
  `faqs` LONGTEXT,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS `service_locations` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `service_id` INT NOT NULL,
  `location_id` INT NOT NULL,
  `description` TEXT,
  `content` LONGTEXT,
  `faqs` LONGTEXT,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`service_id`) REFERENCES `services`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`location_id`) REFERENCES `locations`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS `appointments` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `phone` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255),
  `service` VARCHAR(255),
  `message` TEXT,
  `internal_notes` TEXT,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS `videos` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `youtube_id` VARCHAR(255) NOT NULL UNIQUE,
  `title` VARCHAR(255) NOT NULL,
  `description` TEXT,
  `thumbnail` VARCHAR(512),
  `category` VARCHAR(255) DEFAULT 'General',
  `published_at` DATETIME,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS `seo_metadata` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `page_path` VARCHAR(255) NOT NULL UNIQUE,
  `title` VARCHAR(255),
  `description` TEXT,
  `keywords` TEXT,
  `og_image` VARCHAR(255),
  `header_scripts` TEXT,
  `footer_scripts` TEXT,
  `canonical_url` VARCHAR(512),
  `og_title` VARCHAR(255),
  `og_description` TEXT,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS `testimonials` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `google_review_id` VARCHAR(255) UNIQUE,
  `name` VARCHAR(255) NOT NULL,
  `location` VARCHAR(255),
  `text` TEXT,
  `image` VARCHAR(512),
  `score` VARCHAR(50),
  `rating` DECIMAL(3, 1),
  `time` VARCHAR(100),
  `is_active` BOOLEAN DEFAULT TRUE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 2. Initial Data Seeds
INSERT INTO `users` (`email`, `password`, `role`) VALUES 
('admin@kalyan.com', 'admin123', 'admin');

INSERT INTO `states` (`name`, `slug`) VALUES 
('Punjab', 'punjab');

INSERT INTO `districts` (`name`, `state_id`) VALUES 
('Ludhiana', 1),
('Amritsar', 1);

INSERT INTO `services` (`name`, `slug`, `description`) VALUES 
('Robotic Knee Replacement', 'robotic-knee-replacement', 'Advanced AI-driven robotic knee surgery.');
