const { ipcRenderer } = window.require('electron')

type DeviceId = string;

type device = {
  deviceId: DeviceId
  deviceName: string
}

interface WebBle {
  startScanning: (cb: (device: DeviceId, name: string) => void) => Promise<void>;
  connect?: (device: DeviceId, onDisconnect: () => void) => Promise<void>;
  read?: (
    device: DeviceId,
    serviceUuid: string,
    characteristicUuid: string
  ) => Promise<Uint8Array>;
  subscribe?: (
    device: DeviceId,
    serviceUuid: string,
    characteristicUuid: string,
    cb: (data: Uint8Array) => void
  ) => Promise<void>;

  disconnect?: (device: DeviceId) => Promise<void>;
}

const BluetoothHelper: WebBle = {
  startScanning: (cb) => new Promise(async (resolve, reject) => {
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
  })
}

export default BluetoothHelper
