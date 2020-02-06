import React from 'react'
import ReactDOM from 'react-dom'
import { HashRouter as Router, Route } from 'react-router-dom'
import Scan from './views/Scan'
import Details from './views/Details'
import 'normalize.css/normalize.css'
import './styles/style.scss'

const App = () => {
  return (
    <Router>
      <div className="app__wrapper">
        <div className="app__title-bar" />
        <main>
          <Route exact path="/" component={Scan} />
          <Route path="/details" component={Details} />
        </main>
      </div>
    </Router>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))
