
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
      
      return (

        <div>
          <form onsubmit={this.passwordReset.bind(this)}>
            <section class="hero is-info ">
              <div class="hero-body">
                <div class="container">
                  <h1 class="title">
                    Password reset
                  </h1>
                </div>
              </div>
            </section>

            <div class="container post-hero-area">
              <div class="columns">
                <div class="column is-6">

                  <div class="field">
                    <label class="label">Email</label>
                    <div class="control has-icons-left has-icons-right">
                      <input class='input' type="text" onInput={this.check.bind(this)} placeholder="hint: email address used for sign-up" />
                      <span class="icon is-small is-left">
                        <i class="fa fa-envelope"></i>
                      </span>
                      <span class="icon is-small is-right">
                        <i class='fa'></i>
                      </span>
                    </div>
                    <p class="help is-error">{this.state.emailError}</p>
                  </div>
                  <div class="field">
                    <div class="control">
                      <input type="submit" class="button is-link" value="Reset password" disabled={!!this.state.emailError || !this.state.email} />
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
