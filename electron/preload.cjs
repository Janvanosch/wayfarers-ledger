const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("ledger", {
  getStatus: () => ipcRenderer.invoke("ledger:getStatus"),
  vault: {
    chooseExisting: () => ipcRenderer.invoke("ledger:vault:chooseExisting"),
    createNew: (wayfarerName) =>
      ipcRenderer.invoke("ledger:vault:createNew", wayfarerName),
  },
});
