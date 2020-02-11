import React, { useContext, useEffect, useState } from 'react'
import { Redirect, useHistory } from 'react-router-dom'
import { ArrowLeft, X } from 'react-feather'
import { StateContext } from '../utils/context'
import BluetoothHelper, {
  connectedDevice,
  batteryLevelCharacteristic,
  batteryLevelListener,
} from '../utils/bluetooth'

const Details: React.FC = () => {
  const history = useHistory()
  const { state } = useContext(StateContext)
  const [batteryLevel, setBatteryLevel] = useState<number | null>(null)

  useEffect(() => {
    if (connectedDevice?.gatt?.connected) {
      BluetoothHelper.read(state.connectedDevice, 'battery_service', 'battery_level')
        .then((value: Uint8Array) => {
          setBatteryLevel(value[0])
          BluetoothHelper.subscribe(state.connectedDevice, 'battery_service', 'battery_level', (data: Uint8Array) => {
            setBatteryLevel(data[0])
          })
        })
        .catch((e: Error) => console.log(e))
    }
    
    return () => {
      ;(async function() {
        if (connectedDevice?.gatt?.connected) {
          batteryLevelCharacteristic?.removeEventListener('characteristicvaluechanged', batteryLevelListener)
          batteryLevelCharacteristic?.stopNotifications()
        }
      })()
    }
  }, [state.connectedDevice])

  if (!connectedDevice) {
    return <Redirect to="/" />
  }

  const handleDisconnect = () => {
    BluetoothHelper.disconnect(state.connectedDevice).then(() => {
      history.push('/')
    })
  }

  return (
    <div className="app__content">
      <div className="app__header">
        <button className="btn btn--ghost" onClick={() => history.goBack()}>
          <ArrowLeft />
          Back
        </button>
        <h3 className="app__header-title">{connectedDevice.name}</h3>
        <button type="button" className="btn" onClick={handleDisconnect}>
          <X />
          Disconnect
        </button>
      </div>
      <div className="device-details">
        <fieldset className="device-details__wrapper">
          <div className="device-details__field">
            <span>Name:</span>
            <span>{connectedDevice.name}</span>
          </div>
          <div className="device-details__field">
            <span>Address:</span>
            <span>{state.connectedDevice}</span>
          </div>
          <div className="device-details__field">
            <span>Battery level:</span>
            <span>{batteryLevel ? `${batteryLevel}%` : 'Loading...'}</span>
          </div>
        </fieldset>
      </div>
    </div>
  )
}

export default Details
