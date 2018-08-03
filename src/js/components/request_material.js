
import {h} from 'preact';
import linkState from 'linkstate';
import {Link} from 'react-router-dom';
import xtend from 'xtend';

import util from '../util.js';


module.exports = function(Component) {

  return class Virtual extends Component {

    constructor(props) {
      super(props);

      this.queryID = 0;

      this.state = {
        id: this.props.match.params.id,
        virtual: undefined
      };

      util.whenConnected(function() {
        if(!this.state.id) return;

        this.getVirtual(this.state.id);
      }.bind(this));
    }

    request(e) {
      e.preventDefault();
      
      app.remote.createRequest(
        this.state.id,
        { 
          email: this.state.email,
          title: this.state.title,
          name: this.state.name,
          company: this.state.company,
          ttoEmail: this.state.ttoEmail,
          street1: this.state.street1,
          street2: this.state.street2,
          city: this.state.city,
          zip: this.state.zip,
          state: this.state.state,
          msg: this.state.message
        },
        function(err, data, requestID) {
          if(err) {
            app.actions.notify("Sending request failed");
            console.error(err);
            return;
          }
          app.actions.route('/request-sent/' + requestID);
        });
    }

    cancel(e) {
      e.preventDefault();
      history.back();
    }

    getVirtual(id) {

      app.remote.get(id, function(err, data) {
        if(err || !data) {
          this.setState({
            error: "Virtual item not found"
          });
          console.error(err);
          return;
        }

        this.setState({
          virtual: data
        });

        app.remote.instancesOfVirtual(id, function(err, data) {
          if(err) {
            this.setState({
              error: "Error fetching physical instances"
            });
            console.error(err);
            return;
          }

          this.setState({
            physicals: data || [],
            loading: false
          });

        }.bind(this));
      }.bind(this));
    }

    componentWillReceiveProps(nextProps) {

      this.setState({
        id: nextProps.match.params.id,
        error: null
      });

      util.whenConnected(function() {
        this.getVirtual(this.state.id);
      }.bind(this));
    }

    componentDidMount() {
    }

	  render() {

      if(this.state.error) {
        return (
          <div>
            {this.state.error}
          </div>
        )
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
        <div class="request-material">
          <div>
            <form onsubmit={this.request.bind(this)}>
            <section class="hero is-info ">
              <div class="hero-body">
                <div class="container">
                  <h1 class="title">
                    Requesting biomaterial
                  </h1>
                  <h2 class="subtitle">
                    Material: <span><i>{(this.state.virtual) ? this.state.virtual.name : ''}</i></span><br/>From lab: <span><i>{app.settings.lab}</i></span>
                  </h2>
                </div>
              </div>
            </section>
            <div class="description">
              <p>To request this biomaterial please complete the form below.</p>
            </div>
            <div class="container post-hero-area">
              <div class="columns">
                <div class="column is-6">


                  <div class="field">
                    <label class="label">Your title</label>
                    <div class="control">
                      <input class="input" type="text" onChange={linkState(this, 'title')} />
                    </div>
                  </div>
                  <div class="field">
                    <label class="label">Your name</label>
                    <div class="control">
                      <input class="input" type="text" onChange={linkState(this, 'name')} />
                    </div>
                  </div>
                  <div class="field">
                    <label class="label">Your email</label>
                    <div class="control has-icons-left">
                      <input class="input" type="text" onChange={linkState(this, 'email')} />
                      <span class="icon is-small is-left">
                        <i class="fa fa-envelope"></i>
                      </span>
                    </div>
                  </div>
                  <div class="field">
                    <label class="label">Name of your organization</label>
                    <div class="control">
                      <input class="input" type="text" onChange={linkState(this, 'company')} />
                    </div>
                  </div>
                  <div class="field">
                    <label class="label">Street address (for shipping)</label>
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
                    <label class="label">State (e.g. California)</label>
                    <div class="control">
                      <input class="input" type="text" onChange={linkState(this, 'state')} />
                    </div>
                  </div>

                  <div class="field">
                    <label class="label">Message for <span>{app.settings.lab}</span>?</label>
                    <div class="control">
                      <textarea class="textarea" onChange={linkState(this, 'message')}></textarea>
                    </div>
                  </div>

            <div class="field is-grouped">
              <div class="control">
                <input type="submit" class="button is-link" value="Request" />
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
          <div>
            {loading}
          </div>
        </div>
      )
    }
  }
}


