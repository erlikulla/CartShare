-- CartShare PostgreSQL Database Schema

-- Create database
CREATE DATABASE cartshare;

-- Connect to the database
\c cartshare;

-- Users table
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    household_id BIGINT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Households table
CREATE TABLE households (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    invite_code VARCHAR(6) NOT NULL UNIQUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Grocery items table
CREATE TABLE grocery_items (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    quantity INTEGER NOT NULL,
    category VARCHAR(100) NOT NULL,
    added_by_id BIGINT NOT NULL,
    claimed_by_id BIGINT,
    purchased_by_id BIGINT,
    price DECIMAL(10, 2),
    completed BOOLEAN NOT NULL DEFAULT FALSE,
    household_id BIGINT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP,
    CONSTRAINT fk_added_by FOREIGN KEY (added_by_id) REFERENCES users(id),
    CONSTRAINT fk_claimed_by FOREIGN KEY (claimed_by_id) REFERENCES users(id),
    CONSTRAINT fk_purchased_by FOREIGN KEY (purchased_by_id) REFERENCES users(id),
    CONSTRAINT fk_household FOREIGN KEY (household_id) REFERENCES households(id)
);

-- Add foreign key for users -> households
ALTER TABLE users
    ADD CONSTRAINT fk_user_household FOREIGN KEY (household_id) REFERENCES households(id);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_households_invite_code ON households(invite_code);
CREATE INDEX idx_grocery_items_household ON grocery_items(household_id);
CREATE INDEX idx_grocery_items_completed ON grocery_items(completed);
CREATE INDEX idx_grocery_items_created_at ON grocery_items(created_at);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers to automatically update updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_households_updated_at BEFORE UPDATE ON households
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_grocery_items_updated_at BEFORE UPDATE ON grocery_items
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
