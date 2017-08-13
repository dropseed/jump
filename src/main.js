const electron = require('electron')
const electronIsDev = require('electron-is-dev')
const constants = require('./constants')

const app = electron.app
const BrowserWindow = electron.BrowserWindow

const path = require('path')
const url = require('url')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: constants.DEFAULT_WINDOW_WIDTH,
    height: constants.DEFAULT_WINDOW_HEIGHT,
    frame: false,
    skipTaskbar: true,
    fullscreenable: false,
    // show: false,
    title: 'Jump',
    // transparent: true
  })

  mainWindow.loadURL(
    electronIsDev
      ? 'http://localhost:3000' // Dev server ran by react-scripts
      : `file://${path.join(__dirname, '/build/index.html')}` // Bundled application
  )

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}

app.on('ready', () => {
  createWindow()

  electron.globalShortcut.register('CommandOrControl+J', () => {
    if (mainWindow === null) {
      createWindow()
    } else {
      mainWindow.show()
    }
  })
})

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})
