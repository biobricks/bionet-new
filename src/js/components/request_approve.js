
import {h} from 'preact';
import linkState from 'linkstate';
import {Link} from 'react-router-dom';
import xtend from 'xtend';
import strftime from 'strftime';

import util from '../util.js';


module.exports = function(Component) {

  return class RequestApprove extends Component {

    constructor(props) {
      super(props);
      this.state = {
        error: false,
        loading: true,
        id: this.props.match.params.id,
        request: undefined
      };

      util.whenConnected(function() {
        this.getRequest();
      }.bind(this));
    }

    componentWillReceiveProps(nextProps) {

    }

    getRequest() {

      app.remote.getRequest(this.state.id, function(err, r, pandaDetails) {
        if(err) {
          this.setState({
            error: err
          });
          return;
        }

        this.setState({
          loading: false,
          request: r,
          description: "FreeGenes project material " + r.virtualName
        });

      }.bind(this));
    }

    approve(e) {
      e.preventDefault();
      if(!confirm("This will send the OpenMTA to the TTOs. Are you sure?")) {
        return;
      }

      // this automatically changes request.status to 'approved'
      // and sends the MTA
      app.remote.requestSendMTA(this.state.id, this.state.description, function(err) {
        if(err) {
          app.actions.notify("Error: " + err.message, 'error');
          console.log("ERRAW:", err);
          return;
        }

        this.changeState({
          request: {
            status: 'approved'
          }
        });
          
        app.actions.notify("Request approved! Redirecting...");

        setTimeout(function() {
          app.actions.route('/request-show/' + this.state.id);
        }.bind(this), 2000);

      }.bind(this));
    }

    cancel(e) {
      e.preventDefault();
      history.back();
    }

	  render() {

      if(this.state.error) {
        return (
          <div>Error: <span>{this.state.error.message}</span></div>
        );
      }

      var loading = '';
      if(this.state.loading) {
        loading = (
          <div class="spinner">
            <div class="cssload-whirlpool"></div>
          </div>
        )
      }

      return (
        <div>
          <h3>Approve material request</h3>
          {loading}
        

          <form onsubmit={this.approve.bind(this)}>
            <div class="container post-hero-area">
              <div class="columns">
                <div class="column is-6">

                  <div class="field">
                    <label class="label">Description for TTO document</label>
                    <div class="control">
                      <textarea rows="4" cols="40" type="text" onChange={linkState(this, 'description')}>{this.state.description}</textarea>
                    </div>
                  </div>

                  <div class="field is-grouped">
                    <div class="control">
                      <input type="submit" class="button is-link" value="Approve" />
                    </div>
                    <div class="control">
                      <button class="button is-text" onClick={this.cancel.bind(this)}>Cancel</button>
                    </div>
                  </div>

                </div>
              </div>
             </div>
           </form>
         </div>
      )
    }
  }
}


