-- Seed Data for CRM System Testing
-- This file contains sample data for development and testing

-- Users Table Seed Data
INSERT INTO users (id, email, password_hash, first_name, last_name, role, company, phone, is_active, created_at, updated_at) VALUES
(1, 'admin@crm.com', '$2a$10$rQZ8K9L2M3N4O5P6Q7R8S9T0U1V2W3X4Y5Z6A7B8C9D0E1F2G3H4I5J6', 'John', 'Admin', 'admin', 'CRM Corp', '+1234567890', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(2, 'manager@crm.com', '$2a$10$rQZ8K9L2M3N4O5P6Q7R8S9T0U1V2W3X4Y5Z6A7B8C9D0E1F2G3H4I5J6', 'Sarah', 'Manager', 'manager', 'CRM Corp', '+1234567891', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(3, 'sales@crm.com', '$2a$10$rQZ8K9L2M3N4O5P6Q7R8S9T0U1V2W3X4Y5Z6A7B8C9D0E1F2G3H4I5J6', 'Mike', 'Sales', 'sales', 'CRM Corp', '+1234567892', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(4, 'user@crm.com', '$2a$10$rQZ8K9L2M3N4O5P6Q7R8S9T0U1V2W3X4Y5Z6A7B8C9D0E1F2G3H4I5J6', 'Lisa', 'User', 'user', 'CRM Corp', '+1234567893', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Customers Table Seed Data
INSERT INTO customers (id, name, email, phone, company, status, source, address, notes, assigned_to, tags, lead_score, created_at, updated_at, last_contact) VALUES
(1, 'John Smith', 'john.smith@acmecorp.com', '+1987654321', 'Acme Corporation', 'active', 'website', '123 Business St, New York, NY 10001', 'High-value customer, interested in enterprise solutions', 3, ARRAY['enterprise', 'high-value'], 85, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(2, 'Jane Doe', 'jane.doe@techstartup.com', '+1987654322', 'Tech Startup Inc', 'lead', 'referral', '456 Innovation Ave, San Francisco, CA 94102', 'Startup looking for scalable solutions', 3, ARRAY['startup', 'tech'], 65, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(3, 'Bob Johnson', 'bob.johnson@manufacturing.com', '+1987654323', 'Manufacturing Co', 'prospect', 'cold', '789 Industrial Blvd, Chicago, IL 60601', 'Manufacturing company exploring automation', 2, ARRAY['manufacturing', 'automation'], 45, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(4, 'Alice Brown', 'alice.brown@retail.com', '+1987654324', 'Retail Solutions', 'active', 'social', '321 Commerce Dr, Los Angeles, CA 90210', 'Retail chain expanding to online sales', 3, ARRAY['retail', 'ecommerce'], 75, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(5, 'Charlie Wilson', 'charlie.wilson@healthcare.com', '+1987654325', 'Healthcare Systems', 'lead', 'email', '654 Medical Center Way, Boston, MA 02101', 'Healthcare provider seeking patient management system', 2, ARRAY['healthcare', 'compliance'], 70, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(6, 'Diana Garcia', 'diana.garcia@finance.com', '+1987654326', 'Financial Services Ltd', 'prospect', 'website', '987 Banking Plaza, Miami, FL 33101', 'Financial services firm needing secure solutions', 3, ARRAY['finance', 'security'], 60, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(7, 'Edward Lee', 'edward.lee@education.com', '+1987654327', 'Education Institute', 'active', 'referral', '147 Learning Lane, Seattle, WA 98101', 'Educational institution modernizing their systems', 2, ARRAY['education', 'digital'], 80, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(8, 'Fiona Martinez', 'fiona.martinez@consulting.com', '+1987654328', 'Consulting Partners', 'lead', 'cold', '258 Strategy St, Austin, TX 73301', 'Consulting firm looking for project management tools', 3, ARRAY['consulting', 'project-management'], 55, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(9, 'George Taylor', 'george.taylor@logistics.com', '+1987654329', 'Logistics Solutions', 'prospect', 'social', '369 Supply Chain Ave, Denver, CO 80201', 'Logistics company seeking optimization software', 2, ARRAY['logistics', 'optimization'], 50, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(10, 'Helen Anderson', 'helen.anderson@realestate.com', '+1987654330', 'Real Estate Group', 'active', 'website', '741 Property Blvd, Phoenix, AZ 85001', 'Real estate agency needing CRM for property management', 3, ARRAY['real-estate', 'property'], 90, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Opportunities Table Seed Data
INSERT INTO opportunities (id, title, customer_id, amount, stage, probability, expected_close_date, assigned_to, description, created_at, updated_at) VALUES
(1, 'Enterprise Software License', 1, 50000.00, 'proposal', 0.75, '2024-03-15', 3, 'Large enterprise software license for Acme Corporation', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(2, 'Startup Package Deal', 2, 15000.00, 'negotiation', 0.60, '2024-02-28', 3, 'Scalable solution package for Tech Startup Inc', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(3, 'Automation Implementation', 3, 35000.00, 'qualification', 0.40, '2024-04-10', 2, 'Manufacturing automation system implementation', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(4, 'E-commerce Platform', 4, 25000.00, 'closed', 1.00, '2024-01-20', 3, 'E-commerce platform for Retail Solutions', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(5, 'Healthcare Management System', 5, 75000.00, 'proposal', 0.80, '2024-03-30', 2, 'Comprehensive healthcare patient management system', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(6, 'Secure Banking Solution', 6, 45000.00, 'qualification', 0.35, '2024-05-15', 3, 'Secure financial services platform', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(7, 'Educational Platform', 7, 30000.00, 'negotiation', 0.70, '2024-03-05', 2, 'Digital learning platform for Education Institute', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(8, 'Project Management Tools', 8, 20000.00, 'qualification', 0.45, '2024-04-20', 3, 'Project management suite for Consulting Partners', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(9, 'Logistics Optimization', 9, 40000.00, 'proposal', 0.65, '2024-03-25', 2, 'Supply chain optimization software', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(10, 'Property Management CRM', 10, 35000.00, 'closed', 1.00, '2024-01-15', 3, 'Property management CRM for Real Estate Group', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Activities Table Seed Data
INSERT INTO activities (id, type, subject, description, customer_id, opportunity_id, assigned_to, due_date, completed_at, created_at) VALUES
(1, 'call', 'Initial Contact - Acme Corp', 'Initial discovery call with John Smith to understand requirements', 1, 1, 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(2, 'meeting', 'Product Demo - Tech Startup', 'Product demonstration for Tech Startup Inc team', 2, 2, 3, CURRENT_TIMESTAMP + INTERVAL '2 days', NULL, CURRENT_TIMESTAMP),
(3, 'email', 'Follow-up - Manufacturing Co', 'Follow-up email with proposal details for Manufacturing Co', 3, 3, 2, CURRENT_TIMESTAMP + INTERVAL '1 day', NULL, CURRENT_TIMESTAMP),
(4, 'call', 'Contract Discussion - Retail Solutions', 'Contract discussion with Alice Brown from Retail Solutions', 4, 4, 3, CURRENT_TIMESTAMP - INTERVAL '1 day', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(5, 'meeting', 'Requirements Gathering - Healthcare', 'Requirements gathering session with Healthcare Systems', 5, 5, 2, CURRENT_TIMESTAMP + INTERVAL '3 days', NULL, CURRENT_TIMESTAMP),
(6, 'email', 'Proposal Sent - Financial Services', 'Proposal sent to Financial Services Ltd', 6, 6, 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(7, 'call', 'Technical Review - Education Institute', 'Technical review call with Education Institute team', 7, 7, 2, CURRENT_TIMESTAMP + INTERVAL '1 day', NULL, CURRENT_TIMESTAMP),
(8, 'meeting', 'Discovery Meeting - Consulting Partners', 'Discovery meeting with Consulting Partners', 8, 8, 3, CURRENT_TIMESTAMP + INTERVAL '4 days', NULL, CURRENT_TIMESTAMP),
(9, 'email', 'Follow-up - Logistics Solutions', 'Follow-up email with case studies for Logistics Solutions', 9, 9, 2, CURRENT_TIMESTAMP + INTERVAL '2 days', NULL, CURRENT_TIMESTAMP),
(10, 'call', 'Contract Signing - Real Estate Group', 'Contract signing call with Real Estate Group', 10, 10, 3, CURRENT_TIMESTAMP - INTERVAL '2 days', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Notifications Table Seed Data
INSERT INTO notifications (id, user_id, type, title, message, is_read, data, created_at) VALUES
(1, 3, 'opportunity', 'New Opportunity Created', 'New opportunity "Enterprise Software License" created for Acme Corporation', false, '{"opportunity_id": 1, "customer_id": 1}', CURRENT_TIMESTAMP),
(2, 2, 'activity', 'Activity Due Tomorrow', 'Follow-up call with Manufacturing Co is due tomorrow', false, '{"activity_id": 3, "customer_id": 3}', CURRENT_TIMESTAMP),
(3, 3, 'lead', 'High-Score Lead', 'New lead "Healthcare Systems" has a high lead score of 70', false, '{"customer_id": 5, "lead_score": 70}', CURRENT_TIMESTAMP),
(4, 2, 'opportunity', 'Opportunity Stage Changed', 'Opportunity "Startup Package Deal" moved to negotiation stage', false, '{"opportunity_id": 2, "old_stage": "proposal", "new_stage": "negotiation"}', CURRENT_TIMESTAMP),
(5, 3, 'customer', 'Customer Anniversary', 'Acme Corporation has been a customer for 1 year today', false, '{"customer_id": 1, "anniversary_type": "customer"}', CURRENT_TIMESTAMP),
(6, 2, 'activity', 'Meeting Reminder', 'Product demo with Tech Startup Inc in 2 hours', false, '{"activity_id": 2, "customer_id": 2}', CURRENT_TIMESTAMP),
(7, 3, 'opportunity', 'Opportunity Closed', 'Opportunity "E-commerce Platform" has been closed successfully', false, '{"opportunity_id": 4, "amount": 25000.00}', CURRENT_TIMESTAMP),
(8, 2, 'lead', 'Lead Score Increased', 'Lead score for "Financial Services Ltd" increased from 50 to 60', false, '{"customer_id": 6, "old_score": 50, "new_score": 60}', CURRENT_TIMESTAMP),
(9, 3, 'activity', 'Activity Completed', 'Contract discussion with Retail Solutions has been completed', false, '{"activity_id": 4, "customer_id": 4}', CURRENT_TIMESTAMP),
(10, 2, 'opportunity', 'Opportunity Updated', 'Opportunity "Healthcare Management System" amount updated to $75,000', false, '{"opportunity_id": 5, "old_amount": 70000.00, "new_amount": 75000.00}', CURRENT_TIMESTAMP);

-- Additional test data for comprehensive testing
INSERT INTO customers (id, name, email, phone, company, status, source, address, notes, assigned_to, tags, lead_score, created_at, updated_at, last_contact) VALUES
(11, 'Test Customer 1', 'test1@example.com', '+1111111111', 'Test Company 1', 'lead', 'website', 'Test Address 1', 'Test notes for customer 1', 3, ARRAY['test'], 30, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(12, 'Test Customer 2', 'test2@example.com', '+1111111112', 'Test Company 2', 'prospect', 'referral', 'Test Address 2', 'Test notes for customer 2', 2, ARRAY['test'], 40, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(13, 'Test Customer 3', 'test3@example.com', '+1111111113', 'Test Company 3', 'active', 'cold', 'Test Address 3', 'Test notes for customer 3', 3, ARRAY['test'], 60, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Additional opportunities for testing
INSERT INTO opportunities (id, title, customer_id, amount, stage, probability, expected_close_date, assigned_to, description, created_at, updated_at) VALUES
(11, 'Test Opportunity 1', 11, 10000.00, 'qualification', 0.25, '2024-06-15', 3, 'Test opportunity 1', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(12, 'Test Opportunity 2', 12, 20000.00, 'proposal', 0.50, '2024-05-20', 2, 'Test opportunity 2', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(13, 'Test Opportunity 3', 13, 30000.00, 'negotiation', 0.75, '2024-04-30', 3, 'Test opportunity 3', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Additional activities for testing
INSERT INTO activities (id, type, subject, description, customer_id, opportunity_id, assigned_to, due_date, completed_at, created_at) VALUES
(11, 'call', 'Test Call 1', 'Test call description 1', 11, 11, 3, CURRENT_TIMESTAMP + INTERVAL '1 day', NULL, CURRENT_TIMESTAMP),
(12, 'meeting', 'Test Meeting 1', 'Test meeting description 1', 12, 12, 2, CURRENT_TIMESTAMP + INTERVAL '2 days', NULL, CURRENT_TIMESTAMP),
(13, 'email', 'Test Email 1', 'Test email description 1', 13, 13, 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Additional notifications for testing
INSERT INTO notifications (id, user_id, type, title, message, is_read, data, created_at) VALUES
(11, 3, 'test', 'Test Notification 1', 'Test notification message 1', false, '{"test": "data1"}', CURRENT_TIMESTAMP),
(12, 2, 'test', 'Test Notification 2', 'Test notification message 2', true, '{"test": "data2"}', CURRENT_TIMESTAMP),
(13, 3, 'test', 'Test Notification 3', 'Test notification message 3', false, '{"test": "data3"}', CURRENT_TIMESTAMP); 