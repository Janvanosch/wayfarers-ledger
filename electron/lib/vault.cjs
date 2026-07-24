const fs = require("node:fs");
const path = require("node:path");
const { dialog } = require("electron");
const settings = require("./settings.cjs");
const database = require("./database.cjs");
const logger = require("./logger.cjs");

const VAULT_SUBFOLDERS = ["Photos", "Documents", "Backups", "Exports"];

function ensureVaultStructure(vaultPath) {
  fs.mkdirSync(vaultPath, { recursive: true });
  for (const folder of VAULT_SUBFOLDERS) {
    fs.mkdirSync(path.join(vaultPath, folder), { recursive: true });
  }
}

function findLedgerFile(vaultPath) {
  if (!fs.existsSync(vaultPath)) return null;
  const entry = fs
    .readdirSync(vaultPath)
    .find((file) => file.endsWith(".ledger"));
  return entry ? path.join(vaultPath, entry) : null;
}

function ledgerFileNameFor(wayfarerName) {
  const safeName = wayfarerName.replace(/[^a-zA-Z0-9-_]/g, "") || "Wayfarer";
  return `${safeName}.ledger`;
}

/** Opens the vault's existing .ledger file if one exists. Returns whether one was found. */
function openVault(vaultPath) {
  ensureVaultStructure(vaultPath);
  const ledgerFile = findLedgerFile(vaultPath);
  if (!ledgerFile) return { opened: false };

  database.open(ledgerFile);
  settings.set("vaultPath", vaultPath);
  logger.info("Vault opened", { vaultPath, ledgerFile });
  return { opened: true };
}

/** Creates a brand-new .ledger file in the vault for a newly named Wayfarer. */
function createLedger(vaultPath, wayfarerName) {
  ensureVaultStructure(vaultPath);
  const ledgerFile = path.join(vaultPath, ledgerFileNameFor(wayfarerName));
  database.open(ledgerFile);
  settings.set("vaultPath", vaultPath);
  logger.info("Ledger created", { vaultPath, ledgerFile });
  return ledgerFile;
}

async function chooseFolder(window, dialogTitle) {
  const result = await dialog.showOpenDialog(window, {
    title: dialogTitle,
    properties: ["openDirectory", "createDirectory"],
  });
  if (result.canceled || result.filePaths.length === 0) return null;
  return result.filePaths[0];
}

function getRememberedVaultPath() {
  return settings.get("vaultPath") || null;
}

module.exports = {
  ensureVaultStructure,
  findLedgerFile,
  openVault,
  createLedger,
  chooseFolder,
  getRememberedVaultPath,
};
