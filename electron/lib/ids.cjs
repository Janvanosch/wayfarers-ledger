const crypto = require("node:crypto");

function generateId(prefix) {
  const suffix = crypto.randomBytes(3).toString("hex").toUpperCase();
  return `${prefix}_${suffix}`;
}

module.exports = { generateId };
