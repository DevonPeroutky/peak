import {app, BrowserWindow, shell, globalShortcut, ipcMain, session} from 'electron';
import * as isDev from 'electron-is-dev';
import * as path from 'path';
import config from "../src/constants/environment-vars"

const { autoUpdater } = require('electron-updater');
const { Deeplink } = require('electron-deeplink');
const protocol = config.electron_protocol;

// on macOS: ~/Library/Logs/{app name}/{process type}.log
const log = require('electron-log');

console.log(`Configuration :`, config)
console.log(`Dist ${process.env.REACT_APP_DIST}`)

let mainWindow: BrowserWindow | null = null;

// Instantiate Deep Link listener
const deeplink = new Deeplink({ app, mainWindow, protocol, isDev });

const createWindow = (): void => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    height: 860,
    // width: 1320,
    width: 1600,
    title: "Peak",
    minWidth: 1000,
    frame: false,
    titleBarStyle: 'hiddenInset',
    webPreferences: {
      devTools: true, // devTools: isDev,
      webSecurity: false,
      nodeIntegration: true
    }
  });

  if (isDev) {
    mainWindow.loadURL('http://localhost:3000/index.html');
    mainWindow.webContents.openDevTools({'mode': 'detach'});
  } else {
    const url = `file://${__dirname}/../index.html`
    console.log(`THE URL `, url)
    // 'build/index.html'
    mainWindow.loadURL(url);
  }

  mainWindow.on('closed', () => mainWindow = null);

  // Hot Reloading
  if (isDev) {
    // 'node_modules/.bin/electronPath'
    require('electron-reload')(__dirname, {
      electron: path.join(__dirname, '..', '..', 'node_modules', '.bin', 'electron'),
      forceHardReset: true,
      hardResetMethod: 'exit'
    });
  }

  // All new-window events should load in the user's default browser
  // new-window events are when a user clicks on <a> link with target="_blank"
  mainWindow.webContents.on("new-window", function(event, url) {
    event.preventDefault();
    shell.openExternal(url);
  });

  mainWindow.webContents.send('fullscreen', false)


  // If Full-screen, tell renderer (aka. the App that we are fullscreen)
  mainWindow.on("enter-full-screen", () => {
    console.log(`Entering full screen`)
    mainWindow && mainWindow.webContents.send('fullscreen', true)
  })

  // If not Full-screen, tell renderer (aka. the App that we are fullscreen)
  mainWindow.on("leave-full-screen", () => {
    console.log(`Leaving full screen`)
    mainWindow && mainWindow.webContents.send('fullscreen', false)
  })

  mainWindow.webContents.on("did-finish-load", () => {
    log.info("Checking for updates")
      // @ts-ignore
      autoUpdater.checkForUpdatesAndNotify().then((res) => {
        log.info(`Update response `)
        log.info(res)
        // @ts-ignore
      }).catch((err) => {
        log.error(`Checking for updates failed`)
        log.error(err.toString())
      });
  })

  mainWindow.on('unresponsive', function() {
      log.error(`Window is unresponsive???`)
  });

  mainWindow.webContents.on('unresponsive', function() {
    log.error(`Window's Webcontents is unresponsive???`)
  });
};

// --------------------------------------------------------
// Electron Listeners
// --------------------------------------------------------
// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
// app.on('ready', createWindow);
app.whenReady().then(() => {
  const filter = {
    urls: ['*://peak-backend.onrender.com/*', 'http://localhost:4000/*']
  }

  session.defaultSession.webRequest.onBeforeSendHeaders(filter, (details, callback) => {
    console.log(details);
    details.requestHeaders['User-Agent'] = 'MyAgent';
    details.requestHeaders['Origin'] = 'file://peak-electron-app';
    details.requestHeaders['Access-Control-Allow-Origin'] = 'file://peak-electron-app';
    callback({cancel: false, requestHeaders: details.requestHeaders});
  });

  const openNote = globalShortcut.register('CommandOrControl+Shift+Enter', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }

    mainWindow && mainWindow.webContents.send('open-note')
    // mainWindow && mainWindow.focus()
    // mainWindow && mainWindow.webContents.focus()
    mainWindow && mainWindow.show()
  })

  const navigateToJournal = globalShortcut.register('CommandOrControl+Shift+J', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }

    mainWindow && mainWindow.webContents.send('go-to-scratchpad')
    // mainWindow && mainWindow.focus()
    // mainWindow && mainWindow.webContents.focus()
    mainWindow && mainWindow.show()
  })

  if (!navigateToJournal) {
    console.log('Registration failed')
  }

  // Check whether a shortcut is registered.
  console.log(globalShortcut.isRegistered('CommandOrControl+Shift+J'))
}).then(createWindow)

app.on('will-quit', () => {
  // Unregister a shortcut.
  globalShortcut.unregister('CommandOrControl+Shift+J')

  // Unregister all shortcuts.
  globalShortcut.unregisterAll()
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
// Handle Deep Links
deeplink.on('received', (link: string) => {
  const [base_url, returned_code] = link.split("returned-code=")
  console.log(`RECEIVED`)
  console.log(base_url)

  const channel = (link.includes("returned-code")) ? 'login-user' : 'add-user'

  mainWindow = BrowserWindow.getAllWindows()[0]

  // TODO: Verify returned_code
  mainWindow && mainWindow.webContents.send(channel, returned_code)
});

// REPLACE SLEEP WITH MESSAGE HANDLER
ipcMain.on('uncaughtException', function(event, data){
  log.error("Uncaught Exception in the renderer process ", data)
  if (mainWindow) {
    log.error("Reloading the renderer window.")

    mainWindow.webContents.send('recover', false)
    new Promise(resolve =>
        setTimeout(resolve, 200))
        .then(_ => mainWindow && mainWindow.reload()
    );
  } else {
    log.error("Trying to reload the renderer window but there's no BrowserWindow?!?!?!?")
  }
});
