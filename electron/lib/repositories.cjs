const { createRepository } = require("./repository.cjs");

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

module.exports = { wayfarers, photos, gear, makers };
