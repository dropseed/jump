import { app, screen, dialog, BrowserWindow, globalShortcut, Tray, Menu } from 'electron'
import installExtension, { REACT_DEVELOPER_TOOLS } from 'electron-devtools-installer'
import { enableLiveReload } from 'electron-compile'
import path from 'path'

import constants from './constants'
import { getUserSettings } from './utils'
import { loadUserRepos } from './github'

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow
let tray

const isDevMode = process.execPath.match(/[\\/]electron/)

if (isDevMode) enableLiveReload({strategy: 'react-hmr'})


function createWindow() {

  const userSettings = getUserSettings()
  if (!userSettings) {
    return
  }

  const currentDisplay = screen.getDisplayNearestPoint(screen.getCursorScreenPoint())

  // Create the browser window.
  mainWindow = new BrowserWindow({
    x: currentDisplay.bounds.x,
    y: currentDisplay.bounds.y,
    width: constants.DEFAULT_WINDOW_WIDTH,
    height: constants.DEFAULT_WINDOW_HEIGHT,
    frame: false,
    skipTaskbar: true,
    fullscreenable: false,
    // resizable: false,
    // show: false,
    title: 'Jump',
    // transparent: true,
    // webPreferences: {
    //   webSecurity: false
    // }
    webPreferences: {
      nodeIntegration: true
    }
  })

  mainWindow.center()
  // mainWindow.loadURL(`file://${__dirname}/index.html`)
  mainWindow.loadFile(`${__dirname}/index.html`)

  // Open the DevTools.
  if (isDevMode) {
    installExtension(REACT_DEVELOPER_TOOLS)
    // mainWindow.webContents.openDevTools()
  }

  // Emitted when the window is closed.
  mainWindow.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })

  const shortcut = userSettings.config.hasOwnProperty('globalShortcut') ? userSettings.config.globalShortcut : 'CommandOrControl+J'
  globalShortcut.register(shortcut, () => {
    if (mainWindow) {
      mainWindow.show()
    } else {
      createWindow()
    }
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.

function createTray() {
  tray = new Tray(path.join(__dirname, 'menubarTemplate.png'))
  const contextMenu = Menu.buildFromTemplate([
    {label: 'Open', type: 'normal', click: (menuItem, browserWindow, event) => {
      if (mainWindow) {
        mainWindow.show()
      } else {
        createWindow()
      }
    }},
    {type: 'separator'},
    {label: 'Quit', type: 'normal', click: (menuItem, browserWindow, event) => {
      app.quit()
    }}
  ])
  tray.setToolTip('jump')
  tray.setContextMenu(contextMenu)
}

app.whenReady().then(() => {
  app.dock.hide()
  createTray()
  loadUserRepos(createWindow)
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})
