
const fs = require("fs");
const path = require("path");
const loadEnv = require("../config/loadEnv");

loadEnv();
const db = require("../config/db.config");

async function runMigrations() {
  const migrationsDir = path.join(__dirname, "migrations");

  const files = fs
    .readdirSync(migrationsDir)
    .filter((f) => f.endsWith(".sql"))
    .sort(); // Ensures 001, 002 order

  console.log("Running migrations...");

  for (const file of files) {
    const filePath = path.join(migrationsDir, file);
    const sql = fs.readFileSync(filePath, "utf-8");
    console.log(`Applying: ${file}`);

    await db.query(sql);
  }

  console.log("All migrations applied successfully.");
  await db.end();
}

runMigrations().catch((error) => {
  console.error("Migration failed: ", error);
  process.exit(1);
});
