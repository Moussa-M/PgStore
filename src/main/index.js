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

let zf;

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
    show: false,
    webPreferences: {
      webSecurity: false
    }
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
    show: false,
    webPreferences: {
      webSecurity: false
    }
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
    minWidth: 1600,
    minHeight: 850,
    center: true,
    frame: false,
    show: true,
    titleBarStyle: 'customButtonsOnHover',
    /*        backgroundColor: '#FFD700',*/
    fullscreen: false,
    transparent: false,
    webPreferences: {
      webSecurity: false,
      zoomFactor:1
    }
  })
  zf = 1;

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
  globalShortcut.register('F1', () => {
    mainWindow.webContents.send('KEYBOARD', "F1");
  });
  globalShortcut.register('F2', () => {
    mainWindow.webContents.send('KEYBOARD', "F2");
  });
  globalShortcut.register('F3', () => {
    mainWindow.webContents.send('KEYBOARD', "F3");
  });
  globalShortcut.register('F4', () => {
    mainWindow.webContents.send('KEYBOARD', "F4");
  });
  globalShortcut.register('F6', () => {
    mainWindow.webContents.send('KEYBOARD', "F6");
  });
  // globalShortcut.register('F5', () => {
  //   mainWindow.webContents.send('KEYBOARD', "F5");
  // });
  globalShortcut.register('Esc', () => {
    mainWindow.webContents.send('KEYBOARD', "Esc");
  });
  globalShortcut.register('Delete', () => {
    mainWindow.webContents.send('KEYBOARD', "del");
  });
  globalShortcut.register('CommandOrControl+Delete', () => {
    mainWindow.webContents.send('KEYBOARD', "cmd_del");
  });


  globalShortcut.register('CommandOrControl+N', () => {
    mainWindow.webContents.send('KEYBOARD', "add");
  });
  globalShortcut.register('CommandOrControl+E', () => {
    mainWindow.webContents.send('KEYBOARD', "edit");
  });

  // globalShortcut.register('CommandOrControl+F', () => {
  //   mainWindow.webContents.send('KEYBOARD', "search");
  // });

  globalShortcut.register('CommandOrControl+R', () => {
    mainWindow.webContents.send('KEYBOARD', "r");
  });

  // globalShortcut.register('CommandOrControl+S', () => {
  //   mainWindow.webContents.send('KEYBOARD', "s");
  // });


  // globalShortcut.register('Control+o', () => {
  //   if(zf<3){
  //     zf = zf + 0.1;
  //     mainWindow.webContents.setZoomFactor(zf);
  //     console.log(zf);
  //   }
  // });
  // globalShortcut.register('Control+p', () => {
  //   if(zf>-3){
  //     zf = zf - 0.1;
  //     mainWindow.webContents.setZoomFactor(zf);
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
     mainWindow.webContents.openDevTools();
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