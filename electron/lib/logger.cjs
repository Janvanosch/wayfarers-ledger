const fs = require("node:fs");
const path = require("node:path");
const { app } = require("electron");

let logFilePath = null;

function init() {
  const logsDir = path.join(app.getPath("userData"), "logs");
  fs.mkdirSync(logsDir, { recursive: true });
  logFilePath = path.join(logsDir, "app.log");
}

function write(level, message, meta) {
  const line = `[${new Date().toISOString()}] [${level}] ${message}${
    meta ? " " + JSON.stringify(meta) : ""
  }`;

  const consoleMethod = level === "error" ? "error" : level === "warn" ? "warn" : "log";
  console[consoleMethod](line);

  if (logFilePath) {
    fs.appendFile(logFilePath, line + "\n", () => {});
  }
}

module.exports = {
  init,
  info: (message, meta) => write("info", message, meta),
  warn: (message, meta) => write("warn", message, meta),
  error: (message, meta) => write("error", message, meta),
};
