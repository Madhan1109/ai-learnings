-- CRM System Database Initialization
CREATE DATABASE IF NOT EXISTS crm_system;

-- Users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    role VARCHAR(20) DEFAULT 'USER',
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Customers table
CREATE TABLE customers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100),
    phone VARCHAR(20),
    company VARCHAR(100),
    industry VARCHAR(50),
    status VARCHAR(20) DEFAULT 'ACTIVE',
    lead_score INTEGER DEFAULT 0,
    source VARCHAR(50),
    assigned_to INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Opportunities table
CREATE TABLE opportunities (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER REFERENCES customers(id),
    title VARCHAR(200) NOT NULL,
    description TEXT,
    amount DECIMAL(10,2),
    stage VARCHAR(50) DEFAULT 'LEAD',
    probability INTEGER DEFAULT 0,
    expected_close_date DATE,
    assigned_to INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tasks table
CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    assigned_to INTEGER REFERENCES users(id),
    customer_id INTEGER REFERENCES customers(id),
    opportunity_id INTEGER REFERENCES opportunities(id),
    due_date TIMESTAMP,
    status VARCHAR(20) DEFAULT 'PENDING',
    priority VARCHAR(20) DEFAULT 'MEDIUM',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Contact History table
CREATE TABLE contact_history (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER REFERENCES customers(id),
    user_id INTEGER REFERENCES users(id),
    contact_type VARCHAR(50) NOT NULL,
    subject VARCHAR(200),
    notes TEXT,
    contact_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Documents table
CREATE TABLE documents (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER REFERENCES customers(id),
    opportunity_id INTEGER REFERENCES opportunities(id),
    filename VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_type VARCHAR(50),
    file_size BIGINT,
    uploaded_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Notifications table
CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    title VARCHAR(200) NOT NULL,
    message TEXT,
    type VARCHAR(50) DEFAULT 'INFO',
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- AI Analytics table
CREATE TABLE ai_analytics (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER REFERENCES customers(id),
    lead_score INTEGER,
    sentiment_score DECIMAL(3,2),
    conversion_probability DECIMAL(5,4),
    next_best_action VARCHAR(200),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX idx_customers_email ON customers(email);
CREATE INDEX idx_customers_company ON customers(company);
CREATE INDEX idx_customers_assigned_to ON customers(assigned_to);
CREATE INDEX idx_opportunities_customer_id ON opportunities(customer_id);
CREATE INDEX idx_opportunities_stage ON opportunities(stage);
CREATE INDEX idx_opportunities_assigned_to ON opportunities(assigned_to);
CREATE INDEX idx_tasks_assigned_to ON tasks(assigned_to);
CREATE INDEX idx_tasks_customer_id ON tasks(customer_id);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_contact_history_customer_id ON contact_history(customer_id);
CREATE INDEX idx_contact_history_contact_date ON contact_history(contact_date);
CREATE INDEX idx_documents_customer_id ON documents(customer_id);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
CREATE INDEX idx_ai_analytics_customer_id ON ai_analytics(customer_id);

-- Insert sample data
INSERT INTO users (username, email, password_hash, first_name, last_name, role) VALUES
('admin', 'admin@crm.com', '$2a$10$hash', 'Admin', 'User', 'ADMIN'),
('sales1', 'sales1@crm.com', '$2a$10$hash', 'John', 'Sales', 'SALES'),
('sales2', 'sales2@crm.com', '$2a$10$hash', 'Jane', 'Manager', 'SALES_MANAGER'),
('support1', 'support1@crm.com', '$2a$10$hash', 'Mike', 'Support', 'SUPPORT');

INSERT INTO customers (name, email, phone, company, industry, lead_score, assigned_to) VALUES
('Acme Corp', 'contact@acme.com', '+1234567890', 'Acme Corporation', 'Technology', 85, 2),
('TechStart', 'info@techstart.com', '+1987654321', 'TechStart Inc', 'Software', 72, 2),
('Global Solutions', 'sales@globalsolutions.com', '+1555123456', 'Global Solutions Ltd', 'Consulting', 65, 3),
('Innovation Labs', 'hello@innovationlabs.com', '+1444567890', 'Innovation Labs', 'Research', 90, 2);

INSERT INTO opportunities (customer_id, title, description, amount, stage, probability, assigned_to) VALUES
(1, 'Enterprise Software License', 'Annual software license renewal', 50000.00, 'PROPOSAL', 75, 2),
(2, 'Custom Development Project', 'Custom CRM development for TechStart', 150000.00, 'NEGOTIATION', 60, 3),
(3, 'Consulting Services', 'Business process optimization', 25000.00, 'QUALIFIED', 40, 2),
(4, 'Research Partnership', 'AI research collaboration', 100000.00, 'LEAD', 30, 3);

INSERT INTO tasks (title, description, assigned_to, customer_id, due_date, status, priority) VALUES
('Follow up with Acme Corp', 'Call regarding proposal feedback', 2, 1, CURRENT_TIMESTAMP + INTERVAL '2 days', 'PENDING', 'HIGH'),
('Prepare TechStart proposal', 'Create detailed proposal for custom development', 3, 2, CURRENT_TIMESTAMP + INTERVAL '5 days', 'IN_PROGRESS', 'MEDIUM'),
('Schedule meeting with Global Solutions', 'Arrange discovery call', 2, 3, CURRENT_TIMESTAMP + INTERVAL '1 day', 'PENDING', 'HIGH');

INSERT INTO contact_history (customer_id, user_id, contact_type, subject, notes) VALUES
(1, 2, 'CALL', 'Initial Contact', 'Discussed their software needs and current pain points'),
(1, 2, 'EMAIL', 'Proposal Sent', 'Sent enterprise software proposal with pricing'),
(2, 3, 'MEETING', 'Requirements Gathering', 'Met with TechStart team to understand their CRM requirements'),
(3, 2, 'CALL', 'Follow Up', 'Called to discuss consulting services opportunity');

INSERT INTO ai_analytics (customer_id, lead_score, sentiment_score, conversion_probability, next_best_action) VALUES
(1, 85, 0.75, 0.85, 'Send follow-up email with case studies'),
(2, 72, 0.60, 0.72, 'Schedule technical demo'),
(3, 65, 0.45, 0.65, 'Send personalized proposal'),
(4, 90, 0.85, 0.90, 'Schedule executive meeting'); 