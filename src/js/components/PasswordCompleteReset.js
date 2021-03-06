
import {h} from 'preact';
import {Link} from 'react-router-dom';
import emailValidator from 'email-validator';
import util from '../util.js';
import validations from '../../../common/validations.js';

module.exports = function(Component) {

  return class PasswordCompleteReset extends Component {

    constructor(props) {
      super(props);
      this.state = {
        code: this.props.match.params.code,
      }

      util.whenConnected(function() {
        if(!this.state.code) return;
        app.remote.checkPasswordResetCode(this.state.code, function(err) {
          if(err) {
            app.actions.notify(err, 'error');
          
            this.setState({
              code: null
            });
            return
          }
        }.bind(this));
      }.bind(this))
    }

    validate(o, lostFocus) {
      return validations.passwordReset(o, lostFocus);
    }

    submit(e) {
      e.preventDefault();

      if(!this.isValid()) {
        // TODO align bulma and noty severity names and colors
        app.actions.notify("Missing or incorrect signup info", 'error');
        return false;
      }
      if(!this.state.code) {
        app.actions.notify("Invalid or missing reset code. Check the link in yor email", 'error');
        return;
      }

      app.remote.completePasswordReset(this.state.code, this.state.password, function(err) {
        if(err) return app.actions.notify(err, 'error');

        app.actions.notify("Password reset success... redirecting", 'success');
        setTimeout(function() {
          app.actions.route('/login');
        }, 2500);
      });
    }

    componentWillReceiveProps(nextProps) {

      if(nextProps.match.params.code) {
        this.setState({
          code: nextProps.match.params.code
        });
      } else {
        this.setState({
          code: null
        });
      }

    }

	  render() {
      
      return (

        <div class="PasswordCompleteReset AuthForm">

          <div class="columns is-desktop is-centered">
            <div class="column is-12 is-6-desktop">    
              <div class="panel">
                <div class="panel-heading has-text-centered">
                  <h3 class="mb-0">Reset Your Password</h3>
                </div>
                <div class="panel-block is-block">

                  <form onsubmit={this.submit.bind(this)}>

                    <div class="field is-horizontal">
                      <div class="field-label is-normal is-narrow">
                        <label class="label mt-1">New Password</label>
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
                              autocomplete="off" 
                            />
                            <span class="icon is-small is-left">
                              <i class="mdi mdi-24px mdi-textbox-password mt-1"></i>
                            </span>                          
                          </div>
                          {this.validateInputNotice('password', "Your new password is strong.")}
                        </div>
                      </div>
                    </div>

                    <div class="field is-grouped is-grouped-centered">
                      <div class="control">
                        <button 
                          type="submit" 
                          class="button is-success mt-2 mb-2"
                          value="Save"
                        >Reset Password</button>
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
