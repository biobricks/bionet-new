
import {h} from 'preact';
import linkState from 'linkstate';
import zxcvbn from 'zxcvbn';
import merge from 'deepmerge';

module.exports = function(Component) {

  return class Login extends Component {
   
    constructor(props) {
      super(props);
      this.state = {
        username: '',
        password: ''
      };
    };
    
    login(e) {
      e.preventDefault();

      var username = this.state.username.trim();
      var password = this.state.password.trim();
      if(!username.length) {
        this.changeState({
          usernameError: true
        });
        return;
      }

      if(!username.length) {
        this.changeState({
          passwordError: true
        });
        return;
      }
      
      app.actions.user.login(username, password, function(err, token, userData) {
        if(err) {
          app.actions.notify(err.toString(), 'error');
          this.changeState({
            passwordError: true,
            usernameError: true
          });
          return;
        }
        this.changeState({
          passwordError: false,
          usernameError: false
        });
        app.actions.notify("Logged in!", 'notice');
        app.actions.route('/');
      }.bind(this));
      
    };
   
    passwordMessage() {
      if(this.state.passwordError) {
        var msg = 'Incorrect password.';
        if(!this.state.password.trim().length) {
          msg = "Missing password.";
        } else if(zxcvbn(this.state.password).score < 2) {
          msg += " This is not a valid password for this site (too weak).";
        }
        return (
          <p class="help is-danger">{msg}</p>
        );
      }
      return '';
    };

    usernameMessage() {
      if(this.state.usernameError) {
        var msg = 'Unknown username.';
        // TODO this should be re-usig the signup validations
        if(!this.state.username.trim().length) {
          msg = "Missing username.";  
        } else if(this.state.username.trim().length < 2) {
          msg += " This is not a valid username on this site (too short).";
        }
        if(this.state.username.match(/\s/)) {
          msg += " Username must not contain spaces (or other whitespace).";
        }
        if(this.state.username.match('@')) {
          msg += " Username must not contain any @ symbols.";
        }
        return (
          <p class="help is-danger">{msg}</p>
        );
      }
    };

    

	  render() {
      
      return (
        <div>
          <form onsubmit={this.login.bind(this)}>
            <section class="hero is-info ">
              <div class="hero-body">
                <div class="container">
                  <h1 class="title">
                    Login
                  </h1>
                  <h2 class="subtitle">
                    Welcome back to the bionet
                  </h2>
                </div>
              </div>
            </section>
            <div class="container post-hero-area">
              <div class="columns">
                <div class="column is-6">

                  <div class="field">
                    <p>Don't have a login? Why not <a href="/signup">sign up</a> for an account?</p>
                  </div>
                  
                  <div class="field">
                    <label class="label">Username</label>
                    <div class="control has-icons-left has-icons-right">
                      <input class="input" type="text" oninput={linkState(this, 'username')} />
                      <span class="icon is-small is-left">
                        <i class="fa fa-user"></i>
                      </span>
                    </div>
                    {this.usernameMessage()}
                  </div>
                  
                  <div class="field">
                    <label class="label">Password</label>
                    <div class="control has-icons-left has-icons-right">
                      <input class="input" type="password" oninput={linkState(this, 'password')} />
                      <span class="icon is-small is-left">
                        <i class="fa fa-lock"></i>
                      </span>
                      {this.passwordMessage()}
                      <p class="help is-danger">If you forgot your password you can <a href="/password-reset">request a password reset</a></p>
                    </div>
                  </div>

                  <div class="field is-grouped">
                    <div class="control">
                      <input type="submit" class="button is-link" value="Login" />
                    </div>
                  </div>
                </div>
              </div>
              <div class="column is-6"></div>
            </div>
          </form>
        </div>
      )
    }
  }
}
