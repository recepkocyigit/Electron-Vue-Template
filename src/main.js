import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'node:path';
import started from 'electron-squirrel-startup';
import { fileURLToPath } from "url";
import { fork } from "child_process";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function startServer() {
  let serverPath = path.resolve(process.cwd(), "server", "server.cjs");
  
  if (!fs.existsSync(serverPath)) {
    serverPath = path.join(process.resourcesPath || __dirname, "server", "server.cjs");
  }

  // 3) Hâlâ yoksa hata verip log at
  if (!fs.existsSync(serverPath)) {
    console.error("Server script bulunamadı. Denenen yollar:");
    console.error(" __dirname:", __dirname);
    console.error(" process.cwd():", process.cwd());
    console.error(" serverPath:", serverPath);
    return;
  }

  // console.log("Server path:", serverPath);
  
  fork(serverPath, { silent: false });
  const serverProcess = fork(serverPath);
  serverProcess.on("message", (data) => {
      if (data?.type === "server-log") {
          const win = BrowserWindow.getAllWindows()[0];
          if (win) win.webContents.send("server-log", data.message);
      }
  });
}


// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (started) {
  app.quit();
}

const createWindow = () => {
  startServer();
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1366,
    height: 768,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      // contextIsolation: true,
    },
  });

  ipcMain.on("server-log", (event, message) => {
    if (mainWindow) {
      mainWindow.webContents.send("server-log-to-ui", message);
    }
  });

  // and load the index.html of the app.
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`));
  }

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow();

  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});



// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
