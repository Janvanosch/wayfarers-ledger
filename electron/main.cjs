const { app, BrowserWindow } = require("electron");
const path = require("node:path");

const logger = require("./lib/logger.cjs");
const settings = require("./lib/settings.cjs");
const database = require("./lib/database.cjs");
const vault = require("./lib/vault.cjs");
const { registerIpcHandlers } = require("./lib/ipc.cjs");

const isDev = !app.isPackaged;
let mainWindow = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 960,
    minHeight: 640,
    title: "The Wayfarer's Ledger",
    webPreferences: {
      preload: path.join(__dirname, "preload.cjs"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  if (isDev) {
    mainWindow.loadURL("http://localhost:5173");
  } else {
    mainWindow.loadFile(path.join(__dirname, "../dist/index.html"));
  }
}

async function reopenRememberedVault() {
  const rememberedPath = vault.getRememberedVaultPath();
  if (!rememberedPath) return;

  const { opened } = vault.openVault(rememberedPath);
  if (!opened) {
    logger.warn("Remembered vault no longer contains a .ledger file", {
      vaultPath: rememberedPath,
    });
  }
}

app.whenReady().then(async () => {
  logger.init();
  settings.init();
  await database.init();
  await reopenRememberedVault();

  registerIpcHandlers(() => mainWindow);
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  database.close();
  if (process.platform !== "darwin") {
    app.quit();
  }
});
