import {h} from 'preact';
import {Link} from 'react-router-dom';
import util from '../util.js';

module.exports = function(Component) {
    
  const ModalPrompt = require('./modal_prompt.js')(Component);

  return class TopMenu extends Component {

	  render() {

      var optionalLeftItems = [];
      var optionalNavItems = [];
      var loginLogout;

      if(app.state.global.user) {
        const userData = app.state.global.user.userData;
        loginLogout = (
          <Link class="button is-primary" to="/logout">
            <span>Logout</span>
          </Link>
        );

        optionalLeftItems.push((
          <Link class="navbar-item " to="/requests">
            Requests
          </Link>
        ));

        // if(util.user.isInGroup('admin')) {
        //   optionalNavItems.push((
        //     <Link to='/admin' class="navbar-item">
        //       <span class="icon">
        //         <i class="fa fa-lg fa-wrench" aria-hidden="true"></i>
        //     </span>
        //   </Link>
        //   ));
        // }

        // optionalNavItems.push((
        //   <Link to='/inventory/favorites' class="navbar-item">
        //     <span class="icon">
        //       <i class="fa fa-lg fa-star" aria-hidden="true"></i>
        //     </span>
        //   </Link>
        // ));

        // optionalNavItems.push((
        //   <Link to='/settings' class="navbar-item">
        //     <span class="icon">
        //       <i class="fa fa-lg fa-cog" aria-hidden="true"></i>
        //     </span>
        //   </Link>
        // ));

        // only show admin menu item if this is an admin user
        if(userData.groups && userData.groups.indexOf('admin')) {
          optionalNavItems.push((
            <Link to='/admin' class="navbar-item">
              <span class="icon">
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
        <nav class="Navbar navbar is-dark">
           <div className="navbar-brand">
              <Link class="navbar-item" to='/'>
                <img 
                  id="bionet-icon"
                  src="/static/images/bionet_logo.png" 
                  alt="bionet.io" 
                  height="48" 
                />
              </Link>
              <Link class="navbar-item" to="/">
                <img 
                  id="lab-icon" 
                  src="/static/images/lab_icon.png"
                  alt="Lab Icon" 
                />
                {app.settings.lab}
              </Link>

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
              <Link class="navbar-item " to="/scan">
                Scan
              </Link>
              {optionalLeftItems}
            </div>

            <div class="navbar-end">
              {optionalNavItems}
              <div class="navbar-item">
                {loginLogout}
              </div>
            </div>
          </div>
          <ModalPrompt state="prompt"/>           
        </nav>
      )
    }
  }
}
