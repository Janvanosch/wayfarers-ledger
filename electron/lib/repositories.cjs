const { createRepository } = require("./repository.cjs");

// Additional repositories (gear, festivals, outfits, ...) are created the
// same way, once those features are built and their tables migrated in.
const wayfarers = createRepository("wayfarers", "wayfarer", [
  { js: "id", db: "id" },
  { js: "name", db: "name" },
  { js: "journeyStarted", db: "journey_started" },
  { js: "createdAt", db: "created_at" },
  { js: "updatedAt", db: "updated_at" },
  { js: "deletedAt", db: "deleted_at" },
]);

module.exports = { wayfarers };
