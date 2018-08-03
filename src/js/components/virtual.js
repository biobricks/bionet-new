
import {h} from 'preact';
import linkState from 'linkstate';
import {Link} from 'react-router-dom';
import xtend from 'xtend';
import strftime from 'strftime';
import marked from 'marked';

import util from '../util.js';

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
        if(this.state.virtual) return;

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
      app.actions.virtual.delete(this.state.id, function(err) {
        if(err) {
          app.actions.notify(err, 'error');
          return;
        }
        // TODO go back instead?
        app.actions.route('/');
        app.actions.notify("Deleted virtual");
        return;
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

        // TODO remove
        window.vv = data;

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
        // TODO whenConnected should automatically never be called more than once
        if(this.state.virtual) return;
        this.getVirtual(this.state.id);
      }.bind(this));
    }

    componentDidMount() {
      // test ui function
      // let virtual = {
      //   "type": "vector",
      //   "name": "tb1_v1",
      //   "sequence": "atgv",
      //   "content":"markdown content here...",
      //   "description":"plain text content here",
      //   "id": "v-30a940c1-1730-4a6e-8c5b-b5017bc4ad7a",
      //   "created": {
      //     "user": "tsakach",
      //     "time": 1524515914
      //   },
      //   "updated": {
      //     "user": "tsakach",
      //     "time": 1524515914
      //   }
      // };

      // let physicals = [  
      //   {
      //     "name": "tb1_v1_1",
      //     "type": "physical",
      //     "virtual_id": "v-30a940c1-1730-4a6e-8c5b-b5017bc4ad7a",
      //     "parent_id": "p-bb936051-a9ba-4bbd-a25d-a3eb84fec53e",
      //     "parent_x": 3,
      //     "parent_y": 2,
      //     "id": "p-01a59225-9902-41e4-a154-e4d7af71e737",
      //     "created": {
      //       "user": "tsakach",
      //       "time": 1524515914
      //     },
      //     "updated": {
      //       "user": "tsakach",
      //       "time": 1525310871
      //     }
      //   },
      //   {
      //     "name": "tb1_v1_6",
      //     "type": "physical",
      //     "virtual_id": "v-30a940c1-1730-4a6e-8c5b-b5017bc4ad7a",
      //     "parent_id": "p-21df6ff3-cb64-41c2-9ba7-cfe878c7acce",
      //     "parent_x": 6,
      //     "parent_y": 6,
      //     "id": "p-1ace3cd6-619a-4688-9749-91a53ed49653",
      //     "created": {
      //       "user": "tsakach",
      //       "time": 1524515914
      //     },
      //     "updated": {
      //       "user": "tsakach",
      //       "time": 1525122739
      //     }
      //   },
      //   {
      //     "name": "tb1_v1_2",
      //     "type": "physical",
      //     "virtual_id": "v-30a940c1-1730-4a6e-8c5b-b5017bc4ad7a",
      //     "parent_id": "p-bb936051-a9ba-4bbd-a25d-a3eb84fec53e",
      //     "parent_x": 3,
      //     "parent_y": 1,
      //     "id": "p-3ae79719-9f10-4611-907a-d1f1704be458",
      //     "created": {
      //       "user": "tsakach",
      //       "time": 1524515914
      //     },
      //     "updated": {
      //       "user": "tsakach",
      //       "time": 1524515914
      //     }
      //   },
      //   {
      //     "name": "tb1_v1_0",
      //     "type": "physical",
      //     "virtual_id": "v-30a940c1-1730-4a6e-8c5b-b5017bc4ad7a",
      //     "parent_id": "p-bb936051-a9ba-4bbd-a25d-a3eb84fec53e",
      //     "parent_x": 1,
      //     "parent_y": 1,
      //     "id": "p-6901db85-00dc-4038-a363-29b54b4ee203",
      //     "created": {
      //       "user": "tsakach",
      //       "time": 1524515914
      //     },
      //     "updated": {
      //       "user": "tsakach",
      //       "time": 1524515914
      //     }
      //   },
      //   {
      //     "name": "tb1_v1_5",
      //     "type": "physical",
      //     "virtual_id": "v-30a940c1-1730-4a6e-8c5b-b5017bc4ad7a",
      //     "parent_id": "p-21df6ff3-cb64-41c2-9ba7-cfe878c7acce",
      //     "parent_x": 8,
      //     "parent_y": 4,
      //     "id": "p-92fbcb4b-57c0-4621-8dba-ed492eb66e0f",
      //     "created": {
      //       "user": "tsakach",
      //       "time": 1524515914
      //     },
      //     "updated": {
      //       "user": "tsakach",
      //       "time": 1525300960
      //     }
      //   },
      //   {
      //     "name": "tb1_v1_4",
      //     "type": "physical",
      //     "virtual_id": "v-30a940c1-1730-4a6e-8c5b-b5017bc4ad7a",
      //     "parent_id": "p-bb936051-a9ba-4bbd-a25d-a3eb84fec53e",
      //     "parent_x": 5,
      //     "parent_y": 1,
      //     "id": "p-bd1e2d13-d8ce-43b1-b556-dc7137377e5d",
      //     "created": {
      //       "user": "tsakach",
      //       "time": 1524515914
      //     },
      //     "updated": {
      //       "user": "tsakach",
      //       "time": 1524515914
      //     }
      //   },
      //   {
      //     "name": "tb1_v1_3",
      //     "type": "physical",
      //     "virtual_id": "v-30a940c1-1730-4a6e-8c5b-b5017bc4ad7a",
      //     "parent_id": "p-bb936051-a9ba-4bbd-a25d-a3eb84fec53e",
      //     "parent_x": 4,
      //     "parent_y": 1,
      //     "id": "p-ed37c7eb-e057-4fa9-80a4-8f5a71ab8d1b",
      //     "created": {
      //       "user": "tsakach",
      //       "time": 1524515914
      //     },
      //     "updated": {
      //       "user": "tsakach",
      //       "time": 1524515914
      //     }
      //   }
      // ];
      // this.setState({
      //   virtual,
      //   physicals,
      //   error: null,
      //   loading: false
      // });
    }

    makeRequestable() {
      this.setState({
        requestable: true
      });
    }

	  render() {

      if(this.state.error) {
        return (
          <div>
            {this.state.error}
          </div>
        )
      }


      var freegenesStatus;
      var status = '';
      if(this.state.virtual && this.state.virtual.freegenes) {
        freegenesStatus = util.getFreegenesStatus(this.state.virtual);
        status = (<FreegenesStatus status={freegenesStatus} />);
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
          <div class="panel-block">
            <div class="virtual">
              <div>
                <p class="description">{this.state.virtual.description}</p>
              </div>
              {content}
              <div>
                <span style="font-weight:bold">Provenance:</span> {this.state.virtual.provenance || "Unknown"}
              </div>
              <div>
                <span style="font-weight:bold">Genotype:</span> {this.state.virtual.genotype || "None"}
              </div>
              <div>
                <span style="font-weight:bold">Sequence:</span> {this.state.virtual.sequence || "None"}
              </div>
              <div>
                <span style="font-weight:bold">Terms and condition:</span> {this.state.virtual.terms || "Limbo"}
              </div>
              <div>{timestamps}</div>
              <div>{sequence}</div>
            </div>
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
          <Link 
            to={'/inventory/'+this.state.physicals[i].id}
            class="panel-block"
          >
            <i class="mdi mdi-flask has-text-success"></i>&nbsp;&nbsp;{this.state.physicals[i].name}
          </Link>
        ));
      }


      if(!physicals.length) {
        physicals = (
          <div class="panel-block"><p>No physical instances</p></div>
        )
      }

      var requestLink = '';
      if(freegenesStatus === 'shipping' || this.state.requestable) {
        requestLink = (
          <p>
            <Link to={'/request/'+this.state.id}>Request this biomaterial</Link>
          </p>
        );
      }

      return (
        <div class="Virtual panel">
          <div class="columns">
            <div class="column is-6-desktop">


              <div class="panel-heading">
                {(this.state.virtual) ? (
                  <span><i class="mdi mdi-dna"></i>&nbsp;{this.state.virtual.name}</span>
                ) : (
                  <span><i class="mdi mdi-progress-download"></i>&nbsp;&nbsp;Loading</span>
                )}
                {(this.state.virtual) ? (
                  <div class="toolbox is-pulled-right">
                    <div class="buttons has-addons">
                      <Link 
                        class="button is-small is-link"
                        to={'/virtual/edit/' + this.state.virtual.id}
                      >
                        <i class="mdi mdi-pencil"></i>
                      </Link>
                      <a 
                        href=""
                        class="button is-small is-danger"
                        onClick={this.delVirtual.bind(this)}
                      >
                        <i class="mdi mdi-delete-variant"></i>
                      </a>
                    </div>
                  </div>   
                ) : null }         
              </div>
              {(this.state.virtual && this.state.virtual.freegenes) ? (
                  <div class="panel-block">
                  {status}
                </div>            
              ) : null }
            
              {virtual}
            
              <div class="panel-block">
                <h5 onDblClick={this.makeRequestable.bind(this)}>Physical Instances</h5>
              </div>
              {physicals}
              <div>
                {loading}
              </div>
              {requestLink}
            </div>
          </div>    
        </div>
      )
    }
  }
}


