import React, { useState, useContext } from 'react'
import { useHistory } from 'react-router-dom'
import cx from 'classnames'
import BluetoothHelper from '../utils/bluetooth'
import { Play, X, Loader } from 'react-feather'
import { StateContext } from '../utils/context'
import { IDevice } from '../utils/types'

const { ipcRenderer } = window.require('electron')

const Scan: React.FC = () => {
  const [isScanning, setIsScanning] = useState<boolean>(false)
  const [deviceToConnect, setDeviceToConnect] = useState<string | null>(null)
  const { state, dispatch } = useContext(StateContext)
  const history = useHistory()

  const discoverDevices = () => {
    setIsScanning(true)
    ipcRenderer.send('start-scan')

    BluetoothHelper.startScanning((deviceId: string, deviceName: string) => {
      dispatch({
        type: 'SET_NEARBY_DEVICE',
        payload: {
          deviceId,
          deviceName,
        },
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
    setDeviceToConnect(device)
    BluetoothHelper.connect(device, () => {
      dispatch({
        type: 'SET_CONNECTED_DEVICE',
        payload: '',
      })
    })
      .then(() => {
        dispatch({
          type: 'SET_CONNECTED_DEVICE',
          payload: device,
        })
        setDeviceToConnect(null)
      })
      .catch(() => {
        dispatch({
          type: 'SET_CONNECTED_DEVICE',
          payload: '',
        })
        setDeviceToConnect(null)
      })
  }

  return (
    <div className="app__content">
      <div className="app__header">
        <h3 className="app__header-title">Devices</h3>
        <div className="app__header-actions">
          {
            isScanning && (
              <div className="app__header-loader">
                <Loader />
              </div>
            )
          }
          <button
            className={cx('btn', {
              'btn--stop': isScanning,
            })}
            type="button"
            onClick={handleClick}
          >
            {isScanning ? (
              <>
                <X />
                Stop Scan
              </>
            ) : (
              <>
                <Play />
                Start Scan
              </>
            )}
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
          {state.nearbyDevices.length > 0 &&
            state.nearbyDevices.map((device: IDevice) => (
              <tr key={device.deviceId}>
                <td>{device.deviceName}</td>
                <td>{device.deviceId}</td>
                <td>
                  <button
                    className={cx('connect-btn', {
                      'connect-btn--active': state.connectedDevice === device.deviceId,
                    })}
                    type="button"
                    onClick={() => {
                      if (state.connectedDevice === device.deviceId) {
                        history.push('/details')
                      } else {
                        connectDevice(device.deviceId)
                      }
                    }}
                  >
                    {deviceToConnect === device.deviceId
                      ? 'Connecting...'
                      : state.connectedDevice === device.deviceId
                      ? 'Inspect'
                      : 'Connect'}
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  )
}

export default Scan
