DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_type
        WHERE typname = 'transaction_type'
    ) THEN
        CREATE TYPE transaction_type AS ENUM (
            'INITIAL_ALLOCATION',
            'FUNDING',
            'EXPENSE',
            'TRANSFER_IN',
            'TRANSFER_OUT',
            'ADJUSTMENT'
        );
    END IF;
END $$;

CREATE TABLE
    IF NOT EXISTS transactions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
        envelope_id UUID NOT NULL REFERENCES envelopes (id) ON DELETE CASCADE,
        type transaction_type NOT NULL,
        amount DECIMAL(12, 2) NOT NULL CHECK (amount > 0),
        currency CHAR(3) NOT NULL CHECK (currency IN ('USD', 'GHS', 'EUR', 'GBP')),
        balance_after DECIMAL(12, 2) NOT NULL,
        description TEXT NOT NULL,
        notes TEXT DEFAULT NULL,
        reference_id UUID DEFAULT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW ()
    );