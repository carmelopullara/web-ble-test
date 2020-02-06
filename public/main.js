const { app, BrowserWindow, ipcMain, ipcRenderer } = require('electron')

app.commandLine.appendSwitch('enable-experimental-web-platform-features')

let mainWindow
let webBluetoothCallback = null

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 900,
    height: 680,
    titleBarStyle: 'hiddenInset',
    webPreferences: {
      nodeIntegration: true,
    },
  })

  mainWindow.loadURL('http://localhost:3000')
  mainWindow.on('closed', () => (mainWindow = null))
  // mainWindow.webContents.openDevTools()
}

app.on('ready', createWindow)

const startScanning = (event, devices, callback) => {
  event.preventDefault()
  mainWindow.webContents.send('discoveredDevices', devices)
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
