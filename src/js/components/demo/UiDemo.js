import { h } from 'preact';
import { Link } from 'react-router-dom';

module.exports = function(Component) {

  return class UiDemo extends Component {

    render() {
      return (
        <div class="UiDemo">
          <div class="columns is-desktop">

            <div class="column is-7-desktop">
              <div class="panel has-background-white">
                <div class="panel-heading">
                  <i class="mdi mdi-code-tags"></i> UI Demo
                </div>
                <Link 
                  to="/ui/login"
                  class="panel-block"
                >
                  <span class="panel-icon">
                    <i class="mdi mdi-login-variant"></i>
                  </span>
                  Login
                </Link>
                <Link 
                  to="/ui/signup"
                  class="panel-block"
                >
                  <span class="panel-icon">
                    <i class="mdi mdi-clipboard-account"></i>
                  </span>
                  Signup
                </Link>
                <Link 
                  to="/ui/account-confirmed"
                  class="panel-block"
                >
                  <span class="panel-icon">
                    <i class="mdi mdi-account-check"></i>
                  </span>
                  Account Confirmed
                </Link>
                <Link 
                  to="/ui/password-reset"
                  class="panel-block"
                >
                  <span class="panel-icon">
                    <i class="mdi mdi-lock-reset"></i>
                  </span>
                  Password Reset
                </Link>
                <Link 
                  to="/ui/manage-users"
                  class="panel-block"
                >
                  <span class="panel-icon">
                    <i class="mdi mdi-account-multiple"></i>
                  </span>
                  Manage Users - List, Create, Edit, Delete
                </Link>
                <Link 
                  to="/ui/favorites"
                  class="panel-block"
                >
                  <span class="panel-icon">
                    <i class="mdi mdi-star"></i>
                  </span>
                  Favorites
                </Link>
                <Link 
                  to="/ui/workbench"
                  class="panel-block"
                >
                  <span class="panel-icon">
                    <i class="mdi mdi-stove"></i>
                  </span>
                  Work Bench
                </Link>
                <Link 
                  to="/ui/requests"
                  class="panel-block"
                >
                  <span class="panel-icon">
                    <i class="mdi mdi-update"></i>
                  </span>
                  Pending Requests
                </Link>
                <Link 
                  to="/ui/server-status"
                  class="panel-block"
                >
                  <span class="panel-icon">
                    <i class="mdi mdi-server-network"></i>
                  </span>
                  Server Status
                </Link>
              </div>
            </div>
          
            <div class="column is-5-desktop">
              <div class="panel has-background-white">
                <div class="panel-heading">
                  <i class="mdi mdi-grid"></i>&nbsp;&nbsp;Grid Container
                </div>
                <Link 
                  to="/ui/containers/new"
                  class="panel-block"
                >
                  <span class="panel-icon">
                    <i class="mdi mdi-grid"></i>
                  </span>
                  New Container
                </Link>                
              </div>  
            </div>
          </div>  
        </div>
      );
    }
  }

}