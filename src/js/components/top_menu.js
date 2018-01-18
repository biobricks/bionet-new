
import {h} from 'preact';
import {Link} from 'react-router-dom';

module.exports = function(Component) {

  return class TopMenu extends Component {

    constructor(props) {
      super(props);

    }


	  render() {

      var optionalNavItems = [];
      var loginLogout;

      if(app.state.global.user) {
        const userData = app.state.global.user.userData;
        loginLogout = (
          <Link class="button is-primary" to="/logout">
            <span>Logout</span>
          </Link>
        );

        optionalNavItems.push((
          <Link to='/settings' class="navbar-item">
            <span class="icon" style="color: #333;">
              <i class="fa fa-lg fa-cog" aria-hidden="true"></i>
            </span>
          </Link>
        ));

        // only show admin menu item if this is an admin user
        if(userData.groups && userData.groups.indexOf('admin')) {
          optionalNavItems.push((
            <Link to='/admin' class="navbar-item">
              <span class="icon" style="color: #333;">
                <i class="fa fa-lg fa-lock" aria-hidden="true"></i>
              </span>
            </Link>
          ))
        }
      } else {
        loginLogout = (
          <Link class="button is-primary" to="/login">
            <span>Login</span>
          </Link>
        );
      }
        
      
      return (
        <nav class="navbar is-transparent">
          <div class="navbar-brand">
            <a class="navbar-item">
              <img src="static/images/bionet_logo.png" alt="bionet.io"  height="48" />
            </a>

            <a class="navbar-item is-hidden-desktop" target="_blank">foo</a>

            <div class="navbar-burger burger" data-target="navMenuTransparentExample">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>

          <div id="navMenuTransparentExample" class="navbar-menu">
            <div class="navbar-start">
              <Link class="navbar-item " to="/search">
                Search
              </Link>
              <Link class="navbar-item " to="/inventory">
                Inventory
              </Link>
            </div>

            <div class="navbar-end">
              {optionalNavItems}
              <div class="navbar-item">
                {loginLogout}
              </div>
            </div>
          </div>
        </nav>
        

      )
    }
  }
}
