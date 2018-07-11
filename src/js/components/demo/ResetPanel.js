import { h } from 'preact';
import { Redirect, Link } from 'react-router-dom';

module.exports = function(Component) {

  return class ResetPanel extends Component {

    constructor(props) {
      super(props);
      this.state = {
        redirect: false,
        email: '',
      };
    }

    render() {
      if(this.state.redirect){ return( <Redirect to="/" /> ) }
      return (
        <div class="ResetPanel">
          <div class="columns is-centered">
            
            <div class="column is-12-mobile is-8-tablet is-6-desktop">
              <div class="panel">
                <div class="panel-heading has-text-centered">
                  <h3>Reset Password</h3>
                </div>
                <div class="panel-block">
                  <div class="has-text-centered" style={{'margin': '0 auto'}}>
                    Lost your password?<br/>
                    Enter the email address you used when you created your account.<br/>
                    You'll receive an email with instructions to reset your password.
                  </div>
                </div>
                <div class="panel-block p-2">
                  <form style={{'margin': '0 auto'}}>

                    <div class="field is-horizontal">
                      <div class="field-label is-normal">
                        <label class="label">Email</label>
                      </div>
                      <div class="field-body">
                        <div class="field">
                          <div class="control is-expanded has-icons-left">
                            <input 
                              class="input"
                              type="text" 
                              value={this.state.email}
                              placeholder="myemail@example.com"
                            />
                            <span class="icon is-small is-left">
                              <i class="mdi mdi-email"></i>
                            </span>                            
                          </div>
                        </div>  
                      </div>
                    </div>
                   
                    <div class="field has-text-centered">
                      <button type="submit" class="button is-link mt-1">Reset Password</button>
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