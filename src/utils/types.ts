import { Dispatch } from 'react'

type DeviceId = string

export interface IDevice {
  deviceId: DeviceId
  deviceName: string
}

export interface State {
  nearbyDevices: IDevice[]
  connectedDevice: string
}

export interface Action {
  type: string
  payload: any
}

export interface StateContextInterface {
  state: State
  dispatch: Dispatch<Action>
}

export interface WebBle {
  startScanning: (cb: (device: DeviceId, name: string) => void) => Promise<void>
  connect: (device: DeviceId, onDisconnect: () => void) => Promise<void>
  read: (
    device: DeviceId,
    serviceUuid: string,
    characteristicUuid: string
  ) => Promise<Uint8Array>
  subscribe: (
    device: DeviceId,
    serviceUuid: string,
    characteristicUuid: string,
    cb: (data: Uint8Array) => void
  ) => Promise<void>
  disconnect: (device: DeviceId) => Promise<void>
}
