
import {h} from 'preact';
import {Switch, BrowserRouter as Router, Route, Link} from 'react-router-dom';

module.exports = function(Component) {

  var Global = require('./global.js')(Component);
  var TopMenu = require('./top_menu.js')(Component);
  var PersistentNotify = require('./persistent_notify.js')(Component);

  var Signup = require('./signup.js')(Component);
  var Login = require('./login.js')(Component);
  var Search = require('./search.js')(Component);
  var Count = require('./count.js')(Component);

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
              <Route exact path="/signup" render={() => (
                <Signup />
              )}/>
          
              <Switch>
                <Route path="/search/:query/:page" component={Search} />
                <Route path="/search/:query" component={Search} />
                <Route path="/search" component={Search} />
              </Switch>

              <Route exact path="/login" render={() => (
                <Login />
              )}/>
            </div>
            <PersistentNotify state="pnotify" />
          </Global>
        </Router>
      );
    }
  };
};
