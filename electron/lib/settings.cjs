const fs = require("node:fs");
const path = require("node:path");
const { app } = require("electron");

let settingsPath = null;
let cache = {};

function init() {
  settingsPath = path.join(app.getPath("userData"), "settings.json");
  cache = readFromDisk();
}

function readFromDisk() {
  try {
    return JSON.parse(fs.readFileSync(settingsPath, "utf-8"));
  } catch {
    return {};
  }
}

function get(key) {
  return cache[key];
}

function set(key, value) {
  cache = { ...cache, [key]: value };
  fs.writeFileSync(settingsPath, JSON.stringify(cache, null, 2), "utf-8");
}

module.exports = { init, get, set };
