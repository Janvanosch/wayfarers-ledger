const fs = require("node:fs");
const path = require("node:path");
const initSqlJs = require("sql.js");
const logger = require("./logger.cjs");

let SQL = null;
let db = null;
let currentFilePath = null;

const MIGRATIONS = [
  {
    version: 1,
    up(database) {
      database.run(`
        CREATE TABLE wayfarers (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          journey_started TEXT,
          created_at TEXT NOT NULL,
          updated_at TEXT NOT NULL,
          deleted_at TEXT
        );
      `);
    },
  },
];

async function init() {
  if (!SQL) {
    SQL = await initSqlJs({
      locateFile: (file) =>
        path.join(__dirname, "../../node_modules/sql.js/dist", file),
    });
  }
}

function getSchemaVersion(database) {
  const stmt = database.prepare(
    "SELECT value FROM meta WHERE key = 'schema_version'",
  );
  const version = stmt.step() ? Number(stmt.getAsObject().value) : 0;
  stmt.free();
  return version;
}

function runMigrations(database) {
  database.run(
    "CREATE TABLE IF NOT EXISTS meta (key TEXT PRIMARY KEY, value TEXT)",
  );
  const currentVersion = getSchemaVersion(database);

  for (const migration of MIGRATIONS) {
    if (migration.version > currentVersion) {
      migration.up(database);
      database.run(
        "INSERT OR REPLACE INTO meta (key, value) VALUES ('schema_version', ?)",
        [String(migration.version)],
      );
      logger.info("Applied ledger migration", { version: migration.version });
    }
  }
}

function open(filePath) {
  currentFilePath = filePath;
  const existingData = fs.existsSync(filePath) ? fs.readFileSync(filePath) : null;

  db = existingData ? new SQL.Database(existingData) : new SQL.Database();
  runMigrations(db);
  save();

  logger.info("Ledger opened", { filePath });
  return db;
}

function save() {
  if (!db || !currentFilePath) return;
  const data = db.export();
  fs.writeFileSync(currentFilePath, Buffer.from(data));
}

function getDb() {
  if (!db) {
    throw new Error("Ledger database is not open yet.");
  }
  return db;
}

function isOpen() {
  return db !== null;
}

function close() {
  if (db) {
    save();
    db.close();
    db = null;
    currentFilePath = null;
  }
}

module.exports = { init, open, save, getDb, isOpen, close };
