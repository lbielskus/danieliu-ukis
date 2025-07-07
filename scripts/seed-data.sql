-- Seed data for BookEasy reservation system
-- This script populates the database with sample data for testing

-- Insert sample users
INSERT INTO users (id, email, password_hash, name, role, phone) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'sarah@example.com', '$2b$10$hash1', 'Sarah Johnson', 'provider', '+1234567890'),
('550e8400-e29b-41d4-a716-446655440002', 'mike@example.com', '$2b$10$hash2', 'Mike Wilson', 'provider', '+1234567891'),
('550e8400-e29b-41d4-a716-446655440003', 'john@example.com', '$2b$10$hash3', 'John Doe', 'client', '+1234567892'),
('550e8400-e29b-41d4-a716-446655440004', 'jane@example.com', '$2b$10$hash4', 'Jane Smith', 'client', '+1234567893');

-- Insert service providers
INSERT INTO service_providers (id, user_id, business_name, description, location, rating, review_count) VALUES
('660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'Sarah''s Hair Studio', 'Professional hair styling and coloring services with over 10 years of experience', 'Downtown Beauty District', 4.9, 127),
('660e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440002', 'Mike''s Music Lessons', 'Guitar and piano lessons for all ages and skill levels', 'Music Quarter', 4.8, 89);

-- Insert services
INSERT INTO services (id, provider_id, name, description, duration, price, category) VALUES
('770e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440001', 'Haircut & Styling', 'Professional haircut with styling', 60, 45.00, 'Hair'),
('770e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440001', 'Color Treatment', 'Full hair coloring service', 120, 85.00, 'Hair'),
('770e8400-e29b-41d4-a716-446655440003', '660e8400-e29b-41d4-a716-446655440001', 'Highlights', 'Professional highlights', 180, 120.00, 'Hair'),
('770e8400-e29b-41d4-a716-446655440004', '660e8400-e29b-41d4-a716-446655440001', 'Beard Trim', 'Professional beard trimming', 30, 25.00, 'Hair'),
('770e8400-e29b-41d4-a716-446655440005', '660e8400-e29b-41d4-a716-446655440002', 'Guitar Lesson', 'One-on-one guitar instruction', 60, 50.00, 'Music'),
('770e8400-e29b-41d4-a716-446655440006', '660e8400-e29b-41d4-a716-446655440002', 'Piano Lesson', 'One-on-one piano instruction', 60, 55.00, 'Music');

-- Insert availability (Monday = 1, Sunday = 0)
INSERT INTO availability (provider_id, day_of_week, start_time, end_time) VALUES
-- Sarah's Hair Studio - Monday to Friday 9-5, Saturday 10-4
('660e8400-e29b-41d4-a716-446655440001', 1, '09:00', '17:00'), -- Monday
('660e8400-e29b-41d4-a716-446655440001', 2, '09:00', '17:00'), -- Tuesday
('660e8400-e29b-41d4-a716-446655440001', 3, '09:00', '17:00'), -- Wednesday
('660e8400-e29b-41d4-a716-446655440001', 4, '09:00', '17:00'), -- Thursday
('660e8400-e29b-41d4-a716-446655440001', 5, '09:00', '17:00'), -- Friday
('660e8400-e29b-41d4-a716-446655440001', 6, '10:00', '16:00'), -- Saturday

-- Mike's Music Lessons - Tuesday to Saturday 10-8
('660e8400-e29b-41d4-a716-446655440002', 2, '10:00', '20:00'), -- Tuesday
('660e8400-e29b-41d4-a716-446655440002', 3, '10:00', '20:00'), -- Wednesday
('660e8400-e29b-41d4-a716-446655440002', 4, '10:00', '20:00'), -- Thursday
('660e8400-e29b-41d4-a716-446655440002', 5, '10:00', '20:00'), -- Friday
('660e8400-e29b-41d4-a716-446655440002', 6, '10:00', '18:00'); -- Saturday

-- Insert sample bookings
INSERT INTO bookings (id, provider_id, client_name, client_email, client_phone, service_id, booking_date, start_time, end_time, duration, price, status, notes) VALUES
('880e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440001', 'John Doe', 'john@example.com', '+1234567892', '770e8400-e29b-41d4-a716-446655440001', '2024-01-15', '10:00', '11:00', 60, 45.00, 'confirmed', ''),
('880e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440001', 'Jane Smith', 'jane@example.com', '+1234567893', '770e8400-e29b-41d4-a716-446655440002', '2024-01-15', '14:00', '16:00', 120, 85.00, 'pending', 'First time client'),
('880e8400-e29b-41d4-a716-446655440003', '660e8400-e29b-41d4-a716-446655440002', 'Alice Brown', 'alice@example.com', '+1234567894', '770e8400-e29b-41d4-a716-446655440005', '2024-01-16', '15:00', '16:00', 60, 50.00, 'confirmed', 'Beginner level');

-- Insert provider settings
INSERT INTO provider_settings (provider_id, buffer_time, max_advance_booking, require_confirmation, allow_cancellation, cancellation_deadline) VALUES
('660e8400-e29b-41d4-a716-446655440001', 15, 30, true, true, 24),
('660e8400-e29b-41d4-a716-446655440002', 10, 60, false, true, 12);

-- Insert sample reviews
INSERT INTO reviews (booking_id, provider_id, client_name, client_email, rating, comment) VALUES
('880e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440001', 'John Doe', 'john@example.com', 5, 'Excellent service! Sarah did an amazing job with my haircut.'),
('880e8400-e29b-41d4-a716-446655440003', '660e8400-e29b-41d4-a716-446655440002', 'Alice Brown', 'alice@example.com', 5, 'Great guitar lesson! Mike is very patient and knowledgeable.');
