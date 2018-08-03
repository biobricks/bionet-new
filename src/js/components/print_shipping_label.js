
import {h} from 'preact';
import linkState from 'linkstate';
import {Link} from 'react-router-dom';
import xtend from 'xtend';

import util from '../util.js';


module.exports = function(Component) {

  return class PrintShippingLabel extends Component {

    constructor(props) {
      super(props);

      this.state = {
      };

    }

    cancel(e) {
      e.preventDefault();
      history.back();
    }

    print(e) {
      e.preventDefault();
      this.setState({error: ''});
      app.remote.printShippingLabel(this.state, function(err) {
        if(err) {
          this.setState({error: err.message});
          return;
        }

        app.notify("Label sent to printer!", 'success');
      }.bind(this));
    }

    componentWillReceiveProps(nextProps) {

    }

    componentDidMount() {
    }

	  render() {

      var error = '';

      if(this.state.error) {
        error = (
          <div>
            {this.state.error.replace("\n", "<br/>")}
          </div>
        );
      }

      return (
        <div class="print-shipping-label">
          <div class="columns">
            <div class="column is-6-desktop">
              <div class="panel mt-1">
                <div class="panel-heading">
                  Print Shipping Label
                </div>

                <div class="panel-block">
                  {error} 
                  <form onsubmit={this.print.bind(this)}>
                    <div class="field">
                      <label class="label">Name</label>
                      <div class="control">
                        <input class="input" type="text" onChange={linkState(this, 'name')} />
                      </div>
                    </div>


                  <div class="field">
                    <label class="label">Street address</label>
                    <div class="control">
                      <input class="input" type="text" onChange={linkState(this, 'street1')} />
                    </div>
                  </div>

                  <div class="field">
                    <label class="label">Street address 2</label>
                    <div class="control">
                      <input class="input" type="text" onChange={linkState(this, 'street2')} />
                    </div>
                 </div>

                    <div class="field">
                      <label class="label">Company / Organization</label>
                      <div class="control">
                        <input class="input" type="text" onChange={linkState(this, 'company')} />
                      </div>
                    </div>
                    <div class="field">
                      <label class="label">City</label>
                      <div class="control">
                        <input class="input" type="text" onChange={linkState(this, 'city')} />
                      </div>
                    </div>
                    <div class="field">
                      <label class="label">Zipcode</label>
                      <div class="control">
                        <input class="input" type="text" onChange={linkState(this, 'zip')} />
                      </div>
                    </div>
                    <div class="field">
                      <label class="label">State</label>
                      <div class="control">
                        <input class="input" type="text" onChange={linkState(this, 'state')} />
                      </div>
                    </div>
                    <div class="field">
                      <label class="label">Email</label>
                      <div class="control has-icons-left">
                        <input class="input" type="text" onChange={linkState(this, 'email')} />
                        <span class="icon is-small is-left">
                          <i class="fa fa-envelope"></i>
                        </span>
                      </div>
                    </div>
                    <div class="field is-grouped mt-1">
                      <div class="control">
                        <input type="submit" class="button is-link" value="Print shipping label" />
                      </div>
                      <div class="control">
                        <button class="button is-text" onClick={this.cancel.bind(this)}>Cancel</button>
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


