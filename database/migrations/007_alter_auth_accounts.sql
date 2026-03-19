DO $$
BEGIN
	IF to_regclass('public.auth_acccounts') IS NOT NULL
	   AND to_regclass('public.auth_accounts') IS NULL THEN
		ALTER TABLE auth_acccounts RENAME TO auth_accounts;
	END IF;
END $$;