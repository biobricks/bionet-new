
import {h} from 'preact';
import {Link} from 'react-router-dom';
import util from '../util.js';

module.exports = function(Component) {

  var AccessDenied = require('./access_denied.js')(Component);
  var AdminEditUser = require('./admin_edit_user.js')(Component)
  var AdminCreateUser = require('./admin_create_user.js')(Component)

  return class Admin extends Component {
   
    constructor(props) {
      super(props);

      this.state = {
        peers: [],
        users: []
      };
    };

    componentDidMount() {

      util.whenConnected(function() {
        this.componentDidMount();
      }.bind(this));

      var self = this;
      app.actions.p2p.getPeers(function(err, peers) {
        if(err) {
          self.changeState({
            peers: "Failed to get list of peers"
          });
          return;
        }

       self.changeState({peers});
      });

      var users = [];
      var s = app.actions.user.list();
      s.on('data', function(user) {
        users.push(user);
        this.changeState({
          users: users
        });
      }.bind(this));
    };

        
	  render() {
      var user = app.state.global.user;
      if(!user) {
        return (<AccessDenied />);
      } else if(!util.user.isInGroup('admin')) {
        return (<AccessDenied group="admin" />);
      }


      var peers = (
        <li>Waiting for peer list</li>
      );

      if(typeof this.state.peers === 'string') {
        peers = (
            <li>{this.state.peers}</li>
        );
      } else if(typeof this.state.peers === 'object') {
        peers = []
        var key, peer;
        for(key in this.state.peers) {
          peer = this.state.peers[key];
          peers.push((
            <li>
              URL: <a href={key}>{key}</a> | Hostname: {peer.hostname} | Port: {peer.port}
            </li>
          ));
        }
      }

      var users = [];
      var i, u, editlink;
      for(i=0; i < this.state.users.length; i++) {
        u = this.state.users[i].value;
        
        users.push((
          <li>
            User: {u.username} | Email: {u.email} | <Link to={"/admin/edit-user/"+encodeURIComponent(u.username)}>edit</Link>
          </li>
        ));
      }
      

      return (
        <div>
          <div>
            <h3>Connected peers:</h3>
            <ul>
              {peers}
            </ul>
          </div>
          <div>
            <h3>Users:</h3>
            <ul>
              {users}
            </ul>
          </div>
          <div>
          <Link to="/admin/create-user">Create user</Link>
          </div>
        </div>
      )
    }
  }
}

