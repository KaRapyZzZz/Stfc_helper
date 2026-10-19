const { app, BrowserWindow, shell, ipcMain } = require('electron');
const path = require('path');

let mainWindow;

// Register IPC handler to reliably open any external link in the default browser
ipcMain.handle('open-external-url', async (event, url) => {
  if (url && (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('mailto:'))) {
    try {
      await shell.openExternal(url);
      return true;
    } catch (err) {
      console.error('Failed to open external url:', err);
      return false;
    }
  }
  return false;
});

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 820,
    minWidth: 1024,
    minHeight: 680,
    backgroundColor: '#0c0f17',
    autoHideMenuBar: true,
    title: 'STFC Command Helper',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: false // allow smooth loading of remote images and data
    }
  });

  const isDev = !app.isPackaged && process.argv.includes('--dev');

  if (isDev) {
    mainWindow.loadURL('http://localhost:5173');
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  // Intercept any new window creation and forward directly to default external browser
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('http://') || url.startsWith('https://')) {
      shell.openExternal(url);
    }
    return { action: 'deny' };
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
