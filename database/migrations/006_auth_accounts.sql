DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_type
        WHERE typname = 'auth_provider_type'
    ) THEN
    CREATE TYPE auth_provider_type AS ENUM (
        'local',
        'google',
        'apple',
        'microsoft',
        'facebook'
    );
    END IF;
END $$;

CREATE TABLE IF NOT EXISTS auth_acccounts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    provider auth_provider_type DEFAULT 'local' NOT NULL,
    provider_user_id TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS auth_provider_user_unique
ON auth_acccounts(provider, provider_user_id);