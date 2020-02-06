import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import BluetoothHelper from '../utils/bluetooth'
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

  return (
    <div>
      <h1>Scan view</h1>
      <Link to="/details">Details</Link>
      <button type="button" onClick={handleClick}>
        { isScanning ? 'Stop Scan' : 'Start Scan' }
      </button>
      <div>
        {
          devices.length > 0 ? devices.map((device: any) => {
            return <p key={device.deviceId}>{device.deviceId} | {device.deviceName}</p>
          }) : <p>Loading...</p>
        }
      </div>
    </div>
  )
}

export default Scan
