USE smart_rental_db;

-- Clear previous data
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE payments;
TRUNCATE TABLE bookings;
TRUNCATE TABLE tenants;
TRUNCATE TABLE properties;
TRUNCATE TABLE users;
SET FOREIGN_KEY_CHECKS = 1;

-- Seed Users
-- Password for admin: admin123 -> $2a$10$9p0w7pmsL8p08hL60yDve.6y1m9Y4UoR4qX2Qk90W69p7S.5hR4n2 (example BCrypt)
-- Password for user: user123 -> $2a$10$K9aP5w0H6Qo4uE9S7e8s8.0W2L2D8S8a7P6p5Q4O3N2M1L0K9J8I7
INSERT INTO users (id, username, password, email, full_name, role) VALUES
(1, 'admin', '$2a$10$9p0w7pmsL8p08hL60yDve.6y1m9Y4UoR4qX2Qk90W69p7S.5hR4n2', 'admin@smartrental.com', 'System Administrator', 'ADMIN'),
(2, 'johndoe', '$2a$10$K9aP5w0H6Qo4uE9S7e8s8.0W2L2D8S8a7P6p5Q4O3N2M1L0K9J8I7', 'john@smartrental.com', 'John Doe', 'USER');

-- Seed Properties
INSERT INTO properties (id, name, address, location, description, type, rent_amount, status, image_url) VALUES
(1, 'Sunset Luxury Apartment', '102 Ocean Drive', 'Miami', 'A beautiful 2-bedroom luxury apartment with ocean views and access to private pool.', 'Apartment', 2500.0, 'OCCUPIED', 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&auto=format&fit=crop'),
(2, 'Cozy Suburban House', '455 Maple Avenue', 'Chicago', 'Charming 3-bedroom, 2-bathroom house with a spacious backyard and garage.', 'House', 1800.0, 'OCCUPIED', 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&auto=format&fit=crop'),
(3, 'Modern Downtown Studio', '88 Broadway Street', 'New York', 'Compact studio apartment in the heart of Manhattan. Walkable to major subway lines.', 'Apartment', 3200.0, 'VACANT', 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&auto=format&fit=crop'),
(4, 'Quiet Room Near University', '12 University Road', 'Boston', 'Single private room in a shared student townhouse. Shared kitchen and bathroom.', 'Room', 750.0, 'VACANT', 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&auto=format&fit=crop');

-- Seed Tenants
INSERT INTO tenants (id, first_name, last_name, email, phone, id_proof, property_id, status) VALUES
(1, 'Emily', 'Smith', 'emily.smith@example.com', '+1-555-0199', 'DL-99887766', 1, 'ACTIVE'),
(2, 'Michael', 'Johnson', 'michael.j@example.com', '+1-555-0144', 'PASS-11223344', 2, 'ACTIVE'),
(3, 'Sarah', 'Williams', 'sarah.w@example.com', '+1-555-0177', 'DL-44332211', NULL, 'INACTIVE');

-- Seed Bookings
INSERT INTO bookings (id, property_id, tenant_id, start_date, end_date, monthly_rent, status) VALUES
(1, 1, 1, '2026-01-01', '2026-12-31', 2500.0, 'ACTIVE'),
(2, 2, 2, '2026-03-15', '2027-03-14', 1800.0, 'ACTIVE');

-- Seed Payments
INSERT INTO payments (id, booking_id, amount, payment_date, payment_method, status) VALUES
(1, 1, 2500.0, '2026-01-02', 'Bank Transfer', 'PAID'),
(2, 1, 2500.0, '2026-02-01', 'Bank Transfer', 'PAID'),
(3, 1, 2500.0, '2026-03-01', 'Bank Transfer', 'PAID'),
(4, 1, 2500.0, '2026-04-01', 'Bank Transfer', 'PAID'),
(5, 1, 2500.0, '2026-05-01', 'Bank Transfer', 'PAID'),
(6, 2, 1800.0, '2026-03-16', 'Credit Card', 'PAID'),
(7, 2, 1800.0, '2026-04-15', 'Credit Card', 'PAID'),
(8, 2, 1800.0, '2026-05-15', 'Credit Card', 'PAID');
