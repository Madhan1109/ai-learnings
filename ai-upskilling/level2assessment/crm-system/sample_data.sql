-- Sample Data for CRM System
-- This script populates the database with realistic sample data

-- Update existing users with proper password hashes (password: admin123)
UPDATE users 
SET password_hash = '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj3ZxQQxq3Ti'
WHERE username IN ('admin', 'user', 'testadmin', 'testuser', 'simpleuser', 'demo');

-- Insert additional sample users
INSERT INTO users (username, email, password_hash, first_name, last_name, role, company, phone, is_active) VALUES
('manager', 'manager@crm.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj3ZxQQxq3Ti', 'John', 'Manager', 'admin', 'CRM Corp', '+1234567890', true),
('sales1', 'sales1@crm.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj3ZxQQxq3Ti', 'Sarah', 'Sales', 'user', 'CRM Corp', '+1234567891', true),
('sales2', 'sales2@crm.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj3ZxQQxq3Ti', 'Mike', 'Johnson', 'user', 'CRM Corp', '+1234567892', true);

-- Insert sample customers
INSERT INTO customers (name, email, phone, company, industry, status, lead_score, source, address, notes, assigned_to, tags, last_contact, created_at, updated_at) VALUES
('Acme Corporation', 'contact@acme.com', '+1-555-0101', 'Acme Corp', 'Technology', 'ACTIVE', 85, 'Website', '123 Business Ave, Tech City, TC 12345', 'High-value enterprise client', 1, ARRAY['enterprise', 'tech'], '2025-08-05 10:30:00', '2025-01-15 09:00:00', '2025-08-05 10:30:00'),
('Global Solutions Inc', 'info@globalsolutions.com', '+1-555-0102', 'Global Solutions', 'Consulting', 'ACTIVE', 92, 'Referral', '456 Corporate Blvd, Business District, BD 67890', 'Strategic partner opportunity', 1, ARRAY['enterprise', 'consulting'], '2025-08-06 14:15:00', '2025-02-20 11:30:00', '2025-08-06 14:15:00'),
('TechStart Pro', 'hello@techstart.com', '+1-555-0103', 'TechStart', 'Startup', 'LEAD', 78, 'Social Media', '789 Innovation St, Startup Hub, SH 11111', 'Promising startup with growth potential', 2, ARRAY['startup', 'tech'], '2025-08-04 16:45:00', '2025-03-10 13:20:00', '2025-08-04 16:45:00'),
('Retail Plus', 'sales@retailplus.com', '+1-555-0104', 'Retail Plus', 'Retail', 'ACTIVE', 65, 'Cold Call', '321 Commerce Way, Retail Center, RC 22222', 'Expanding retail chain', 2, ARRAY['retail', 'expansion'], '2025-08-03 09:20:00', '2025-04-05 10:15:00', '2025-08-03 09:20:00'),
('Healthcare Systems', 'info@healthcare.com', '+1-555-0105', 'Healthcare Systems', 'Healthcare', 'PROSPECT', 88, 'Trade Show', '654 Medical Dr, Health District, HD 33333', 'Healthcare technology solutions', 3, ARRAY['healthcare', 'enterprise'], '2025-08-02 11:00:00', '2025-05-12 14:30:00', '2025-08-02 11:00:00'),
('Manufacturing Co', 'contact@manufacturing.com', '+1-555-0106', 'Manufacturing Co', 'Manufacturing', 'ACTIVE', 72, 'Website', '987 Industrial Ave, Factory Zone, FZ 44444', 'Automation and efficiency solutions', 3, ARRAY['manufacturing', 'automation'], '2025-08-01 15:30:00', '2025-06-18 16:45:00', '2025-08-01 15:30:00'),
('Financial Services Ltd', 'partners@financial.com', '+1-555-0107', 'Financial Services', 'Finance', 'LEAD', 95, 'Referral', '147 Banking St, Finance District, FD 55555', 'High-net-worth financial services', 1, ARRAY['finance', 'enterprise'], '2025-07-30 13:45:00', '2025-07-01 09:00:00', '2025-07-30 13:45:00'),
('Education First', 'info@educationfirst.com', '+1-555-0108', 'Education First', 'Education', 'PROSPECT', 68, 'Email Campaign', '258 Learning Blvd, Education Center, EC 66666', 'Educational technology platform', 2, ARRAY['education', 'tech'], '2025-07-29 10:15:00', '2025-07-15 11:30:00', '2025-07-29 10:15:00'),
('Green Energy Corp', 'contact@greenenergy.com', '+1-555-0109', 'Green Energy', 'Energy', 'ACTIVE', 82, 'Website', '369 Renewable Way, Energy Park, EP 77777', 'Sustainable energy solutions', 3, ARRAY['energy', 'sustainability'], '2025-07-28 14:20:00', '2025-07-20 15:00:00', '2025-07-28 14:20:00'),
('Logistics Express', 'sales@logistics.com', '+1-555-0110', 'Logistics Express', 'Logistics', 'LEAD', 75, 'Cold Call', '741 Transport Ave, Logistics Hub, LH 88888', 'Supply chain optimization', 1, ARRAY['logistics', 'supply-chain'], '2025-07-27 16:30:00', '2025-07-25 12:00:00', '2025-07-27 16:30:00');

-- Insert sample opportunities
INSERT INTO opportunities (customer_id, title, description, amount, stage, probability, expected_close_date, assigned_to, created_at, updated_at) VALUES
(1, 'Enterprise Software License', 'Comprehensive software licensing deal for 500+ users', 150000.00, 'NEGOTIATION', 85, '2025-09-15', 1, '2025-06-01 10:00:00', '2025-08-05 10:30:00'),
(2, 'Consulting Services Contract', 'Strategic consulting services for digital transformation', 75000.00, 'PROPOSAL', 70, '2025-09-30', 1, '2025-06-15 14:30:00', '2025-08-06 14:15:00'),
(3, 'Startup Growth Package', 'Scalable solution for growing startup', 25000.00, 'QUALIFICATION', 60, '2025-08-25', 2, '2025-07-01 09:15:00', '2025-08-04 16:45:00'),
(4, 'Retail Expansion Project', 'Multi-location retail management system', 45000.00, 'CLOSED_WON', 95, '2025-08-10', 2, '2025-07-10 11:20:00', '2025-08-03 09:20:00'),
(5, 'Healthcare Platform Implementation', 'Comprehensive healthcare management platform', 120000.00, 'PROSPECTING', 40, '2025-10-15', 3, '2025-07-15 16:45:00', '2025-08-02 11:00:00'),
(6, 'Manufacturing Automation', 'Industrial automation and efficiency solutions', 85000.00, 'NEGOTIATION', 80, '2025-09-20', 3, '2025-07-20 13:30:00', '2025-08-01 15:30:00'),
(7, 'Financial Services Platform', 'High-security financial services platform', 200000.00, 'PROPOSAL', 75, '2025-10-30', 1, '2025-08-01 10:00:00', '2025-07-30 13:45:00'),
(8, 'Educational Technology Suite', 'Comprehensive educational technology platform', 35000.00, 'QUALIFICATION', 55, '2025-09-05', 2, '2025-08-05 14:20:00', '2025-07-29 10:15:00'),
(9, 'Energy Management System', 'Sustainable energy management and monitoring', 95000.00, 'CLOSED_WON', 90, '2025-08-20', 3, '2025-08-10 11:45:00', '2025-07-28 14:20:00'),
(10, 'Logistics Optimization', 'Supply chain optimization and tracking system', 65000.00, 'PROSPECTING', 45, '2025-10-10', 1, '2025-08-15 15:30:00', '2025-07-27 16:30:00');

-- Insert sample tasks
INSERT INTO tasks (title, description, assigned_to, customer_id, opportunity_id, due_date, status, priority, created_at, updated_at) VALUES
('Follow up with Acme Corp', 'Schedule demo for enterprise software license', 1, 1, 1, '2025-08-08 14:00:00', 'PENDING', 'HIGH', '2025-08-05 10:30:00', '2025-08-05 10:30:00'),
('Prepare proposal for Global Solutions', 'Create detailed proposal for consulting services', 1, 2, 2, '2025-08-10 17:00:00', 'IN_PROGRESS', 'HIGH', '2025-08-06 14:15:00', '2025-08-06 14:15:00'),
('Demo for TechStart Pro', 'Conduct product demonstration for startup', 2, 3, 3, '2025-08-07 10:00:00', 'COMPLETED', 'MEDIUM', '2025-08-04 16:45:00', '2025-08-04 16:45:00'),
('Contract review for Retail Plus', 'Review and finalize retail expansion contract', 2, 4, 4, '2025-08-09 11:00:00', 'PENDING', 'HIGH', '2025-08-03 09:20:00', '2025-08-03 09:20:00'),
('Healthcare requirements gathering', 'Meet with healthcare team to gather requirements', 3, 5, 5, '2025-08-12 13:00:00', 'PENDING', 'MEDIUM', '2025-08-02 11:00:00', '2025-08-02 11:00:00'),
('Manufacturing site visit', 'Visit manufacturing facility for assessment', 3, 6, 6, '2025-08-11 09:00:00', 'IN_PROGRESS', 'HIGH', '2025-08-01 15:30:00', '2025-08-01 15:30:00'),
('Financial security review', 'Conduct security assessment for financial platform', 1, 7, 7, '2025-08-14 15:00:00', 'PENDING', 'HIGH', '2025-07-30 13:45:00', '2025-07-30 13:45:00'),
('Education platform demo', 'Demonstrate educational technology features', 2, 8, 8, '2025-08-13 10:30:00', 'PENDING', 'MEDIUM', '2025-07-29 10:15:00', '2025-07-29 10:15:00'),
('Energy system installation', 'Oversee energy management system installation', 3, 9, 9, '2025-08-15 08:00:00', 'IN_PROGRESS', 'HIGH', '2025-07-28 14:20:00', '2025-07-28 14:20:00'),
('Logistics assessment', 'Assess current logistics operations', 1, 10, 10, '2025-08-16 14:00:00', 'PENDING', 'MEDIUM', '2025-07-27 16:30:00', '2025-07-27 16:30:00');

-- Insert sample contact history
INSERT INTO contact_history (customer_id, user_id, contact_type, subject, notes, contact_date, created_at) VALUES
(1, 1, 'Phone Call', 'Initial Contact', 'Discussed enterprise software needs and scheduled demo', '2025-08-05 10:30:00', '2025-08-05 10:30:00'),
(2, 1, 'Meeting', 'Requirements Discussion', 'Met with key stakeholders to understand consulting needs', '2025-08-06 14:15:00', '2025-08-06 14:15:00'),
(3, 2, 'Demo', 'Product Demonstration', 'Conducted comprehensive product demo for startup team', '2025-08-04 16:45:00', '2025-08-04 16:45:00'),
(4, 2, 'Email', 'Contract Review', 'Sent contract for review and requested feedback', '2025-08-03 09:20:00', '2025-08-03 09:20:00'),
(5, 3, 'Phone Call', 'Requirements Gathering', 'Discussed healthcare platform requirements and compliance needs', '2025-08-02 11:00:00', '2025-08-02 11:00:00'),
(6, 3, 'Site Visit', 'Facility Assessment', 'Visited manufacturing facility to assess automation needs', '2025-08-01 15:30:00', '2025-08-01 15:30:00'),
(7, 1, 'Meeting', 'Security Review', 'Met with IT team to discuss security requirements', '2025-07-30 13:45:00', '2025-07-30 13:45:00'),
(8, 2, 'Demo', 'Educational Platform Demo', 'Demonstrated educational technology features to school district', '2025-07-29 10:15:00', '2025-07-29 10:15:00'),
(9, 3, 'Site Visit', 'Energy System Installation', 'Oversaw installation of energy management system', '2025-07-28 14:20:00', '2025-07-28 14:20:00'),
(10, 1, 'Phone Call', 'Logistics Assessment', 'Discussed current logistics operations and optimization opportunities', '2025-07-27 16:30:00', '2025-07-27 16:30:00');

-- Insert sample notifications
INSERT INTO notifications (user_id, title, message, type, is_read, data, created_at) VALUES
(1, 'New Lead Assigned', 'Acme Corporation has been assigned to you', 'INFO', false, '{"customer_id": 1, "lead_score": 85}', '2025-08-05 10:30:00'),
(1, 'Opportunity Update', 'Global Solutions opportunity moved to Proposal stage', 'SUCCESS', false, '{"opportunity_id": 2, "stage": "PROPOSAL"}', '2025-08-06 14:15:00'),
(2, 'Task Due Today', 'Demo for TechStart Pro is scheduled for today', 'WARNING', false, '{"task_id": 3, "due_date": "2025-08-07"}', '2025-08-07 08:00:00'),
(2, 'Contract Signed', 'Retail Plus contract has been signed', 'SUCCESS', false, '{"opportunity_id": 4, "amount": 45000}', '2025-08-03 09:20:00'),
(3, 'Site Visit Scheduled', 'Healthcare Systems site visit scheduled for tomorrow', 'INFO', false, '{"customer_id": 5, "visit_date": "2025-08-12"}', '2025-08-02 11:00:00'),
(3, 'Installation Complete', 'Energy management system installation completed', 'SUCCESS', false, '{"opportunity_id": 9, "status": "COMPLETED"}', '2025-08-01 15:30:00'),
(1, 'High-Value Lead', 'Financial Services Ltd has a lead score of 95', 'INFO', false, '{"customer_id": 7, "lead_score": 95}', '2025-07-30 13:45:00'),
(2, 'Demo Request', 'Education First requested a product demonstration', 'INFO', false, '{"customer_id": 8, "request_type": "DEMO"}', '2025-07-29 10:15:00'),
(3, 'System Alert', 'Manufacturing automation system requires maintenance', 'WARNING', false, '{"system": "AUTOMATION", "alert": "MAINTENANCE"}', '2025-07-28 14:20:00'),
(1, 'Logistics Assessment', 'Logistics Express assessment scheduled for next week', 'INFO', false, '{"customer_id": 10, "assessment_date": "2025-08-16"}', '2025-07-27 16:30:00');

-- Insert sample AI analytics
INSERT INTO ai_analytics (customer_id, lead_score, sentiment_score, conversion_probability, next_best_action, created_at) VALUES
(1, 85, 0.85, 0.78, 'Schedule follow-up meeting', '2025-08-05 10:30:00'),
(2, 92, 0.92, 0.85, 'Prepare detailed proposal', '2025-08-06 14:15:00'),
(3, 78, 0.78, 0.65, 'Conduct product demo', '2025-08-04 16:45:00'),
(4, 65, 0.65, 0.95, 'Finalize contract', '2025-08-03 09:20:00'),
(5, 88, 0.88, 0.72, 'Gather requirements', '2025-08-02 11:00:00'),
(6, 72, 0.72, 0.68, 'Conduct site assessment', '2025-08-01 15:30:00'),
(7, 95, 0.95, 0.88, 'Security review meeting', '2025-07-30 13:45:00'),
(8, 68, 0.68, 0.55, 'Educational platform demo', '2025-07-29 10:15:00'),
(9, 82, 0.82, 0.90, 'Complete installation', '2025-07-28 14:20:00'),
(10, 75, 0.75, 0.62, 'Conduct logistics assessment', '2025-07-27 16:30:00');

-- Insert sample activities
INSERT INTO activities (type, subject, description, customer_id, opportunity_id, assigned_to, due_date, completed_at, created_at) VALUES
('Meeting', 'Acme Corp Demo', 'Product demonstration for enterprise software', 1, 1, 1, '2025-08-08 14:00:00', NULL, '2025-08-05 10:30:00'),
('Proposal', 'Global Solutions Proposal', 'Prepare consulting services proposal', 2, 2, 1, '2025-08-10 17:00:00', NULL, '2025-08-06 14:15:00'),
('Demo', 'TechStart Demo', 'Product demonstration for startup', 3, 3, 2, '2025-08-07 10:00:00', '2025-08-07 10:00:00', '2025-08-04 16:45:00'),
('Contract', 'Retail Plus Contract', 'Review and finalize retail contract', 4, 4, 2, '2025-08-09 11:00:00', NULL, '2025-08-03 09:20:00'),
('Assessment', 'Healthcare Requirements', 'Gather healthcare platform requirements', 5, 5, 3, '2025-08-12 13:00:00', NULL, '2025-08-02 11:00:00'),
('Site Visit', 'Manufacturing Assessment', 'Visit manufacturing facility', 6, 6, 3, '2025-08-11 09:00:00', NULL, '2025-08-01 15:30:00'),
('Review', 'Financial Security', 'Conduct security assessment', 7, 7, 1, '2025-08-14 15:00:00', NULL, '2025-07-30 13:45:00'),
('Demo', 'Education Platform', 'Demonstrate educational technology', 8, 8, 2, '2025-08-13 10:30:00', NULL, '2025-07-29 10:15:00'),
('Installation', 'Energy System', 'Install energy management system', 9, 9, 3, '2025-08-15 08:00:00', NULL, '2025-07-28 14:20:00'),
('Assessment', 'Logistics Review', 'Assess logistics operations', 10, 10, 1, '2025-08-16 14:00:00', NULL, '2025-07-27 16:30:00');

-- Insert sample documents
INSERT INTO documents (customer_id, opportunity_id, filename, file_path, file_type, file_size, uploaded_by, created_at) VALUES
(1, 1, 'Acme_Requirements.pdf', '/documents/acme_requirements.pdf', 'application/pdf', 2048576, 1, '2025-08-05 10:30:00'),
(2, 2, 'Global_Solutions_Proposal.pdf', '/documents/global_proposal.pdf', 'application/pdf', 3072000, 1, '2025-08-06 14:15:00'),
(3, 3, 'TechStart_Demo_Recording.mp4', '/documents/techstart_demo.mp4', 'video/mp4', 15728640, 2, '2025-08-04 16:45:00'),
(4, 4, 'Retail_Plus_Contract.pdf', '/documents/retail_contract.pdf', 'application/pdf', 1536000, 2, '2025-08-03 09:20:00'),
(5, 5, 'Healthcare_Requirements.docx', '/documents/healthcare_requirements.docx', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 512000, 3, '2025-08-02 11:00:00'),
(6, 6, 'Manufacturing_Assessment.pdf', '/documents/manufacturing_assessment.pdf', 'application/pdf', 4096000, 3, '2025-08-01 15:30:00'),
(7, 7, 'Financial_Security_Report.pdf', '/documents/security_report.pdf', 'application/pdf', 2560000, 1, '2025-07-30 13:45:00'),
(8, 8, 'Education_Platform_Specs.pdf', '/documents/education_specs.pdf', 'application/pdf', 1792000, 2, '2025-07-29 10:15:00'),
(9, 9, 'Energy_System_Manual.pdf', '/documents/energy_manual.pdf', 'application/pdf', 5120000, 3, '2025-07-28 14:20:00'),
(10, 10, 'Logistics_Assessment.xlsx', '/documents/logistics_assessment.xlsx', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 1024000, 1, '2025-07-27 16:30:00');

-- Update sequence numbers to avoid conflicts
SELECT setval('users_id_seq', (SELECT MAX(id) FROM users));
SELECT setval('customers_id_seq', (SELECT MAX(id) FROM customers));
SELECT setval('opportunities_id_seq', (SELECT MAX(id) FROM opportunities));
SELECT setval('tasks_id_seq', (SELECT MAX(id) FROM tasks));
SELECT setval('contact_history_id_seq', (SELECT MAX(id) FROM contact_history));
SELECT setval('notifications_id_seq', (SELECT MAX(id) FROM notifications));
SELECT setval('ai_analytics_id_seq', (SELECT MAX(id) FROM ai_analytics));
SELECT setval('activities_id_seq', (SELECT MAX(id) FROM activities));
SELECT setval('documents_id_seq', (SELECT MAX(id) FROM documents));
