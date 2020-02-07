import React, { useState, useContext } from 'react'
import BluetoothHelper from '../utils/bluetooth'
import { Play, X } from 'react-feather'
import { StateContext } from '../utils/context'

const { ipcRenderer } = window.require('electron')

interface IDevice {
  deviceName: string
  deviceId: string
}

const Scan: React.FC = () => {
  const [isScanning, setIsScanning] = useState(false)
  const { state, dispatch } = useContext(StateContext)
  
  const discoverDevices = () => {
    setIsScanning(true)
    ipcRenderer.send('start-scan')
    
    BluetoothHelper.startScanning((deviceId: string, deviceName: string) => {
      dispatch({
        type: 'SET_NEARBY_DEVICE',
        payload: {
          deviceId,
          deviceName,
        }
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
    ipcRenderer.send('connect-device', device)
    setIsScanning(false)
    BluetoothHelper.connect(device, () => {
      console.log('device disconnected')
      dispatch({
        type: 'SET_CONNECTED_DEVICE',
        payload: null,
      })
    }).then(() => {
      dispatch({
        type: 'SET_CONNECTED_DEVICE',
        payload: device,
      })
    }).catch(() => {
      dispatch({
        type: 'SET_CONNECTED_DEVICE',
        payload: null,
      })
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
            state.nearbyDevices.length > 0 && state.nearbyDevices.map((device: any) => (
              <tr key={device.deviceId}>
                <td>{device.deviceName}</td>
                <td>{device.deviceId}</td>
                <td>
                  <button
                    className="connect-btn"
                    type="button"
                    onClick={() => connectDevice(device.deviceId)}
                  >
                    {
                      state.connectedDevice === device.deviceId ? 'Disconnect' : 'Connect'
                    }
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
