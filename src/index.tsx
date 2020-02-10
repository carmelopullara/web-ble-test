import React, { useReducer } from 'react'
import ReactDOM from 'react-dom'
import { HashRouter as Router, Route } from 'react-router-dom'
import { StateContext } from './utils/context'
import { IDevice } from './utils/bluetooth'
import Scan from './views/Scan'
import Details from './views/Details'
import 'normalize.css/normalize.css'
import './styles/style.scss'

interface State {
  nearbyDevices: IDevice[]
  connectedDevice: BluetoothDevice | null
}

interface Action {
  type: string
  payload?: any
}

const App = () => {
  const initialState: State = {
    nearbyDevices: [],
    connectedDevice: null,
  }

  const reducer = (state: State, action: Action) => {
    switch (action.type) {
      case 'SET_NEARBY_DEVICE':
        const existing = state.nearbyDevices.findIndex(
          x => x.deviceId === action.payload.deviceId
        )
        if (existing > -1) {
          state.nearbyDevices[existing] = {
            deviceId: action.payload.deviceId,
            deviceName: action.payload.deviceName,
          }
          return {
            ...state,
          }
        }
        return {
          ...state,
          nearbyDevices: [...state.nearbyDevices, action.payload],
        }
      case 'SET_CONNECTED_DEVICE':
        return {
          ...state,
          connectedDevice: action.payload,
        }
      default:
        return state
    }
  }

  const [state, dispatch] = useReducer(reducer, initialState)

  return (
    <StateContext.Provider value={{ state, dispatch }}>
      <Router>
        <div className="app__wrapper">
          <Route exact path="/" component={Scan} />
          <Route path="/details" component={Details} />
        </div>
      </Router>
    </StateContext.Provider>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))
