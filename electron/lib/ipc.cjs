const { ipcMain } = require("electron");
const vault = require("./vault.cjs");
const database = require("./database.cjs");
const { wayfarers } = require("./repositories.cjs");
const logger = require("./logger.cjs");

function getCurrentWayfarer() {
  const all = wayfarers.findAll();
  return all[0] || null;
}

function getStatus() {
  const vaultPath = vault.getRememberedVaultPath();
  const wayfarer = database.isOpen() ? getCurrentWayfarer() : null;
  return {
    ready: Boolean(vaultPath && database.isOpen() && wayfarer),
    vaultPath,
    wayfarer,
  };
}

function registerIpcHandlers(getWindow) {
  ipcMain.handle("ledger:getStatus", () => getStatus());

  ipcMain.handle("ledger:vault:chooseExisting", async () => {
    const folder = await vault.chooseFolder(
      getWindow(),
      "Choose your existing Wayfarer's Vault folder",
    );
    if (!folder) return { success: false, cancelled: true };

    const { opened } = vault.openVault(folder);
    if (!opened) {
      return {
        success: false,
        error:
          "No .ledger file was found in that folder. Choose 'Create a new Vault' instead if this is your first time.",
      };
    }

    return { success: true, status: getStatus() };
  });

  ipcMain.handle("ledger:vault:createNew", async (_event, wayfarerName) => {
    const folder = await vault.chooseFolder(
      getWindow(),
      "Choose where to create your Wayfarer's Vault",
    );
    if (!folder) return { success: false, cancelled: true };

    vault.createLedger(folder, wayfarerName);
    wayfarers.create({ name: wayfarerName, journeyStarted: new Date().toISOString() });

    return { success: true, status: getStatus() };
  });

  logger.info("IPC handlers registered");
}

module.exports = { registerIpcHandlers, getStatus };
