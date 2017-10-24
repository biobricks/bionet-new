
import {h} from 'preact'

module.exports = function(Component) {

  return class TopMenu extends Component {

    constructor(props) {
      super(props);

    }


	  render() {
      
      return (
        <nav class="navbar is-transparent">
          <div class="navbar-brand">
            <a class="navbar-item" href="https://bulma.io">
              <img src="https://bulma.io/images/bulma-logo.png" alt="Bulma: a modern CSS framework based on Flexbox" width="112" height="28" />
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
              <a class="navbar-item is-hidden-desktop-only" href="https://twitter.com/jgthms" target="_blank">
                <span class="icon" style="color: #55acee;">
                  <i class="fa fa-lg fa-twitter"></i>
                </span>
              </a>
              <div class="navbar-item">
                <a class="button is-primary" href="/login">
                  <span>Login</span>
                </a>
              </div>
            </div>
          </div>
        </nav>
        

      )
    }
  }
}
