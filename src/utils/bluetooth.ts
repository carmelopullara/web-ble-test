const { ipcRenderer } = window.require('electron')

export let connectedDevice: BluetoothDevice | null = null

type DeviceId = string

export interface IDevice {
  deviceId: DeviceId
  deviceName: string
}

interface WebBle {
  startScanning: (cb: (device: DeviceId, name: string) => void) => Promise<void>
  connect: (device: DeviceId, onDisconnect: () => void) => Promise<void>
  read: (
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

  disconnect: (device: DeviceId) => Promise<void>
}

const BluetoothHelper: WebBle = {
  startScanning: cb => {
    const ble = window.navigator
    ble.bluetooth.requestDevice({
        // filters: [{ services: ['battery_service'] }],
        acceptAllDevices: true,
      })
      .catch((error: Error) => {
        console.log(error)
      })

    ipcRenderer.on('discoveredDevices', (e: Event, data: IDevice[]) => {
      data.forEach(x => cb(x.deviceId, x.deviceName))
    })

    return Promise.resolve()
  },
  connect: (device, onDisconnect) =>
    new Promise(async (resolve, reject) => {
      try {
        const ble = window.navigator
        const device: BluetoothDevice = await ble.bluetooth.requestDevice({
          filters: [{ services: ['battery_service'] }],
        })

        device.addEventListener('gattserverdisconnected', () => {
          connectedDevice = null
          onDisconnect()
        })

        connectedDevice = device
        await device.gatt!.connect()
        resolve()
      } catch (error) {
        console.log(error)
        reject()
      }
    }),
  read: (device, serviceUuid, characteristicUuid) => new Promise(async (resolve, reject) => {
    try {
      if (connectedDevice) {
        const service = await connectedDevice.gatt!.getPrimaryService(serviceUuid)
        const characteristic = await service.getCharacteristic(characteristicUuid)
        const value = await characteristic.readValue()
        resolve(new Uint8Array(value.buffer))
      }
    } catch (error) {
      reject(error)
    }
  }),
  disconnect: (device) => new Promise(async (resolve) => {
    if (connectedDevice) {
      connectedDevice.gatt!.disconnect()
      resolve()
    }
  })
}

export default BluetoothHelper
