import { WebBle, IDevice } from './types'

const { ipcRenderer } = window.require('electron')

export let connectedDevice: BluetoothDevice | null = null
export let batteryLevelCharacteristic: BluetoothRemoteGATTCharacteristic | null = null
export let batteryLevelListener: (event: Event) => void | null

const BluetoothHelper: WebBle = {
  startScanning: cb => {
    const navigator = window.navigator
    navigator.bluetooth
      .requestDevice({
        filters: [{ services: ['battery_service'] }],
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
        const navigator = window.navigator
        const device: BluetoothDevice = await navigator.bluetooth.requestDevice(
          {
            filters: [{ services: ['battery_service'] }],
          }
        )

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
  read: (device, serviceUuid, characteristicUuid) =>
    new Promise(async (resolve, reject) => {
      try {
        if (connectedDevice) {
          const service = await connectedDevice.gatt!.getPrimaryService(
            serviceUuid
          )
          const characteristic = await service.getCharacteristic(
            characteristicUuid
          )
          const value = await characteristic.readValue()
          resolve(new Uint8Array(value.buffer))
        }
      } catch (error) {
        reject(error)
      }
    }),
  subscribe: async (device, serviceUuid, characteristicUuid, cb) => {
    try {
      if (connectedDevice) {
        const service = await connectedDevice.gatt!.getPrimaryService(
          serviceUuid
        )
        batteryLevelCharacteristic = await service.getCharacteristic(
          characteristicUuid
        )
        
        batteryLevelListener = event => {
          const target = event.target as BluetoothRemoteGATTCharacteristic
          const value = target.value
          if (value) {
            cb(new Uint8Array(value.buffer))
          }
        }

        batteryLevelCharacteristic.addEventListener('characteristicvaluechanged', batteryLevelListener)
        batteryLevelCharacteristic.startNotifications()
      }
    } catch (error) {
      console.log(error)
    }
  },
  disconnect: device =>
    new Promise(async resolve => {
      if (connectedDevice) {
        connectedDevice.gatt!.disconnect()
        resolve()
      }
    }),
}

export default BluetoothHelper
