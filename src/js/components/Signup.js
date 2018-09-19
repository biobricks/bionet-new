import {h} from 'preact';
import {Link} from 'react-router-dom';
import validations from '../../../common/validations.js';



module.exports = function(Component) {

  return class Signup extends Component {

    constructor(props) {
      super(props);
      this.state = {
        username: '',
        email: '',
        password: '',
        masterPassword: ''
      };
      this.submit = this.submit.bind(this);
    };    

    // if a validate function is present it will be used by validator()
    validate(o, lostFocus) {
      return validations.signup(o, lostFocus);
    }

    submit(e) {
      e.preventDefault();
      if(!this.isValid()) {
        // TODO align bulma and noty severity names and colors
        app.actions.notify("Missing or incorrect signup info", 'error');
        return false;
      }

      app.actions.user.create(this.state.username, this.state.email, this.state.password, {masterPassword: this.state.masterPassword}, function(err, data) {
        if(err) {
          app.actions.notify(err.toString(), 'error');
          return;
        }
        app.actions.notify("Thank you for signing up!", 'notice');
        app.actions.route('/login');
      });
    }

	  render() {
      return (
        <div class="Signup">
          <div class="columns is-desktop is-centered">
            <div class="column is-12 is-6-desktop">    
              <div class="panel">
                <div class="panel-heading has-text-centered">
                  <h3 class="mb-0">Signup</h3>
                </div>
                <div class="panel-block is-block">

                  <div class="field has-text-centered">
                    <p>Already have an account? <Link to="/login">Login</Link></p>
                  </div>

                  <form onsubmit={this.submit}>

                    <div class="field is-horizontal">
                      <div class="field-label is-normal is-narrow">
                        <label class="label mt-1">Username</label>
                      </div>
                      <div class="field-body">
                        <div class="field">
                          <div class="control expanded has-icons-left">
                            <input 
                              class={'input ' + this.validateInputClass('username')}
                              type="text"
                              name="username" 
                              onInput={this.validator('username')}
                              onfocusout={this.validator('username', true)} 
                              value={this.state.username}
                              placeholder="username"
                            />
                            <span class="icon is-small is-left">
                              <i class="mdi mdi-24px mdi-account mt-1"></i>
                            </span>                          
                          </div>
                          {(this.state.username.length > 0) ? (
                            <span>{this.validateInputNotice('username', "Your user name is valid and unique on this bionet node :)")}</span>
                          ) : (
                            <p class="help">
                              * Username must be unique on this BioNet Node.
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    <div class="field is-horizontal">
                      <div class="field-label is-normal is-narrow">
                        <label class="label mt-1">Email</label>
                      </div>
                      <div class="field-body">
                        <div class="field">
                          <div class="control expanded has-icons-left">
                            <input 
                              class={'input ' + this.validateInputClass('email')} 
                              type="email"
                              name="email" 
                              placeholder="myemailaddress@example.com"
                              onInput={this.validator('email')}
                              onfocusout={this.validator('email', true)} 
                              value={this.state.email}
                            />
                            <span class="icon is-small is-left">
                              <i class="mdi mdi-18px mdi-email mt-1"></i>
                            </span>                          
                          </div>
                          {this.validateInputNotice('email', "Looks like a valid email address to me!")}
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
                              class={'input ' + this.validateInputClass('password')} 
                              type="password"
                              name="password" 
                              placeholder="secretpassword"
                              onInput={this.validator('password')}
                              onfocusout={this.validator('password', true)} 
                              value={this.state.password}
                            />
                            <span class="icon is-small is-left">
                              <i class="mdi mdi-24px mdi-textbox-password mt-1"></i>
                            </span>                          
                          </div>
                          {this.validateInputNotice('password', "Your password is strong.")}
                        </div>
                      </div>
                    </div>

                    <div class="field is-horizontal">
                      <div class="field-label is-normal is-narrow">
                        <label class="label mt-1">New Account Password</label>
                      </div>
                      <div class="field-body">
                        <div class="field">
                          <div class="control expanded has-icons-left">
                            <input 
                              class={'input ' + this.validateInputClass('masterPassword')} 
                              type="password"
                              name="masterPassword" 
                              placeholder="newaccountpassword"
                              onInput={this.validator('masterPassword')}
                              onfocusout={this.validator('masterPassword', true)} 
                              value={this.state.masterPassword}
                            />
                            <span class="icon is-small is-left">
                              <i class="mdi mdi-24px mdi-textbox-password mt-1"></i>
                            </span>                          
                          </div>
                          {(this.state.masterPassword.length > 0) ? (
                            <span>{this.validateInputNotice('masterPassword')}</span>
                          ) : (
                            <p class="help">
                              * Ask your BioNet Node Administrator for the New Account Password.
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    <div class="field is-grouped is-grouped-centered">
                      <div class="control">
                        <button type="submit" class="button is-success mt-2 mb-2" value="Create">Signup</button>
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
