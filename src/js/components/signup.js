
import {h} from 'preact';

import validations from '../../../common/validations.js';

module.exports = function(Component) {

  return class Signup extends Component {

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
    
    cancel(e) {
      e.preventDefault();

      app.actions.route('/');
    }

	  render() {

      return (
        <div>
          <form onsubmit={this.submit.bind(this)}>
            <section class="hero is-info ">
              <div class="hero-body">
                <div class="container">
                  <h1 class="title">
                    Sign up
                  </h1>
                  <h2 class="subtitle">
                    Create your bionet account
                  </h2>
                </div>
              </div>
            </section>
            <div class="container post-hero-area">
              <div class="columns">
                <div class="column is-6">
                  
                  <div class="field">
                    <label class="label">Username</label>
                    <div class="control has-icons-left has-icons-right">
                      <input class={'input ' + this.validateInputClass('username')} type="text" onInput={this.validator('username')} onfocusout={this.validator('username', true)} value={this.state.username} placeholder="Must be unique on this bionet node"/>
                      <span class="icon is-small is-left">
                        <i class="fa fa-user"></i>
                      </span>
                      <span class="icon is-small is-right">
                        <i class={'fa ' + this.validateInputIcon('username')}></i>
                      </span>
                    </div>
                    {this.validateInputNotice('username', "Your user name is valid and unique on this bionet node :)")}
                  </div>

                  <div class="field">
                    <label class="label">Email</label>
                    <div class="control has-icons-left has-icons-right">
                      <input class={'input ' + this.validateInputClass('email')} type="text" onInput={this.validator('email')} onfocusout={this.validator('email', true)} value={this.state.email} />
                      <span class="icon is-small is-left">
                        <i class="fa fa-envelope"></i>
                      </span>
                      <span class="icon is-small is-right">
                        <i class={'fa ' + this.validateInputIcon('email')}></i>
                      </span>
                    </div>
                    {this.validateInputNotice('email', "Looks like a valid email address to me!")}
                  </div>

                  <div class="field">
                    <label class="label">Password</label>
                    <div class="control has-icons-left has-icons-right">
                      <input class={'input ' + this.validateInputClass('password')} type="password" onInput={this.validator('password')} onfocusout={this.validator('password', true)} value={this.state.password} />
                      <span class="icon is-small is-left">
                        <i class="fa fa-lock"></i>
                      </span>
                      <span class="icon is-small is-right">
                        <i class={'fa ' + this.validateInputIcon('password')}></i>
                      </span>
                    </div>
                    {this.validateInputNotice('password', "Your password is strong")}
                  </div>

                  <div class="field">
                    <label class="label">Master password</label>
                    <div class="control has-icons-left has-icons-right">
                      <input class={'input ' + this.validateInputClass('masterPassword')} type="password" onInput={this.validator('masterPassword')} onfocusout={this.validator('masterPassword', true)} value={this.state.masterPassword} placeholder="hint: ask your bionet node administrator" />
                      <span class="icon is-small is-left">
                        <i class="fa fa-lock"></i>
                      </span>
                      <span class="icon is-small is-right">
                        <i class={'fa ' + this.validateInputIcon('masterPassword')}></i>
                      </span>
                    </div>
                    {this.validateInputNotice('masterPassword')}
                  </div>
                  
                  <div class="field is-grouped">
                    <div class="control">
                      <input type="submit" class="button is-link" value="Create" />
                    </div>
                    <div class="control">
                      <button class="button is-text" onclick={this.cancel.bind(this)}>Cancel</button>
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
