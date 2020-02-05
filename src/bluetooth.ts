const { ipcRenderer } = window.require('electron')

type DeviceId = string;

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
  startScanning: (cb) => new Promise((resolve, reject) => {
    ipcRenderer.send('start-scan');
    
    (window.navigator as any).bluetooth.requestDevice({
      // filters: [{ services: ['battery_service'] }],
      acceptAllDevices: true
    })
    .then((device: any) => {
      console.log(device)
    })
    .catch((error: Error) => {})
  })
}

export default BluetoothHelper
