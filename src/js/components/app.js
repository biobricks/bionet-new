
import {h} from 'preact';
import {Switch, BrowserRouter as Router, Route, Link} from 'react-router-dom';

module.exports = function(Component) {

  var Global = require('./global.js')(Component);
  var TopMenu = require('./top_menu.js')(Component);
  var PersistentNotify = require('./persistent_notify.js')(Component);

  var Signup = require('./signup.js')(Component);
  var Login = require('./login.js')(Component);
  var Logout = require('./logout.js')(Component);
  var Search = require('./search.js')(Component);
  var Count = require('./count.js')(Component);
  var Inventory = require('./inventory/index.js')(Component);
  var Admin = require('./admin.js')(Component);
  var AdminEditUser = require('./admin_edit_user.js')(Component);
  var AdminDelUser = require('./admin_del_user.js')(Component);

  return class App extends Component {

    constructor(props) {
      super(props);
      
    }

	  render() {
      console.log("GLOB", JSON.stringify(app.state, null, 2));

/*
      if(!app.actions.connection.isConnected()) {
        return (
          <Router>
            <Global state="global">
              <PersistentNotify state="pnotify" />
            </Global>
          </Router>
        )
      }
*/
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
              <Route exact path="/logout" render={() => (
                <Logout />
              )}/>

              <Switch>
                <Route path="/admin/edit-user/:username" component={AdminEditUser} />
                <Route path="/admin/delete-user/:username" component={AdminDelUser} />
                <Route path="/admin" component={Admin} />
              </Switch>

              <Route exact path="/inventory" render={() => (
                <Inventory state="inventory"/>
              )}/>
            </div>
            <PersistentNotify state="pnotify" />
          </Global>
        </Router>
      );
    }
  };
};
