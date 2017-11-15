
import {h} from 'preact'

module.exports = function(Component) {

  return class TopMenu extends Component {

    constructor(props) {
      super(props);

    }


	  render() {

      var loginLogout;
      
      if(app.state.global.user) {
        loginLogout = (
          <a class="button is-primary" href="/logout">
            <span>Logout</span>
          </a>
        );
      } else {
        loginLogout = (
          <a class="button is-primary" href="/login">
            <span>Login</span>
          </a>
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
              <a class="navbar-item " href="/search">
                Search
              </a>
              <a class="navbar-item " href="/inventory">
                Inventory
              </a>
            </div>

            <div class="navbar-end">
              <a class="navbar-item is-hidden-desktop-only" href="https://github.com/jgthms/bulma" target="_blank">
                <span class="icon" style="color: #333;">
                  <i class="fa fa-lg fa-github"></i>
                </span>
              </a>
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
