const { createRepository, createJoinTable } = require("./repository.cjs");
const database = require("./database.cjs");
const { generateId } = require("./ids.cjs");

// Additional repositories (festivals, outfits, makers, ...) are created the
// same way, once those features are built and their tables migrated in.
const wayfarers = createRepository("wayfarers", "wayfarer", [
  { js: "id", db: "id" },
  { js: "name", db: "name" },
  { js: "journeyStarted", db: "journey_started" },
  { js: "createdAt", db: "created_at" },
  { js: "updatedAt", db: "updated_at" },
  { js: "deletedAt", db: "deleted_at" },
]);

const photos = createRepository("photos", "photo", [
  { js: "id", db: "id" },
  { js: "filename", db: "filename" },
  { js: "relativePath", db: "relative_path" },
  { js: "checksum", db: "checksum" },
  { js: "importDate", db: "import_date" },
  { js: "createdAt", db: "created_at" },
  { js: "updatedAt", db: "updated_at" },
  { js: "deletedAt", db: "deleted_at" },
]);

const gear = createRepository("gear", "gear", [
  { js: "id", db: "id" },
  { js: "name", db: "name" },
  { js: "category", db: "category" },
  { js: "material", db: "material" },
  { js: "weight", db: "weight" },
  { js: "colour", db: "colour" },
  { js: "price", db: "price" },
  { js: "coverPhotoId", db: "cover_photo_id" },
  { js: "makerId", db: "maker_id" },
  { js: "createdAt", db: "created_at" },
  { js: "updatedAt", db: "updated_at" },
  { js: "deletedAt", db: "deleted_at" },
]);

const makers = createRepository("makers", "maker", [
  { js: "id", db: "id" },
  { js: "name", db: "name" },
  { js: "website", db: "website" },
  { js: "instagram", db: "instagram" },
  { js: "notes", db: "notes" },
  { js: "logoPhotoId", db: "logo_photo_id" },
  { js: "createdAt", db: "created_at" },
  { js: "updatedAt", db: "updated_at" },
  { js: "deletedAt", db: "deleted_at" },
]);

const festivals = createRepository("festivals", "festival", [
  { js: "id", db: "id" },
  { js: "name", db: "name" },
  { js: "startDate", db: "start_date" },
  { js: "endDate", db: "end_date" },
  { js: "location", db: "location" },
  { js: "weather", db: "weather" },
  { js: "notes", db: "notes" },
  { js: "coverPhotoId", db: "cover_photo_id" },
  { js: "createdAt", db: "created_at" },
  { js: "updatedAt", db: "updated_at" },
  { js: "deletedAt", db: "deleted_at" },
]);

// gear_festivals is a plain many-to-many join table (no soft delete, no
// single id), so it doesn't fit the generic repository pattern above.
// leftIdsFor(festivalId) -> gear_ids, rightIdsFor(gearId) -> festival_ids.
const gearFestivals = createJoinTable("gear_festivals", "gear_id", "festival_id");

const outfits = createRepository("outfits", "outfit", [
  { js: "id", db: "id" },
  { js: "name", db: "name" },
  { js: "coverPhotoId", db: "cover_photo_id" },
  { js: "currentVersion", db: "current_version" },
  { js: "createdAt", db: "created_at" },
  { js: "updatedAt", db: "updated_at" },
  { js: "deletedAt", db: "deleted_at" },
]);

function outfitVersionFromRow(row) {
  return {
    id: row.id,
    outfitId: row.outfit_id,
    version: row.version,
    gearIds: JSON.parse(row.gear_ids),
    notes: row.notes,
    createdAt: row.created_at,
  };
}

// Outfit Versions are immutable snapshots ("Versions never change. A new
// version creates a new record."), so they don't fit the generic
// create/update/softDelete repository pattern above — there is no update.
const outfitVersions = {
  create({ outfitId, version, gearIds, notes }) {
    const db = database.getDb();
    const id = generateId("outfitversion");
    const createdAt = new Date().toISOString();
    db.run(
      "INSERT INTO outfit_versions (id, outfit_id, version, gear_ids, notes, created_at) VALUES (?, ?, ?, ?, ?, ?)",
      [id, outfitId, version, JSON.stringify(gearIds ?? []), notes ?? null, createdAt],
    );
    database.save();
    return outfitVersionFromRow({
      id,
      outfit_id: outfitId,
      version,
      gear_ids: JSON.stringify(gearIds ?? []),
      notes: notes ?? null,
      created_at: createdAt,
    });
  },

  findAllForOutfit(outfitId) {
    const db = database.getDb();
    const stmt = db.prepare(
      "SELECT * FROM outfit_versions WHERE outfit_id = :outfitId ORDER BY version DESC",
    );
    stmt.bind({ ":outfitId": outfitId });
    const results = [];
    while (stmt.step()) results.push(outfitVersionFromRow(stmt.getAsObject()));
    stmt.free();
    return results;
  },

  findVersion(outfitId, version) {
    const db = database.getDb();
    const stmt = db.prepare(
      "SELECT * FROM outfit_versions WHERE outfit_id = :outfitId AND version = :version",
    );
    stmt.bind({ ":outfitId": outfitId, ":version": version });
    const found = stmt.step() ? outfitVersionFromRow(stmt.getAsObject()) : null;
    stmt.free();
    return found;
  },
};

const journalEntries = createRepository("journal_entries", "journalentry", [
  { js: "id", db: "id" },
  { js: "title", db: "title" },
  { js: "body", db: "body" },
  { js: "festivalId", db: "festival_id" },
  { js: "createdAt", db: "created_at" },
  { js: "updatedAt", db: "updated_at" },
  { js: "deletedAt", db: "deleted_at" },
]);

const journalEntryPhotos = createJoinTable(
  "journal_entry_photos",
  "journal_entry_id",
  "photo_id",
);
const journalEntryGear = createJoinTable(
  "journal_entry_gear",
  "journal_entry_id",
  "gear_id",
);
const journalEntryOutfits = createJoinTable(
  "journal_entry_outfits",
  "journal_entry_id",
  "outfit_id",
);

module.exports = {
  wayfarers,
  photos,
  gear,
  makers,
  festivals,
  gearFestivals,
  outfits,
  outfitVersions,
  journalEntries,
  journalEntryPhotos,
  journalEntryGear,
  journalEntryOutfits,
};
