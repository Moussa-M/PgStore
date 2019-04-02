'use strict'

import {
  app,
  BrowserWindow,
  Menu,
  screen,
  ipcMain,
  globalShortcut
} from 'electron'

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
const winURL = process.env.NODE_ENV === 'development' ?
  `http://localhost:9080` :
  `file://${__dirname}/index.html`



let printWindow;
let loadingWindow = null;

const createPrintWindow = async () => {
  printWindow = new BrowserWindow({
    width: 800,
    height: 600,
    show: false
  });
  printWindow.loadURL(`file://${__dirname}/indexPrinter.html`);
  ipcMain.on('print', (event, arg) => {
    printWindow.webContents.send('print', arg);
  });
 //printWindow.webContents.openDevTools();


};


function createWindow() {
  /**
   * Initial window options
   */

  loadingWindow = new BrowserWindow({
    width: 300,
    height: 300,
    minWidth: 300,
    minHeight: 300,
    center: true,
    frame: false,
    fullscreen: false,
    transparent: true,
    show: true
  });
  loadingWindow.loadURL(`file://${__dirname}/loading.html`);

  const {
    width,
    height
  } = screen.getPrimaryDisplay().workAreaSize
  mainWindow = new BrowserWindow({

    useContentSize: true,

    width: width - width * 0.2,
    height: height - height * 0.2,
    minWidth: 999,
    minHeight: 850,
    center: true,
    frame: false,
    show: false,
    titleBarStyle: 'customButtonsOnHover',
    /*        backgroundColor: '#FFD700',*/
    fullscreen: false,
    transparent: false,
    webPreferences: {
      webSecurity: false
    }
  })
  Menu.setApplicationMenu(null)

  mainWindow.loadURL(winURL)
  // mainWindow.webContents.openDevTools();
  // globalShortcut.register('CommandOrControl+I', () => {
  //   if (process.env.NODE_ENV == 'development') {
  //     // await installExtension(VUEJS_DEVTOOLS);
  //     if (loadingWindow) {
  //       loadingWindow.webContents.openDevTools();
  //     }
  //     //printWindow.webContents.openDevTools();
  //     if (mainWindow) {
  //       mainWindow.webContents.openDevTools();
  //     }
  //   }
  // });
  globalShortcut.register('CommandOrControl+Up', () => {
    mainWindow.setFullScreen(true);
  });
  globalShortcut.register('CommandOrControl+Down', () => {
    if (mainWindow.isFullScreen()) {
      mainWindow.setFullScreen(false);
    } else {
      mainWindow.minimize();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null
    printWindow.close();
  })

  ipcMain.once('main-loaded', (event, arg) => {
    console.log("loaded");
    mainWindow.show();
    // mainWindow.webContents.openDevTools();
    loadingWindow.close();
    loadingWindow = null;
  });

}

app.on('ready', () => {
  createWindow();
  createPrintWindow();

});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
    createPrintWindow();
  }
})

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */