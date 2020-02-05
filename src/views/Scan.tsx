import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import BluetoothHelper from '../bluetooth'
const { ipcRenderer } = window.require('electron')

const Scan: React.FC = () => {
  const [devices, setDevices] = useState([]) as any

  const handleClick = () => {
    BluetoothHelper.startScanning((device, name) => {
      console.log(device, name)
    })
  }

  return (
    <div>
      <h1>Scan view</h1>
      <Link to="/details">Details</Link>
      <button type="button" onClick={handleClick}>Scan</button>
      <button type="button" onClick={() => ipcRenderer.send('stop-scan')}>Stop</button>
      <div>
        {
          devices.length > 0 ? devices.map((device: any) => {
            return <p key={device.deviceId}>{device.deviceName} | {device.deviceId}</p>
          }) : <p>Loading...</p>
        }
      </div>
    </div>
  )
}

export default Scan
