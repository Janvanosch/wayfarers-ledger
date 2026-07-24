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
  },
  makers: {
    list: () => ipcRenderer.invoke("makers:list"),
    get: (id) => ipcRenderer.invoke("makers:get", id),
    create: (fields) => ipcRenderer.invoke("makers:create", fields),
    update: (id, fields) => ipcRenderer.invoke("makers:update", id, fields),
    gearFor: (makerId) => ipcRenderer.invoke("makers:gearFor", makerId),
  },
  festivals: {
    list: () => ipcRenderer.invoke("festivals:list"),
    get: (id) => ipcRenderer.invoke("festivals:get", id),
    create: (fields) => ipcRenderer.invoke("festivals:create", fields),
    update: (id, fields) => ipcRenderer.invoke("festivals:update", id, fields),
    gearFor: (festivalId) => ipcRenderer.invoke("festivals:gearFor", festivalId),
  },
});
