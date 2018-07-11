import { h } from 'preact';
import { Redirect, Link } from 'react-router-dom';

module.exports = function(Component) {

  return class LoginPanel extends Component {

    constructor(props) {
      super(props);
      this.state = {
        redirect: false,
        username: '',
        password: ''
      };
    }

    render() {
      if(this.state.redirect){ return( <Redirect to="/" /> ) }
      return (
        <div class="LoginPanel">
          <div class="columns is-centered">
            
            <div class="column is-12-mobile is-8-tablet is-6-desktop">
              <div class="panel">
                <div class="panel-heading has-text-centered">
                  <h3>Login</h3>
                </div>
                <div class="panel-block">
                  <div class="has-text-centered" style={{'margin': '0 auto'}}>
                    Don't have a login? &nbsp;
                    <Link to="/ui/signup">Sign Up</Link>
                  </div>
                </div>
                <div class="panel-block p-2">
                  <form style={{'margin': '0 auto'}}>
                    <div class="field is-horizontal">
                      <div class="field-label is-normal">
                        <label class="label">Username</label>
                      </div>
                      <div class="field-body">
                        <div class="field">
                          <div class="control is-expanded has-icons-left">
                            <input 
                              class="input"
                              type="text" 
                              value={this.state.username}
                              placeholder="username or email"
                            />
                            <span class="icon is-small is-left">
                              <i class="mdi mdi-account"></i>
                            </span>                            
                          </div>
                        </div>  
                      </div>
                    </div>
                    <div class="field is-horizontal">
                      <div class="field-label is-normal">
                        <label class="label">Password</label>
                      </div>
                      <div class="field-body">
                        <div class="field">
                          <div class="control is-expanded has-icons-left">
                            <input 
                              class="input"
                              type="password" 
                              value={this.state.password}
                              placeholder="password"
                            />
                            <span class="icon is-small is-left">
                              <i class="mdi mdi-lock"></i>
                            </span>   
                          </div>
                        </div>  
                      </div>
                    </div>
                    <div class="field has-text-centered">
                      <button type="submit" class="button is-link mt-1">Login</button>
                    </div>
                  </form> 
                </div>
                <div class="panel-block">
                  <div class="has-text-centered" style={{'margin': '0 auto'}}>
                    If you forgot your password you can&nbsp;
                    <Link to="/ui/password-reset">request a password reset</Link>.
                  </div>
                </div>
              </div>

            </div>
          </div>    
        </div>
      )
    }
  }
}  