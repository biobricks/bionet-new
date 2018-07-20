import { h } from 'preact';
import {Switch, BrowserRouter as Router, Route, Link} from 'react-router-dom';


module.exports = function(Component) {

  var StateWrapper = require('./state_wrapper.js')(Component);
  var TopMenu = require('./top_menu.js')(Component);
  var PersistentNotify = require('./persistent_notify.js')(Component);

  var Signup = require('./signup.js')(Component);
  var Login = require('./login.js')(Component);
  var Logout = require('./logout.js')(Component);
  var PasswordReset = require('./password_reset.js')(Component);
  var PasswordCompleteReset = require('./password_complete_reset.js')(Component);
  var Search = require('./search.js')(Component);
  var Help = require('./help.js')(Component);
  var Count = require('./count.js')(Component);
  var Virtual = require('./virtual.js')(Component);
  var EditVirtual = require('./edit_virtual.js')(Component);
  var RequestMaterial = require('./request_material.js')(Component);
  var RequestList = require('./request_list.js')(Component);
  var Request = require('./request.js')(Component);
  var RequestSent = require('./request_sent.js')(Component);
  var Inventory = require('./inventory/index.js')(Component);
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
  
  const LabPanel = require('./lab_panel.js')(Component);
  const LabInventory = require('./lab_inventory.js')(Component);

  // UI/UX Demo Components
  const LabPanelDemo     = require('./demo/LabPanel.js')(Component);
  const LabInventoryDemo = require('./demo/LabInventory.js')(Component);
  const InventoryDemo    = require('./demo/Inventory.js')(Component);
  const LoginPanelDemo   = require('./demo/LoginPanel.js')(Component);
  const SignupPanelDemo  = require('./demo/SignupPanel.js')(Component);
  const ResetPanelDemo   = require('./demo/ResetPanel.js')(Component);
  const FavoritesDemo    = require('./demo/Favorites.js')(Component);
  const RequestsDemo    = require('./demo/Requests.js')(Component);
  const TestComponent    = require('./demo/test.js')(Component);

  // just an example of dynamically loading js
  var DynamicLoading = require('./dynamic_loading.js')(Component);

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
                
                
                <Route path="/ui/test/:itemId" component={TestComponent} />
                <Route path="/ui/lab-inventory/:itemId" component={LabInventoryDemo} />
                <Route path="/ui/inventory/:id" component={InventoryDemo} />
                <Route exact path="/ui/favorites" component={FavoritesDemo} />
                <Route exact path="/ui/requests" component={RequestsDemo} />
                <Route exact path="/ui/lab" component={LabPanelDemo} />
                <Route exact path="/ui/login" component={LoginPanelDemo} />
                <Route exact path="/ui/signup" component={SignupPanelDemo} />
                <Route exact path="/ui/password-reset" component={ResetPanelDemo} />


                <Route exact path="/signup" render={() => (
                  <Signup />
                )}/>

                <Route path="/virtual/show/:id" component={Virtual} />
                <Route path="/virtual/edit/:id" component={EditVirtual} />

                <Switch>
                  <Route path="/request/:id" component={RequestMaterial} />
                  <Route path="/request-show/:id" component={Request} />
                  <Route path="/requests" component={RequestList} />
                  <Route path="/request-sent/:id" component={RequestSent} />
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

                <Route path="/help/:topic" component={Help} />

                <Switch>
                  <Route path="/dynamic-loading/:foo" component={DynamicLoading} />
                  <Route path="/dynamic-loading" component={DynamicLoading} />
                </Switch>
                
                <Switch>
                    <Route path="/inventory/new/:virtual_id" key="without-id" component={Inventory}/>
                    <Route path="/inventory/:id" key="with-id" component={Inventory}/>
                    <Route path="/inventory" key="without-id" component={Inventory}/>
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
