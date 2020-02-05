import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import BluetoothHelper from '../bluetooth'
const { ipcRenderer } = window.require('electron')

interface IDevice {
  deviceName: string
  deviceId: string
}

const Scan: React.FC = () => {
  const [devices, setDevices] = useState<IDevice[]>([])
  
  const discoverDevices = () => {
    ipcRenderer.send('start-scan')
    
    BluetoothHelper.startScanning((deviceId: string, deviceName: string) => {
      setDevices(dvcs => {
        if (dvcs.findIndex(x => x.deviceId === deviceId) > -1) {
          return dvcs
        }
        return dvcs.concat({ deviceId, deviceName })
      })
    })
  }

  console.log(devices)

  return (
    <div>
      <h1>Scan view</h1>
      <Link to="/details">Details</Link>
      <button type="button" onClick={discoverDevices}>Scan</button>
      <button type="button" onClick={() => ipcRenderer.send('stop-scan')}>Stop</button>
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
