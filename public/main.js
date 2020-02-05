const { app, BrowserWindow, ipcMain, ipcRenderer } = require('electron')

app.commandLine.appendSwitch('enable-web-bluetooth', true);

let mainWindow
let webBluetoothCallback = null

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
  // mainWindow.webContents.on('select-bluetooth-device', startScanning)
}

app.on('ready', createWindow)

const startScanning = (event, devices, callback) => {
  event.preventDefault()
  webBluetoothCallback = callback
  mainWindow.webContents.send('discovered-devices', devices)
}

ipcMain.on('start-scan', (event, arg) => {
  mainWindow.webContents.removeAllListeners('select-bluetooth-device')
  mainWindow.webContents.on('select-bluetooth-device', startScanning)
})

ipcMain.on('stop-scan', (event, arg) => {
  mainWindow.webContents.removeAllListeners('select-bluetooth-device')
  mainWindow.webContents.on('select-bluetooth-device', (event, devices, callback) => {
    callback('')
  })
})

ipcRenderer.on('discovered-devices', (event, data) => {
  if (webBluetoothCallback) {
    webBluetoothCallback(data)
  }
  console.log(data)

  webBluetoothCallback = null
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
