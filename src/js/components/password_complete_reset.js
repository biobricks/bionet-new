
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

        <div>
          <form onsubmit={this.submit.bind(this)}>
            <section class="hero is-info ">
              <div class="hero-body">
                <div class="container">
                  <h1 class="title">
                    Change your password
                  </h1>
                </div>
              </div>
            </section>

            <div class="container post-hero-area">
              <div class="columns">
                <div class="column is-6">

                  <div class="field">
                    <label class="label">New password</label>
                    <div class="control has-icons-left has-icons-right">
                      <input class={'input ' + this.validateInputClass('password')} type="password" onInput={this.validator('password')} onfocusout={this.validator('password', true)} value={this.state.password} autocomplete="off" />
                      <span class="icon is-small is-left">
                        <i class="fa fa-lock"></i>
                      </span>
                      <span class="icon is-small is-right">
                        <i class={'fa ' + this.validateInputIcon('password')}></i>
                      </span>
                    </div>
                    {this.validateInputNotice('password', "Your new password is strong")}
                  </div>

                  <div class="field">
                    <div class="control">
                      <input type="submit" class="button is-link" value="Save" />
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </form>
        </div>
      );
    }

  }
}
