
import {h} from 'preact'
import {BrowserRouter as Router, Route, Link} from 'react-router-dom'

module.exports = function(Component) {

  var Global = require('./global.js')(Component)
  var TopMenu = require('./top_menu.js')(Component)
  
  var Login = require('./login.js')(Component)
  var Count = require('./count.js')(Component)

  return class App extends Component {

    constructor(props) {
      super(props);
      
    }

	  render() {
      
      return (
        <Router>
          <Global state="global">
            <TopMenu/>
            <div class="content-area">
              <Route exact path="/" render={() => (
                <Count state="bob.myclock" />
              )}/>
              <Route exact path="/login" render={() => (
                <Login />
              )}/>
            </div>
          </Global>
        </Router>
      )
    }
  }
}
