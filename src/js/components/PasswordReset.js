
import {h} from 'preact';
import {Link} from 'react-router-dom';
import emailValidator from 'email-validator';


module.exports = function(Component) {

  return class PasswordReset extends Component {
   
    constructor(props) {
      super(props);
      this.state = {
        email: '',
        emailError: ''
      };
    }

    check(e) {
      var email = e.target.value || '';
      if(!email) {
        this.setState({
          email: '',
          emailError: ''
        });
        return;
      }

      var err;
      if(!emailValidator.validate(email)) {
        err = "Not a valid email address";
      }

      this.setState({
        email: email.trim(),
        emailError: err
      });
    }
    
    passwordReset(e) {
      e.preventDefault();
      const email = this.state.email || '';
      
      app.actions.user.passwordReset(email.trim(), function(err) {
        if(err) {
          app.actions.notify("Password reset failed: " + err);
          console.error(err);
          return;
        }
        const timeout = 3000;
        app.actions.notify("Password reset email sent", 'success', timeout);
        setTimeout(function() {
          app.actions.route('/login');
        }, timeout);
      });
    }

	  render() {
      
      const emailErrorExists = Object.keys(this.state).indexOf('emailError') > -1;

      return (

        <div class="PasswordReset AuthForm">
          <div class="columns is-desktop is-centered">
            <div class="column is-12 is-6-desktop">    
              <div class="panel">
                <div class="panel-heading has-text-centered">
                  <h3 class="mb-0">Password Reset</h3>
                </div>
                <div class="panel-block is-block">        
                  <form onsubmit={this.passwordReset.bind(this)}>

                    <div class="field is-horizontal">
                      <div class="field-label is-normal is-narrow">
                        <label class="label mt-1">Email</label>
                      </div>
                      <div class="field-body">
                        <div class="field">
                          <div class="control expanded has-icons-left">
                            <input 
                              class='input'
                              type="email"
                              name="email" 
                              placeholder="myaccountemail@example.com"
                              onInput={this.check.bind(this)}
                            />
                            <span class="icon is-small is-left">
                              <i class="mdi mdi-18px mdi-email mt-1"></i>
                            </span>                          
                          </div>
                          {(!!this.state.emailError || !this.state.email) ? (
                            <p class="help is-danger">{this.state.emailError}</p>
                          ) : (
                            <p class="help is-success">Email address appears to be valid.</p>
                          )}
                        </div>
                      </div>
                    </div>

                    <div class="field is-grouped is-grouped-centered">
                      <div class="control">
                        <button 
                          type="submit" 
                          class="button is-success mb-2"
                          value="Reset password"
                          disabled={!!this.state.emailError || !this.state.email}
                        >Request Password Reset</button>
                      </div>
                    </div>

                  </form>
                </div>

              </div>
            </div>  
          </div>      
        </div>
      );
    }
  }


}
