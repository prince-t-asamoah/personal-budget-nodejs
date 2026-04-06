require("../../config/loadEnv")();

const db = require("../../config/db.config");

async function truncateAllTables() {
  await db.query(`
        DO $$ DECLARE
            r RECORD;
        BEGIN
            FOR r IN (
                SELECT tablename FROM pg_tables
                WHERE schemaname = 'public'
            ) LOOP
             EXECUTE 'TRUNCATE TABLE ' || quote_ident(r.tablename) || ' RESTART IDENTITY CASCADE';
            END LOOP;
        END $$;
        `);
}

beforeEach(async function () {
  await truncateAllTables();
});

after(async function () {
  await db.end();
  console.log("✔ DB pool closed");
});
