
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

        var editLink = '';
        if(app.state.global.user) {
          editLink = (
              <span><Link to={'/virtual/edit/' + this.state.virtual.id}>edit</Link></span>
          );
        }
        
        var content = '';

        if(this.state.virtual.content) {
          content = (
            <div class="markdown-help" dangerouslySetInnerHTML={{
              __html: marked(this.state.virtual.content)
            }} />
          );
        }

        virtual = (
          <div class="virtual">
            <div>
              <h3>{this.state.virtual.name} {editLink}</h3>
            </div>
            <div>
              <p class="description">{this.state.virtual.description}</p>
            </div>
            <hr/>
            <div class="content">
              {content}
            </div>
            <hr/>
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


