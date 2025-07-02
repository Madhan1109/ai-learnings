CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL
);

CREATE TABLE user_roles (
    user_id INTEGER REFERENCES users(id),
    role_id INTEGER REFERENCES roles(id),
    PRIMARY KEY (user_id, role_id)
);

CREATE TABLE policies (
    id SERIAL PRIMARY KEY,
    policy_number VARCHAR(50) NOT NULL UNIQUE,
    holder_name VARCHAR(100) NOT NULL,
    age INTEGER NOT NULL,
    gender VARCHAR(10) NOT NULL,
    plan_type VARCHAR(50) NOT NULL,
    sum_insured DOUBLE PRECISION NOT NULL,
    premium DOUBLE PRECISION NOT NULL,
    user_id INTEGER REFERENCES users(id)
); 