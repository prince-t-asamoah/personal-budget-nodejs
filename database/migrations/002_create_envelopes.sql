CREATE TABLE IF NOT EXISTS envelopes (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(120) NOT NULL,
    allocated_amount DECIMAL(10, 2) DEFAULT 0.00 NOT NULL,
    spent_amount DECIMAL(10, 2) DEFAULT 0.00 NOT NULL,
    currency TEXT CHECK (currency IN ('USD', 'GHS', 'EUR', 'GBP')) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);