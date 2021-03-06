import { h } from 'preact';
import {Switch, BrowserRouter as Router, Route, Link} from 'react-router-dom';


module.exports = function(Component) {

  var StateWrapper = require('./state_wrapper.js')(Component);
  var TopMenu = require('./top_menu.js')(Component);
  var PersistentNotify = require('./persistent_notify.js')(Component);

  var Signup = require('./Signup.js')(Component);
  var Login = require('./Login.js')(Component);
  var Logout = require('./Logout.js')(Component);
  var PasswordReset = require('./PasswordReset.js')(Component);
  var PasswordCompleteReset = require('./PasswordCompleteReset.js')(Component);
  var Search = require('./Search.js')(Component);
  var Help = require('./help.js')(Component);
  var RequestMaterial = require('./request_material.js')(Component);
  var RequestList = require('./request_list.js')(Component);
  var Request = require('./request.js')(Component);
  var RequestApprove = require('./request_approve.js')(Component);
  var RequestSent = require('./request_sent.js')(Component);
  var Settings = require('./settings.js')(Component);
  var Admin = require('./admin.js')(Component);
  var AdminEditUser = require('./admin_edit_user.js')(Component);
  var AdminCreateUser = require('./admin_create_user.js')(Component);
  var AdminDelUser = require('./admin_del_user.js')(Component);
  var Scan = require('./scan.js')(Component);
  var Print = require('./print.js')(Component);
  var Footer = require('./footer.js')(Component);
  var Attributions = require('./attributions.js')(Component);
  var BarcodeRedirect = require('./barcode_redirect.js')(Component);
  var PrintShippingLabel = require('./print_shipping_label.js')(Component);


  // Top Level Page Components Controlling Layout
  const InventoryPage = require('./pages/Inventory.js')(Component);

  // Test Component for HTML5 Canvas
  const CanvasPage = require('./pages/Canvas.js')(Component);

  // Help Page
  const HelpPage = require('./pages/Help.js')(Component);

  // just an example of dynamically loading js
  var DynamicLoading = require('./dynamic_loading.js')(Component);

  // example node graph
  var NodeGraph = require('./NodeGraph')(Component);

  return class App extends Component {

    constructor(props) {
      super(props);
      
    }

	  render() {

      return (
        <div class="App">
          <Router>
            <StateWrapper state="global">
              <TopMenu/>
              <div class="content-area">
                <Route exact path="/" component={Search} />
                <Route exact path="/node-graph" component={NodeGraph} />
                <Route exact path="/help" component={HelpPage} />
            
                <Route path="/inventory/:id" component={InventoryPage} />
                <Route exact path="/inventory" component={InventoryPage} />

                <Route exact path="/canvas" component={CanvasPage} />

                <Route exact path="/signup" render={() => (
                  <Signup />
                )}/>

                <Switch>
                  <Route path="/request/:id" component={RequestMaterial} />
                  <Route path="/request-show/:id" component={Request} />
                  <Route path="/requests" component={RequestList} />
                  <Route path="/request-sent/:id" component={RequestSent} />
                  <Route path="/request-approve/:id" component={RequestApprove} />
                </Switch>

                <Switch>
                  <Route path="/search/:query/:page?/:scope?/:type?/:available?" component={Search} />
                  <Route path="/search" component={Search} />
                </Switch>

                <Route exact path="/login" render={() => (
                  <Login />
                )}/>
                <Route exact path="/logout" render={() => (
                  <Logout />
                )}/>

                <Route path="/password-reset" component={PasswordReset} />
                <Route path="/password-complete-reset/:code" component={PasswordCompleteReset} />

                <Route path="/settings" component={Settings} />

                <Switch>
                  <Route path="/admin/edit-user/:username" component={AdminEditUser} />
                  <Route path="/admin/delete-user/:username" component={AdminDelUser} />
                  <Route path="/admin/create-user" component={AdminCreateUser} />
                  <Route path="/admin" component={Admin} />
                </Switch>

                <Route path="/scan" component={Scan} />
                <Route path="/print" component={Print} />

                <Route path="/print-shipping-label" component={PrintShippingLabel} />

                <Route path="/help/:topic" component={Help} />

                <Switch>
                  <Route path="/dynamic-loading/:foo" component={DynamicLoading} />
                  <Route path="/dynamic-loading" component={DynamicLoading} />
                </Switch>

                <Route path="/o/:humanID" component={BarcodeRedirect}/>

                <Route path="/attributions" component={Attributions} />              
              </div>
              <PersistentNotify state="pnotify" />
              <Footer />
            </StateWrapper>
          </Router>
        </div>
      );
    }
  };
};
