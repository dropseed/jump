const electron = require('electron')
const electronIsDev = require('electron-is-dev')
const constants = require('./constants')
const utils = require('./utils')

const app = electron.app
const Tray = electron.Tray
const Menu = electron.Menu
const BrowserWindow = electron.BrowserWindow

const path = require('path')
const url = require('url')
const os = require('os')

const GitHubApi = require('github')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow
let tray

function createWindow () {
  const userSettings = utils.getUserSettings()
  if (!userSettings) {
    return
  }

  // Create the browser window.
  mainWindow = new BrowserWindow({
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
  })

  mainWindow.loadURL(
    electronIsDev
      ? 'http://localhost:3000' // Dev server ran by react-scripts
      : `file://${path.join(__dirname, '../build/index.html')}` // Bundled application
  )

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })

  const shortcut = userSettings.config.hasOwnProperty('globalShortcut') ? userSettings.config.globalShortcut : 'CommandOrControl+J'
  electron.globalShortcut.register(shortcut, () => {
    if (mainWindow) {
      mainWindow.show()
    } else {
      createWindow()
    }
  })

  return mainWindow
}

app.on('ready', () => {

  app.dock.hide()

  tray = new Tray(path.join(__dirname, '../public/menubarTemplate.png'))
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

  // TODO use this to send results to
  // const window = createWindow()

  const github = new GitHubApi({
    headers: {
      "user-agent": "jump" // GitHub is happy with a unique user agent
    },
  })

  github.authenticate({
    type: "token",
    token: utils.getUserSettings().config.github_access_token,
  })

  global.repos = []
  github.repos.getAll({per_page: 100}, getRepos)

  function getRepos(err, res) {
    if (err) {
      return false;
    }

    global.repos = global.repos.concat(res['data']);
    // remove everything we're not using for better performance
    global.repos = global.repos.map(r => {
      return {'full_name': r.full_name, 'html_url': r.html_url}
    })

    if (github.hasNextPage(res)) {
      github.getNextPage(res, getRepos)
    } else {
      // temporary to not load window until all results loaded
      // neeed to send results as they come?
      createWindow()
    }
  }

  // createWindow()
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
