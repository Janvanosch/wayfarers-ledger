const { ipcMain, dialog } = require("electron");
const vault = require("./vault.cjs");
const database = require("./database.cjs");
const { wayfarers, photos, gear, makers, festivals, gearFestivals } =
  require("./repositories.cjs");
const logger = require("./logger.cjs");

const IMAGE_EXTENSIONS = ["jpg", "jpeg", "png", "webp", "gif"];

function importPhotoIfProvided(photoPath) {
  if (!photoPath) return null;
  const imported = vault.importPhoto(photoPath);
  const photo = photos.create({
    filename: imported.filename,
    relativePath: imported.relativePath,
    checksum: imported.checksum,
    importDate: new Date().toISOString(),
  });
  return photo.id;
}

function photoFilename(photoId) {
  if (!photoId) return null;
  const photo = photos.findById(photoId);
  return photo ? photo.filename : null;
}

function withGearExtras(item) {
  if (!item) return item;
  const maker = item.makerId ? makers.findById(item.makerId) : null;
  return {
    ...item,
    coverPhotoFilename: photoFilename(item.coverPhotoId),
    makerName: maker ? maker.name : null,
  };
}

function withMakerExtras(item) {
  if (!item) return item;
  return { ...item, logoPhotoFilename: photoFilename(item.logoPhotoId) };
}

function withFestivalExtras(item) {
  if (!item) return item;
  return { ...item, coverPhotoFilename: photoFilename(item.coverPhotoId) };
}

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

  ipcMain.handle("photos:pickFile", async () => {
    const result = await dialog.showOpenDialog(getWindow(), {
      title: "Choose a photo",
      properties: ["openFile"],
      filters: [{ name: "Images", extensions: IMAGE_EXTENSIONS }],
    });
    if (result.canceled || result.filePaths.length === 0) return null;
    return result.filePaths[0];
  });

  ipcMain.handle("gear:list", () => gear.findAll().map(withGearExtras));

  ipcMain.handle("gear:get", (_event, id) => withGearExtras(gear.findById(id)));

  ipcMain.handle("gear:create", (_event, fields) => {
    const { photoPath, ...rest } = fields;
    const coverPhotoId = importPhotoIfProvided(photoPath);
    return withGearExtras(gear.create({ ...rest, coverPhotoId }));
  });

  ipcMain.handle("gear:update", (_event, id, fields) => {
    const { photoPath, ...rest } = fields;
    if (photoPath) {
      rest.coverPhotoId = importPhotoIfProvided(photoPath);
    }
    return withGearExtras(gear.update(id, rest));
  });

  ipcMain.handle("makers:list", () => makers.findAll().map(withMakerExtras));

  ipcMain.handle("makers:get", (_event, id) =>
    withMakerExtras(makers.findById(id)),
  );

  ipcMain.handle("makers:create", (_event, fields) => {
    const { logoPhotoPath, ...rest } = fields;
    const logoPhotoId = importPhotoIfProvided(logoPhotoPath);
    return withMakerExtras(makers.create({ ...rest, logoPhotoId }));
  });

  ipcMain.handle("makers:update", (_event, id, fields) => {
    const { logoPhotoPath, ...rest } = fields;
    if (logoPhotoPath) {
      rest.logoPhotoId = importPhotoIfProvided(logoPhotoPath);
    }
    return withMakerExtras(makers.update(id, rest));
  });

  ipcMain.handle("makers:gearFor", (_event, makerId) =>
    gear
      .findAll()
      .filter((item) => item.makerId === makerId)
      .map(withGearExtras),
  );

  ipcMain.handle("festivals:list", () =>
    festivals.findAll().map(withFestivalExtras),
  );

  ipcMain.handle("festivals:get", (_event, id) =>
    withFestivalExtras(festivals.findById(id)),
  );

  ipcMain.handle("festivals:create", (_event, fields) => {
    const { photoPath, ...rest } = fields;
    const coverPhotoId = importPhotoIfProvided(photoPath);
    return withFestivalExtras(festivals.create({ ...rest, coverPhotoId }));
  });

  ipcMain.handle("festivals:update", (_event, id, fields) => {
    const { photoPath, ...rest } = fields;
    if (photoPath) {
      rest.coverPhotoId = importPhotoIfProvided(photoPath);
    }
    return withFestivalExtras(festivals.update(id, rest));
  });

  ipcMain.handle("festivals:gearFor", (_event, festivalId) => {
    const gearIds = new Set(gearFestivals.gearIdsForFestival(festivalId));
    return gear
      .findAll()
      .filter((item) => gearIds.has(item.id))
      .map(withGearExtras);
  });

  ipcMain.handle("gear:festivalsFor", (_event, gearId) => {
    const festivalIds = new Set(gearFestivals.festivalIdsForGear(gearId));
    return festivals
      .findAll()
      .filter((item) => festivalIds.has(item.id))
      .map(withFestivalExtras);
  });

  ipcMain.handle("gear:linkFestival", (_event, gearId, festivalId) => {
    gearFestivals.link(gearId, festivalId);
  });

  ipcMain.handle("gear:unlinkFestival", (_event, gearId, festivalId) => {
    gearFestivals.unlink(gearId, festivalId);
  });

  logger.info("IPC handlers registered");
}

module.exports = { registerIpcHandlers, getStatus };
