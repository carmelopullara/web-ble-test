const { app, BrowserWindow, ipcMain } = require('electron')

app.commandLine.appendSwitch('enable-experimental-web-platform-features')

let mainWindow

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 900,
    height: 680,
    webPreferences: {
      nodeIntegration: true,
    },
  })

  mainWindow.loadURL('http://localhost:3000')
  mainWindow.on('closed', () => (mainWindow = null))
}

app.on('ready', createWindow)

ipcMain.on('start-scan', (event, arg) => {
  mainWindow.webContents.removeAllListeners('select-bluetooth-device')
  mainWindow.webContents.on('select-bluetooth-device', (event, devices, callback) => {
    event.preventDefault()
    mainWindow.webContents.send('discoveredDevices', devices)
  })
})

ipcMain.on('connect-device', (event, arg) => {
  mainWindow.webContents.removeAllListeners('select-bluetooth-device')
  mainWindow.webContents.on('select-bluetooth-device', (event, devices, callback) => {
    event.preventDefault();
    let result = devices.find((device) => {
      return device.deviceId === arg;
    })

    if (result) {
      callback(result.deviceId);
    }
  })
})

ipcMain.on('stop-scan', (event, arg) => {
  mainWindow.webContents.removeAllListeners('select-bluetooth-device')
  mainWindow.webContents.on('select-bluetooth-device', (event, devices, callback) => {
    callback('')
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})
