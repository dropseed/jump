const electron = require('electron')
const path = require('path')
const os = require('os')

function getUserSettings() {
  try {
    return require(path.join(os.homedir(), '.jump.js'))
  } catch (e) {
    console.log(e)
    electron.dialog.showErrorBox('No config found', 'You need a ~/.jump.js config file.')
    return
  }
}

module.exports = {
  getUserSettings: getUserSettings
}
