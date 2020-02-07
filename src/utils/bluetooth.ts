const { ipcRenderer } = window.require('electron')

export let connectedDevice = null

type DeviceId = string

export type device = {
  deviceId: DeviceId
  deviceName: string
}

interface WebBle {
  startScanning: (cb: (device: DeviceId, name: string) => void) => Promise<void>
  connect: (device: DeviceId, onDisconnect: () => void) => Promise<void>
  read?: (
    device: DeviceId,
    serviceUuid: string,
    characteristicUuid: string
  ) => Promise<Uint8Array>
  subscribe?: (
    device: DeviceId,
    serviceUuid: string,
    characteristicUuid: string,
    cb: (data: Uint8Array) => void
  ) => Promise<void>

  disconnect?: (device: DeviceId) => Promise<void>
}

const BluetoothHelper: WebBle = {
  startScanning: (cb) => {
    (window.navigator as any).bluetooth.requestDevice({
      // filters: [{ services: ['battery_service'] }],
      acceptAllDevices: true
    })
    .catch((error: Error) => {
      console.log(error)
    })

    ipcRenderer.on('discoveredDevices', (e: Event, data: device[]) => {
      data.forEach(x => cb(x.deviceId, x.deviceName))
    })

    return Promise.resolve()
  },
  connect: (device, onDisconnect) => new Promise((resolve, reject) => {
    (window.navigator as any).bluetooth.requestDevice({
      filters: [{ services: ['battery_service'] }]
    })
    .then((device: any) => {
      device.addEventListener('gattserverdisconnected', () => {
        connectedDevice = null
        onDisconnect()
      })
      connectedDevice = device
      device.gatt.connect()
      resolve()
    })
    .catch((error: Error) => {
      reject()
    })
  })
}

export default BluetoothHelper
