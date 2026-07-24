const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("ledger", {
  getStatus: () => ipcRenderer.invoke("ledger:getStatus"),
  vault: {
    chooseExisting: () => ipcRenderer.invoke("ledger:vault:chooseExisting"),
    createNew: (wayfarerName) =>
      ipcRenderer.invoke("ledger:vault:createNew", wayfarerName),
  },
  photos: {
    pickFile: () => ipcRenderer.invoke("photos:pickFile"),
  },
  gear: {
    list: () => ipcRenderer.invoke("gear:list"),
    get: (id) => ipcRenderer.invoke("gear:get", id),
    create: (fields) => ipcRenderer.invoke("gear:create", fields),
    update: (id, fields) => ipcRenderer.invoke("gear:update", id, fields),
    festivalsFor: (gearId) => ipcRenderer.invoke("gear:festivalsFor", gearId),
    linkFestival: (gearId, festivalId) =>
      ipcRenderer.invoke("gear:linkFestival", gearId, festivalId),
    unlinkFestival: (gearId, festivalId) =>
      ipcRenderer.invoke("gear:unlinkFestival", gearId, festivalId),
    delete: (id) => ipcRenderer.invoke("gear:delete", id),
    restore: (id) => ipcRenderer.invoke("gear:restore", id),
  },
  makers: {
    list: () => ipcRenderer.invoke("makers:list"),
    get: (id) => ipcRenderer.invoke("makers:get", id),
    create: (fields) => ipcRenderer.invoke("makers:create", fields),
    update: (id, fields) => ipcRenderer.invoke("makers:update", id, fields),
    gearFor: (makerId) => ipcRenderer.invoke("makers:gearFor", makerId),
    delete: (id) => ipcRenderer.invoke("makers:delete", id),
    restore: (id) => ipcRenderer.invoke("makers:restore", id),
  },
  festivals: {
    list: () => ipcRenderer.invoke("festivals:list"),
    get: (id) => ipcRenderer.invoke("festivals:get", id),
    create: (fields) => ipcRenderer.invoke("festivals:create", fields),
    update: (id, fields) => ipcRenderer.invoke("festivals:update", id, fields),
    gearFor: (festivalId) => ipcRenderer.invoke("festivals:gearFor", festivalId),
  },
  outfits: {
    list: () => ipcRenderer.invoke("outfits:list"),
    get: (id) => ipcRenderer.invoke("outfits:get", id),
    create: (fields) => ipcRenderer.invoke("outfits:create", fields),
    update: (id, fields) => ipcRenderer.invoke("outfits:update", id, fields),
    createVersion: (id, fields) =>
      ipcRenderer.invoke("outfits:createVersion", id, fields),
    versions: (id) => ipcRenderer.invoke("outfits:versions", id),
    currentGear: (id) => ipcRenderer.invoke("outfits:currentGear", id),
  },
  journal: {
    list: () => ipcRenderer.invoke("journal:list"),
    get: (id) => ipcRenderer.invoke("journal:get", id),
    listForFestival: (festivalId) =>
      ipcRenderer.invoke("journal:listForFestival", festivalId),
    create: (fields) => ipcRenderer.invoke("journal:create", fields),
    update: (id, fields) => ipcRenderer.invoke("journal:update", id, fields),
  },
  timeline: {
    list: (limit) => ipcRenderer.invoke("timeline:list", limit),
  },
  wishlist: {
    list: () => ipcRenderer.invoke("wishlist:list"),
    get: (id) => ipcRenderer.invoke("wishlist:get", id),
    create: (fields) => ipcRenderer.invoke("wishlist:create", fields),
    update: (id, fields) => ipcRenderer.invoke("wishlist:update", id, fields),
    convertToGear: (id) => ipcRenderer.invoke("wishlist:convertToGear", id),
    fetchImageFromUrl: (url) =>
      ipcRenderer.invoke("wishlist:fetchImageFromUrl", url),
    delete: (id) => ipcRenderer.invoke("wishlist:delete", id),
    restore: (id) => ipcRenderer.invoke("wishlist:restore", id),
  },
  recentlyDeleted: {
    list: () => ipcRenderer.invoke("recentlyDeleted:list"),
  },
});
