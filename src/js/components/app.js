
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
  var Help = require('./help.js')(Component);
  var Count = require('./count.js')(Component);
  var Inventory = require('./inventory/index.js')(Component);
  var Admin = require('./admin.js')(Component);
  var AdminEditUser = require('./admin_edit_user.js')(Component);
  var AdminCreateUser = require('./admin_create_user.js')(Component);
  var AdminDelUser = require('./admin_del_user.js')(Component);
  var Scan = require('./scan.js')(Component);
  var Print = require('./print.js')(Component);

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
                <Route path="/search/:query/:page?/:type?/:available?" component={Search} />
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
                <Route path="/admin/create-user" component={AdminCreateUser} />
                <Route path="/admin" component={Admin} />
              </Switch>

              <Route path="/scan" component={Scan} />
              <Route path="/print" component={Print} />

              <Route path="/help/:topic" component={Help} />
              
              <Switch>
                  <Route path="/inventory/:id" component={Inventory}/>
                  <Route path="/inventory" component={Inventory}/>
              </Switch>
              
            </div>
            <PersistentNotify state="pnotify" />
          </Global>
        </Router>
      );
    }
  };
};
