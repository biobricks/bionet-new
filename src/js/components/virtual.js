
import {h} from 'preact';
import linkState from 'linkstate';
import {Link} from 'react-router-dom';
import xtend from 'xtend';
import strftime from 'strftime';
import marked from 'marked';

import util from '../util.js';

/*
  ToDo:

  * make a "request biomaterial" button
*/

module.exports = function(Component) {

  var FreegenesStatus = require('./freegenes_status.js')(Component)

  return class Virtual extends Component {

    constructor(props) {
      super(props);

      this.queryID = 0;

      this.state = {
        id: this.props.match.params.id,
        virtual: undefined,
        physicals: [],
        error: null,
        loading: true
      };

      util.whenConnected(function() {
        if(!this.state.id) return;

        this.getVirtual(this.state.id);
      }.bind(this));
    }

    formatTime(unixEpochTime) {
      return strftime('%b %o %Y', new Date(unixEpochTime * 1000));
    }

    delVirtual() {
      if(!this.state.id) {
        app.actions.notify("Cannot delete: Unknown virtual", 'error');
        return;
      }
      app.actions.virtual.delete(id, function(err) {
        if(err) {
          app.actions.notify(err, 'error');
          return;
        }
        // TODO go back instead?
        app.actions.route('/');
      });
    }

    getVirtual(id) {

      // TODO why is this running twice on reload?
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


      var status = '';
      if(this.state.virtual && this.state.virtual.freegenes) {
        status = (<FreegenesStatus status={util.getFreegenesStatus(this.state.virtual)} />);
      }

      var virtual = '';
      if(this.state.virtual) {

        var timestamps = [(
            <div>
            First created: <span>{this.formatTime(this.state.virtual.created.time)}</span> by <span>{this.state.virtual.created.user}</span>
            </div>
        )];

        if(this.state.virtual.updated.time > this.state.virtual.created.time) {
          timestamps.push((
              <div>
              Last updated: <span>{this.formatTime(this.state.virtual.updated.time)}</span> by <span>{this.state.virtual.updated.user}</span>
              </div>
          ));
        };
        
        var sequence = '';
        if(this.state.virtual.Sequence) {
            sequence = (
              <textarea rows="10" cols="50" disabled>{this.state.virtual.Sequence.toUpperCase()}</textarea>
            );
        }

        var modifyLinks = '';
        if(app.state.global.user) {
          modifyLinks = (
            <span>
              <span><Link to={'/virtual/edit/' + this.state.virtual.id}>edit</Link> | <a href="#" onClick={this.delVirtual.bind(this)}>delete</a></span>
            </span>
          );
        }
        
        var content = '';

        if(this.state.virtual.content) {
          content = (
            <div class="content">
              <hr/>
              <div class="markdown-help" dangerouslySetInnerHTML={{
                __html: marked(this.state.virtual.content)
              }} />
              <hr/>
            </div>
          );
        }

        virtual = (
          <div class="virtual">
            <div>
              <h3>{this.state.virtual.name} {modifyLinks}</h3>
            </div>
            <div>
              <p class="description">{this.state.virtual.description}</p>
            </div>
            {content}
            <div>
              <span style="font-weight:bold">Provenance:</span> {this.state.virtual.provenance || "Unknown"}
            </div>
            <div>
              <span style="font-weight:bold">Terms and condition:</span> {this.state.virtual.terms || "Not specified"}
            </div>
            <div>{timestamps}</div>
            <div>{sequence}</div>
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

      var physicals = [];
      let i;
      for(i=0; i < this.state.physicals.length; i++) {
        physicals.push((
          <ul>
            <li><Link to={'/inventory/'+this.state.physicals[i].id}>{this.state.physicals[i].name}</Link></li>
          </ul>
        ));
      }


      if(!physicals.length) {
        physicals = (
          <div><p>No physical instances</p></div>
        )
      }

      return (
        <div>
          {status}
          <div>
            {virtual}
          </div>
          <div>
            <h3>Physical instances:</h3>
            {physicals}
          </div>
          <div>
            {loading}
          </div>
        </div>
      )
    }
  }
}


