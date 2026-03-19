# Database Setup & SQL Examples

This document contains all the SQL table creation statements for the backend.

## Database Configuration

Configure your MySQL connection in `.env`:

```env
DB_HOST=localhost
DB_USERNAME=root
DB_PASSWORD=your_password
DB_NAME=fusion_db
DB_PORT=3306
```

## Tables

### 1. Users Table

```sql
CREATE TABLE `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(100) NOT NULL UNIQUE,
  `phone` VARCHAR(20),
  `address` TEXT,
  `city` VARCHAR(50),
  `country` VARCHAR(50),
  `status` ENUM('active', 'inactive', 'blocked') DEFAULT 'active',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_email` (`email`),
  INDEX `idx_status` (`status`),
  INDEX `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### 2. Products Table (Example for e-commerce)

```sql
CREATE TABLE `products` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(200) NOT NULL,
  `description` TEXT,
  `price` DECIMAL(10, 2) NOT NULL,
  `quantity` INT DEFAULT 0,
  `category` VARCHAR(100),
  `sku` VARCHAR(50) UNIQUE,
  `image_url` VARCHAR(255),
  `is_active` BOOLEAN DEFAULT TRUE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_category` (`category`),
  INDEX `idx_is_active` (`is_active`),
  INDEX `idx_sku` (`sku`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### 3. Orders Table (Example)

```sql
CREATE TABLE `orders` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `order_number` VARCHAR(50) NOT NULL UNIQUE,
  `user_id` INT NOT NULL,
  `total_amount` DECIMAL(10, 2) NOT NULL,
  `status` ENUM('pending', 'confirmed', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
  `payment_method` VARCHAR(50),
  `shipping_address` TEXT,
  `notes` TEXT,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  INDEX `idx_user_id` (`user_id`),
  INDEX `idx_status` (`status`),
  INDEX `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### 4. Admin Users Table

```sql
CREATE TABLE `admin_users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(100) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255) NOT NULL,
  `role` ENUM('admin', 'moderator', 'editor') DEFAULT 'editor',
  `permissions` JSON,
  `is_active` BOOLEAN DEFAULT TRUE,
  `last_login` TIMESTAMP NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_email` (`email`),
  INDEX `idx_role` (`role`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### 5. Settings Table

```sql
CREATE TABLE `settings` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `key` VARCHAR(100) NOT NULL UNIQUE,
  `value` LONGTEXT,
  `type` VARCHAR(50),
  `description` TEXT,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_key` (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

## Quick Setup Script

Run this to create all tables at once:

```sql
-- Create Users Table
CREATE TABLE IF NOT EXISTS `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(100) NOT NULL UNIQUE,
  `phone` VARCHAR(20),
  `address` TEXT,
  `city` VARCHAR(50),
  `country` VARCHAR(50),
  `status` ENUM('active', 'inactive', 'blocked') DEFAULT 'active',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_email` (`email`),
  INDEX `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Insert Sample Data
INSERT INTO `users` (`name`, `email`, `phone`, `status`) VALUES
('John Doe', 'john@example.com', '+1-555-0100', 'active'),
('Jane Smith', 'jane@example.com', '+1-555-0101', 'active'),
('Bob Wilson', 'bob@example.com', '+1-555-0102', 'inactive');
```

## Data Types Reference

| Type | Description | Example |
|------|-------------|---------|
| `INT` | Integer numbers | `123`, `0`, `-45` |
| `VARCHAR(n)` | Text up to n characters | `'John'`, `'john@email.com'` |
| `TEXT` | Long text | Descriptions, addresses |
| `DECIMAL(10,2)` | Decimal numbers with 2 decimals | `99.99`, `1000.00` |
| `ENUM('a','b')` | Predefined values | `'active'`, `'inactive'` |
| `JSON` | JSON data | `{"role": "admin"}` |
| `BOOLEAN` | True/False | `TRUE`, `FALSE` |
| `TIMESTAMP` | Date & time | `2024-01-15 10:30:45` |
| `LONGTEXT` | Very long text | Large content |

## Indexing Strategy

Good indexes to add:

```sql
-- Common indexes for better performance
CREATE INDEX idx_email ON users(email);
CREATE INDEX idx_status ON users(status);
CREATE INDEX idx_created_at ON users(created_at);
CREATE INDEX idx_user_id ON orders(user_id);
```

## Common Queries

### Get user count by status
```sql
SELECT status, COUNT(*) as count FROM users GROUP BY status;
```

### Get recent users
```sql
SELECT * FROM users ORDER BY created_at DESC LIMIT 10;
```

### Search users
```sql
SELECT * FROM users WHERE name LIKE '%john%' OR email LIKE '%john%';
```

### Get user with order count
```sql
SELECT u.*, COUNT(o.id) as order_count 
FROM users u 
LEFT JOIN orders o ON u.id = o.user_id 
GROUP BY u.id;
```

## Connection Details

- **Host**: `localhost` (default)
- **Port**: `3306` (default)
- **Database**: `fusion_db`
- **Charset**: `utf8mb4` (supports emojis and special characters)

## Notes

- All tables use `utf8mb4` charset for international character support
- Timestamps are automatically managed
- Foreign keys are used for data integrity
- Indexes are added on frequently searched columns
