import React, { useContext, useEffect, useState } from 'react'
import { Redirect, useHistory } from 'react-router-dom'
import { ArrowLeft, X } from 'react-feather'
import BluetoothHelper, { connectedDevice } from '../utils/bluetooth'
import { StateContext } from '../utils/context'

const Details: React.FC = () => {
  const history = useHistory()
  const { state } = useContext(StateContext)
  const [batteryLevel, setBatteryLevel] = useState<number | null>(null)

  useEffect(() => {
    if (state.connectedDevice) {
      BluetoothHelper.read(state.connectedDevice, 'battery_service', 'battery_level')
        .then(value => {
          setBatteryLevel(value[0])
        })
        .catch(e => console.log(e))
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
      <div className="app__foo">
        {batteryLevel && <h2>Battery level: {batteryLevel}%</h2>}
      </div>
    </div>
  )
}

export default Details
