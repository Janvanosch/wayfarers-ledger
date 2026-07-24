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
  {
    version: 2,
    up(database) {
      database.run(`
        CREATE TABLE photos (
          id TEXT PRIMARY KEY,
          filename TEXT NOT NULL,
          relative_path TEXT NOT NULL,
          checksum TEXT NOT NULL,
          import_date TEXT NOT NULL,
          created_at TEXT NOT NULL,
          updated_at TEXT NOT NULL,
          deleted_at TEXT
        );

        CREATE TABLE gear (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          category TEXT,
          material TEXT,
          weight TEXT,
          colour TEXT,
          price TEXT,
          cover_photo_id TEXT REFERENCES photos(id),
          created_at TEXT NOT NULL,
          updated_at TEXT NOT NULL,
          deleted_at TEXT
        );
      `);
    },
  },
  {
    version: 3,
    up(database) {
      database.run(`
        CREATE TABLE makers (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          website TEXT,
          instagram TEXT,
          notes TEXT,
          logo_photo_id TEXT REFERENCES photos(id),
          created_at TEXT NOT NULL,
          updated_at TEXT NOT NULL,
          deleted_at TEXT
        );

        ALTER TABLE gear ADD COLUMN maker_id TEXT REFERENCES makers(id);
      `);
    },
  },
  {
    version: 4,
    up(database) {
      database.run(`
        CREATE TABLE festivals (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          start_date TEXT,
          end_date TEXT,
          location TEXT,
          weather TEXT,
          notes TEXT,
          cover_photo_id TEXT REFERENCES photos(id),
          created_at TEXT NOT NULL,
          updated_at TEXT NOT NULL,
          deleted_at TEXT
        );

        CREATE TABLE gear_festivals (
          gear_id TEXT NOT NULL REFERENCES gear(id),
          festival_id TEXT NOT NULL REFERENCES festivals(id),
          created_at TEXT NOT NULL,
          PRIMARY KEY (gear_id, festival_id)
        );
      `);
    },
  },
  {
    version: 5,
    up(database) {
      database.run(`
        CREATE TABLE outfits (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          cover_photo_id TEXT REFERENCES photos(id),
          current_version INTEGER NOT NULL DEFAULT 0,
          created_at TEXT NOT NULL,
          updated_at TEXT NOT NULL,
          deleted_at TEXT
        );

        CREATE TABLE outfit_versions (
          id TEXT PRIMARY KEY,
          outfit_id TEXT NOT NULL REFERENCES outfits(id),
          version INTEGER NOT NULL,
          gear_ids TEXT NOT NULL DEFAULT '[]',
          notes TEXT,
          created_at TEXT NOT NULL,
          UNIQUE (outfit_id, version)
        );
      `);
    },
  },
  {
    version: 6,
    up(database) {
      database.run(`
        CREATE TABLE journal_entries (
          id TEXT PRIMARY KEY,
          title TEXT,
          body TEXT NOT NULL,
          festival_id TEXT REFERENCES festivals(id),
          created_at TEXT NOT NULL,
          updated_at TEXT NOT NULL,
          deleted_at TEXT
        );

        CREATE TABLE journal_entry_photos (
          journal_entry_id TEXT NOT NULL REFERENCES journal_entries(id),
          photo_id TEXT NOT NULL REFERENCES photos(id),
          created_at TEXT NOT NULL,
          PRIMARY KEY (journal_entry_id, photo_id)
        );

        CREATE TABLE journal_entry_gear (
          journal_entry_id TEXT NOT NULL REFERENCES journal_entries(id),
          gear_id TEXT NOT NULL REFERENCES gear(id),
          created_at TEXT NOT NULL,
          PRIMARY KEY (journal_entry_id, gear_id)
        );

        CREATE TABLE journal_entry_outfits (
          journal_entry_id TEXT NOT NULL REFERENCES journal_entries(id),
          outfit_id TEXT NOT NULL REFERENCES outfits(id),
          created_at TEXT NOT NULL,
          PRIMARY KEY (journal_entry_id, outfit_id)
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
