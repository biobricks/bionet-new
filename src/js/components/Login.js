
import {h} from 'preact';
import linkState from 'linkstate';
import merge from 'deepmerge';
import {Link} from 'react-router-dom';

module.exports = function(Component) {

  return class Login extends Component {
   
    constructor(props) {
      super(props);
      this.state = {
        form: {
          username: '',
          password: ''
        },
        authError: '',
        usernameFormError: '',
        passwordFormError: ''
      };
      this.onFieldInput = this.onFieldInput.bind(this);
      this.onFormSubmit = this.onFormSubmit.bind(this);
    };
  

    onFieldInput(e) {
      let form = this.state.form;
      let field = e.target.getAttribute('name');
      form[field] = e.target.value;
      this.setState({
        form
      });
    }    

    onFormSubmit(e) {
      e.preventDefault();
      const username = this.state.form.username.trim();
      const password = this.state.form.password.trim();
      let usernameFormError;
      let passwordFormError;
      // username validation
      if (!username || username.length < 1 ) {
        usernameFormError = "Username is required.";
      }

      // password validation
      if (!password || password.trim().length < 1) {
        passwordFormError = "Password required.";
      }

      let usernameFormErrorExists = usernameFormError && usernameFormError.length > 1;
      let passwordFormErrorExists = passwordFormError && passwordFormError.length > 1;

      // if form not vaild
      if (usernameFormErrorExists || passwordFormErrorExists) {
        this.setState({
          usernameFormError: usernameFormErrorExists ? usernameFormError : '',
          passwordFormError: passwordFormErrorExists ? passwordFormError : '',
        });
      // if form valid
      } else {
        app.actions.user.login(username, password, function(error, token, userData) {
          if (error) {
            this.setState({
              authError: 'Incorrect username or password.'
            });
          } else {
            app.actions.notify("Logged in!", 'notice');
            app.actions.route('/');
            window.scrollTo(0,0)
          }
        }.bind(this));
      }
    }

  	  render() {
      
      return (
        <div class="Login">
          <div class="columns is-desktop is-centered">
            <div class="column is-12 is-6-desktop">    
              <div class="panel">
                <div class="panel-heading has-text-centered">
                  <h3 class="mb-0">Login</h3>
                </div>
                <div class="panel-block is-block">

                  <form onSubmit={this.onFormSubmit}>

                    <div class="field has-text-centered">
                      {(this.state.authError.length > 0) ? (
                        <p class="has-text-danger">{this.state.authError}</p>
                      ) : null }  
                      <p>Don't have a login? Why not <Link to="/signup">Sign Up</Link> for an account?</p>
                    </div>

                    <div class="field is-horizontal">
                      <div class="field-label is-normal is-narrow">
                        <label class="label mt-1">Username</label>
                      </div>
                      <div class="field-body">
                        <div class="field">
                          <div class="control expanded has-icons-left">
                            <input 
                              class="input" 
                              type="text"
                              name="username" 
                              placeholder="username"
                              value={this.state.form.username}
                              onInput={this.onFieldInput}
                            />
                            <span class="icon is-small is-left">
                              <i class="mdi mdi-24px mdi-account mt-1"></i>
                            </span>                          
                          </div>
                          {(this.state.usernameFormError.length > 0) ? (
                            <p class="help is-danger p-0 mt-1">
                              {this.state.usernameFormError}
                            </p>
                          ) : null }  
                        </div>
                      </div>
                    </div>

                    <div class="field is-horizontal">
                      <div class="field-label is-normal is-narrow">
                        <label class="label mt-1">Password</label>
                      </div>
                      <div class="field-body">
                        <div class="field">
                          <div class="control expanded has-icons-left">
                            <input 
                              class="input" 
                              type="password" 
                              name="password"
                              placeholder="password"
                              value={this.state.form.password}
                              onInput={this.onFieldInput}
                            />
                            <span class="icon is-small is-left">
                              <i class="mdi mdi-24px mdi-textbox-password mt-1"></i>
                            </span>                          
                          </div>
                          {(this.state.passwordFormError.length > 0) ? (
                            <p class="help is-danger p-0 mt-1">
                              {this.state.passwordFormError}
                            </p>
                          ) : null }  
                        </div>
                      </div>
                    </div>

                    <div class="field has-text-centered">
                      <p>If you forgot your password you can <Link to="/password-reset">request a password reset</Link></p>
                    </div>

                    <div class="field is-grouped is-grouped-centered">
                      <div class="control">
                        <button type="submit" class="button is-success mb-2">Login</button>
                      </div>
                    </div>

                  </form>

          
                </div>
              </div>
            </div>
          </div>    
        </div>
      )
    }
  }
}
