import React from 'react'
import ReactDOM from 'react-dom'
import { HashRouter as Router, Route } from 'react-router-dom'
import Scan from './views/Scan'
import Details from './views/Details'

const App = () => {
  return (
    <Router>
      <div>
        <Route exact path="/" component={Scan} />
        <Route path="/details" component={Details} />
      </div>
    </Router>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))
