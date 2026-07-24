const database = require("./database.cjs");
const { generateId } = require("./ids.cjs");

function nowIso() {
  return new Date().toISOString();
}

/**
 * Generic CRUD repository for a table, given a mapping between JS field
 * names (camelCase) and database columns (snake_case). New entities and
 * features should get a repository this way instead of writing raw SQL.
 */
function createRepository(table, idPrefix, columns) {
  function toRow(entity) {
    const row = {};
    for (const column of columns) {
      if (entity[column.js] !== undefined) {
        row[column.db] = entity[column.js];
      }
    }
    return row;
  }

  function fromRow(row) {
    const entity = {};
    for (const column of columns) {
      entity[column.js] = row[column.db];
    }
    return entity;
  }

  return {
    create(fields) {
      const db = database.getDb();
      const timestamp = nowIso();
      const entity = {
        id: generateId(idPrefix),
        createdAt: timestamp,
        updatedAt: timestamp,
        deletedAt: null,
        ...fields,
      };
      const row = toRow(entity);
      const dbColumns = Object.keys(row);
      const placeholders = dbColumns.map(() => "?").join(", ");

      db.run(
        `INSERT INTO ${table} (${dbColumns.join(", ")}) VALUES (${placeholders})`,
        dbColumns.map((column) => row[column]),
      );
      database.save();

      return entity;
    },

    findById(id) {
      const db = database.getDb();
      const stmt = db.prepare(
        `SELECT * FROM ${table} WHERE id = :id AND deleted_at IS NULL`,
      );
      stmt.bind({ ":id": id });
      const result = stmt.step() ? fromRow(stmt.getAsObject()) : null;
      stmt.free();
      return result;
    },

    findAll() {
      const db = database.getDb();
      const stmt = db.prepare(
        `SELECT * FROM ${table} WHERE deleted_at IS NULL ORDER BY created_at DESC`,
      );
      const results = [];
      while (stmt.step()) {
        results.push(fromRow(stmt.getAsObject()));
      }
      stmt.free();
      return results;
    },

    update(id, fields) {
      const db = database.getDb();
      const row = toRow({ ...fields, updatedAt: nowIso() });
      const dbColumns = Object.keys(row);
      if (dbColumns.length === 0) return this.findById(id);

      const setClause = dbColumns.map((column) => `${column} = ?`).join(", ");
      db.run(`UPDATE ${table} SET ${setClause} WHERE id = ?`, [
        ...dbColumns.map((column) => row[column]),
        id,
      ]);
      database.save();

      return this.findById(id);
    },

    softDelete(id) {
      const db = database.getDb();
      db.run(`UPDATE ${table} SET deleted_at = ? WHERE id = ?`, [
        nowIso(),
        id,
      ]);
      database.save();
    },
  };
}

/**
 * Generic many-to-many join table (link/unlink/lookup), for relationships
 * like "which Festivals has this Gear been seen at". No id, no soft delete —
 * just rows connecting two other tables.
 */
function createJoinTable(table, leftColumn, rightColumn) {
  return {
    link(leftId, rightId) {
      const db = database.getDb();
      db.run(
        `INSERT OR IGNORE INTO ${table} (${leftColumn}, ${rightColumn}, created_at) VALUES (?, ?, ?)`,
        [leftId, rightId, nowIso()],
      );
      database.save();
    },

    unlink(leftId, rightId) {
      const db = database.getDb();
      db.run(
        `DELETE FROM ${table} WHERE ${leftColumn} = ? AND ${rightColumn} = ?`,
        [leftId, rightId],
      );
      database.save();
    },

    rightIdsFor(leftId) {
      const db = database.getDb();
      const stmt = db.prepare(
        `SELECT ${rightColumn} AS value FROM ${table} WHERE ${leftColumn} = :leftId`,
      );
      stmt.bind({ ":leftId": leftId });
      const ids = [];
      while (stmt.step()) ids.push(stmt.getAsObject().value);
      stmt.free();
      return ids;
    },

    leftIdsFor(rightId) {
      const db = database.getDb();
      const stmt = db.prepare(
        `SELECT ${leftColumn} AS value FROM ${table} WHERE ${rightColumn} = :rightId`,
      );
      stmt.bind({ ":rightId": rightId });
      const ids = [];
      while (stmt.step()) ids.push(stmt.getAsObject().value);
      stmt.free();
      return ids;
    },
  };
}

module.exports = { createRepository, createJoinTable };
