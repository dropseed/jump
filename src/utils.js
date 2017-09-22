import electron from 'electron'
import path from 'path'
import os from 'os'
import fs from 'fs'

export const getUserSettings = () => {
  const configFilePath = path.join(os.homedir(), '.jump.json')

  if (!fs.existsSync(configFilePath)) {
    electron.dialog.showErrorBox('No config found', 'You need a ~/.jump.json config file.')
    return null
  }

  try {
    return JSON.parse(fs.readFileSync(configFilePath))
  } catch (e) {
    console.log(e)
    electron.dialog.showErrorBox('Invalid config', '~/.jump.json was not JSON parseable.')
    return null
  }
}
