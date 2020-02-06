import React, { useState } from 'react'
import BluetoothHelper from '../utils/bluetooth'
import { Play, X } from 'react-feather'

const { ipcRenderer } = window.require('electron')

interface IDevice {
  deviceName: string
  deviceId: string
}

const Scan: React.FC = () => {
  const [devices, setDevices] = useState<IDevice[]>([])
  const [isScanning, setIsScanning] = useState(false)
  
  const discoverDevices = () => {
    setIsScanning(true)
    ipcRenderer.send('start-scan')
    
    BluetoothHelper.startScanning((deviceId: string, deviceName: string) => {
      setDevices(dvcs => {
        const existing = dvcs.findIndex(x => x.deviceId === deviceId)
        if (existing > -1) {
          dvcs[existing] = { deviceId, deviceName }
          return dvcs
        }
        return dvcs.concat({ deviceId, deviceName })
      })
    })
  }

  const handleClick = () => {
    if (isScanning) {
      ipcRenderer.send('stop-scan')
      setIsScanning(false)
    } else {
      discoverDevices()
    }
  }

  const connectDevice = (device: string) => {
    BluetoothHelper.connect(device, () => {
      console.log('disconnected')
    })
  }

  return (
    <div>
      <div className="app__header">
        <h3 className="app__header-title">Devices</h3>
        <div>
          <button className="btn" type="button" onClick={handleClick}>
            { isScanning ? (
              <>
                <X />
                Stop Scan
              </>
            ) : (
              <>
                <Play />
                Start Scan
              </>
            ) }
          </button>
        </div>
      </div>
      <table className="app__table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Address</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {
            devices.length > 0 && devices.map((device: any) => (
              <tr key={device.deviceId}>
                <td>{device.deviceName}</td>
                <td>{device.deviceId}</td>
                <td>
                  <button
                    className="connect-btn"
                    type="button"
                    onClick={() => connectDevice(device.deviceId)}
                  >
                    Connect
                  </button>
                </td>
              </tr>
            ))
          }
        </tbody>
      </table>
    </div>
  )
}

export default Scan
