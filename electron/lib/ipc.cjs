const { ipcMain, dialog } = require("electron");
const vault = require("./vault.cjs");
const database = require("./database.cjs");
const linkPreview = require("./linkPreview.cjs");
const {
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
  timelineEvents,
  wishlistItems,
} = require("./repositories.cjs");
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

function withOutfitExtras(item) {
  if (!item) return item;
  return { ...item, coverPhotoFilename: photoFilename(item.coverPhotoId) };
}

function withWishlistExtras(item) {
  if (!item) return item;
  const maker = item.makerId ? makers.findById(item.makerId) : null;
  return {
    ...item,
    isFavourite: Boolean(item.isFavourite),
    coverPhotoFilename: photoFilename(item.coverPhotoId),
    makerName: maker ? maker.name : null,
  };
}

function resolveGearSummaries(gearIds) {
  return gearIds
    .map((gearId) => gear.findById(gearId))
    .filter(Boolean)
    .map(withGearExtras);
}

function withVersionGear(version) {
  return { ...version, gear: resolveGearSummaries(version.gearIds) };
}

function resolveOutfitSummaries(outfitIds) {
  return outfitIds
    .map((outfitId) => outfits.findById(outfitId))
    .filter(Boolean)
    .map(withOutfitExtras);
}

function withJournalEntryExtras(entry) {
  if (!entry) return entry;
  const festival = entry.festivalId ? festivals.findById(entry.festivalId) : null;
  const photoIds = journalEntryPhotos.rightIdsFor(entry.id);

  return {
    ...entry,
    festivalName: festival ? festival.name : null,
    gear: resolveGearSummaries(journalEntryGear.rightIdsFor(entry.id)),
    outfits: resolveOutfitSummaries(journalEntryOutfits.rightIdsFor(entry.id)),
    photos: photoIds
      .map((photoId) => photos.findById(photoId))
      .filter(Boolean)
      .map((photo) => ({ id: photo.id, filename: photo.filename })),
  };
}

function replaceLinks(joinTable, leftId, rightIds) {
  const current = new Set(joinTable.rightIdsFor(leftId));
  const next = new Set(rightIds ?? []);
  for (const id of current) {
    if (!next.has(id)) joinTable.unlink(leftId, id);
  }
  for (const id of next) {
    if (!current.has(id)) joinTable.link(leftId, id);
  }
}

function addJournalEntryPhotos(journalEntryId, photoPaths) {
  for (const photoPath of photoPaths ?? []) {
    const photoId = importPhotoIfProvided(photoPath);
    if (photoId) journalEntryPhotos.link(journalEntryId, photoId);
  }
}

// Timeline Events are generated from meaningful actions, never manually
// created or edited from the UI - "not every database update becomes a
// Timeline Event" (Chapter 4).
function recordTimelineEvent(title, relatedType, relatedId) {
  timelineEvents.create({
    title,
    relatedType: relatedType ?? null,
    relatedId: relatedId ?? null,
    occurredAt: new Date().toISOString(),
  });
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
    const wayfarer = wayfarers.create({
      name: wayfarerName,
      journeyStarted: new Date().toISOString(),
    });
    recordTimelineEvent("Journey Started", "wayfarer", wayfarer.id);

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
    const isFirst = gear.findAll().length === 0;
    const created = gear.create({ ...rest, coverPhotoId });
    recordTimelineEvent(
      isFirst ? `First Gear: ${created.name}` : `New Gear: ${created.name}`,
      "gear",
      created.id,
    );
    return withGearExtras(created);
  });

  ipcMain.handle("gear:update", (_event, id, fields) => {
    const { photoPath, ...rest } = fields;
    if (photoPath) {
      rest.coverPhotoId = importPhotoIfProvided(photoPath);
    }
    return withGearExtras(gear.update(id, rest));
  });

  ipcMain.handle("gear:delete", (_event, id) => gear.softDelete(id));

  ipcMain.handle("gear:restore", (_event, id) => withGearExtras(gear.restore(id)));

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

  ipcMain.handle("makers:delete", (_event, id) => makers.softDelete(id));

  ipcMain.handle("makers:restore", (_event, id) =>
    withMakerExtras(makers.restore(id)),
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
    const isFirst = festivals.findAll().length === 0;
    const created = festivals.create({ ...rest, coverPhotoId });
    recordTimelineEvent(
      isFirst
        ? `First Festival: ${created.name}`
        : `New Festival: ${created.name}`,
      "festival",
      created.id,
    );
    return withFestivalExtras(created);
  });

  ipcMain.handle("festivals:update", (_event, id, fields) => {
    const { photoPath, ...rest } = fields;
    if (photoPath) {
      rest.coverPhotoId = importPhotoIfProvided(photoPath);
    }
    return withFestivalExtras(festivals.update(id, rest));
  });

  ipcMain.handle("festivals:gearFor", (_event, festivalId) => {
    const gearIds = new Set(gearFestivals.leftIdsFor(festivalId));
    return gear
      .findAll()
      .filter((item) => gearIds.has(item.id))
      .map(withGearExtras);
  });

  ipcMain.handle("gear:festivalsFor", (_event, gearId) => {
    const festivalIds = new Set(gearFestivals.rightIdsFor(gearId));
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

  ipcMain.handle("outfits:list", () => outfits.findAll().map(withOutfitExtras));

  ipcMain.handle("outfits:get", (_event, id) =>
    withOutfitExtras(outfits.findById(id)),
  );

  ipcMain.handle("outfits:create", (_event, fields) => {
    const { photoPath, ...rest } = fields;
    const coverPhotoId = importPhotoIfProvided(photoPath);
    const isFirst = outfits.findAll().length === 0;
    const created = outfits.create({ ...rest, coverPhotoId, currentVersion: 0 });
    recordTimelineEvent(
      isFirst ? `First Outfit: ${created.name}` : `New Outfit: ${created.name}`,
      "outfit",
      created.id,
    );
    return withOutfitExtras(created);
  });

  ipcMain.handle("outfits:update", (_event, id, fields) => {
    const { photoPath, ...rest } = fields;
    if (photoPath) {
      rest.coverPhotoId = importPhotoIfProvided(photoPath);
    }
    return withOutfitExtras(outfits.update(id, rest));
  });

  ipcMain.handle("outfits:createVersion", (_event, outfitId, fields) => {
    const outfit = outfits.findById(outfitId);
    if (!outfit) return null;

    const nextVersion = outfit.currentVersion + 1;
    const version = outfitVersions.create({
      outfitId,
      version: nextVersion,
      gearIds: fields.gearIds ?? [],
      notes: fields.notes ?? null,
    });
    outfits.update(outfitId, { currentVersion: nextVersion });
    recordTimelineEvent(
      `${outfit.name} — Version ${nextVersion}`,
      "outfit",
      outfitId,
    );

    return withVersionGear(version);
  });

  ipcMain.handle("outfits:versions", (_event, outfitId) =>
    outfitVersions.findAllForOutfit(outfitId).map(withVersionGear),
  );

  ipcMain.handle("outfits:currentGear", (_event, outfitId) => {
    const outfit = outfits.findById(outfitId);
    if (!outfit || outfit.currentVersion === 0) return [];
    const version = outfitVersions.findVersion(outfitId, outfit.currentVersion);
    return version ? resolveGearSummaries(version.gearIds) : [];
  });

  ipcMain.handle("journal:list", () =>
    journalEntries.findAll().map(withJournalEntryExtras),
  );

  ipcMain.handle("journal:get", (_event, id) =>
    withJournalEntryExtras(journalEntries.findById(id)),
  );

  ipcMain.handle("journal:listForFestival", (_event, festivalId) =>
    journalEntries
      .findAll()
      .filter((entry) => entry.festivalId === festivalId)
      .map(withJournalEntryExtras),
  );

  ipcMain.handle("journal:create", (_event, fields) => {
    const { photoPaths, gearIds, outfitIds, ...rest } = fields;
    const isFirst = journalEntries.findAll().length === 0;
    const entry = journalEntries.create(rest);
    addJournalEntryPhotos(entry.id, photoPaths);
    replaceLinks(journalEntryGear, entry.id, gearIds);
    replaceLinks(journalEntryOutfits, entry.id, outfitIds);
    recordTimelineEvent(
      isFirst ? "First Journal Entry" : `Journal Entry: ${entry.title || "Untitled"}`,
      "journalEntry",
      entry.id,
    );
    return withJournalEntryExtras(entry);
  });

  ipcMain.handle("journal:update", (_event, id, fields) => {
    const { photoPaths, gearIds, outfitIds, ...rest } = fields;
    const updated = journalEntries.update(id, rest);
    addJournalEntryPhotos(id, photoPaths);
    if (gearIds !== undefined) replaceLinks(journalEntryGear, id, gearIds);
    if (outfitIds !== undefined) replaceLinks(journalEntryOutfits, id, outfitIds);
    return withJournalEntryExtras(updated);
  });

  ipcMain.handle("timeline:list", (_event, limit) => {
    const events = timelineEvents.findAll();
    return typeof limit === "number" ? events.slice(0, limit) : events;
  });

  ipcMain.handle("wishlist:list", () =>
    wishlistItems.findAll().map(withWishlistExtras),
  );

  ipcMain.handle("wishlist:get", (_event, id) =>
    withWishlistExtras(wishlistItems.findById(id)),
  );

  ipcMain.handle("wishlist:create", (_event, fields) => {
    const { photoPath, isFavourite, ...rest } = fields;
    const coverPhotoId = importPhotoIfProvided(photoPath);
    return withWishlistExtras(
      wishlistItems.create({
        ...rest,
        coverPhotoId,
        isFavourite: isFavourite ? 1 : 0,
      }),
    );
  });

  ipcMain.handle("wishlist:fetchImageFromUrl", async (_event, url) => {
    try {
      const tempPath = await linkPreview.fetchPreviewImage(url);
      if (!tempPath) {
        return { success: false, error: "No photo could be found at that link." };
      }
      return { success: true, photoPath: tempPath };
    } catch (error) {
      logger.warn("Failed to fetch preview image", { url, error: error.message });
      return { success: false, error: error.message };
    }
  });

  ipcMain.handle("wishlist:update", (_event, id, fields) => {
    const { photoPath, isFavourite, ...rest } = fields;
    if (photoPath) {
      rest.coverPhotoId = importPhotoIfProvided(photoPath);
    }
    if (isFavourite !== undefined) {
      rest.isFavourite = isFavourite ? 1 : 0;
    }
    return withWishlistExtras(wishlistItems.update(id, rest));
  });

  // "When purchased: Wishlist Item -> Convert to Gear. No information is
  // lost" - creates a real Gear item from what's already known, then
  // soft-deletes the Wishlist entry rather than losing it outright.
  ipcMain.handle("wishlist:convertToGear", (_event, id) => {
    const item = wishlistItems.findById(id);
    if (!item) return null;

    const isFirst = gear.findAll().length === 0;
    const created = gear.create({
      name: item.name,
      makerId: item.makerId,
      coverPhotoId: item.coverPhotoId,
    });
    recordTimelineEvent(
      isFirst ? `First Gear: ${created.name}` : `New Gear: ${created.name}`,
      "gear",
      created.id,
    );
    wishlistItems.softDelete(id);

    return withGearExtras(created);
  });

  ipcMain.handle("wishlist:delete", (_event, id) => wishlistItems.softDelete(id));

  ipcMain.handle("wishlist:restore", (_event, id) =>
    withWishlistExtras(wishlistItems.restore(id)),
  );

  ipcMain.handle("recentlyDeleted:list", () => ({
    gear: gear.findDeleted().map(withGearExtras),
    makers: makers.findDeleted().map(withMakerExtras),
    wishlist: wishlistItems.findDeleted().map(withWishlistExtras),
  }));

  logger.info("IPC handlers registered");
}

module.exports = { registerIpcHandlers, getStatus };
