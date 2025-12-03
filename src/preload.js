// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("api", {
    onServerLog(callback) {
        ipcRenderer.on("server-log", (_, msg) => callback(msg));
    },
    onServerError(callback) {
        ipcRenderer.on("server-error", (_, msg) => callback(msg));
    }
});

window.addEventListener("DOMContentLoaded", () => {
    console.log("Preload aktif");
});