
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

        app.remote.getPandadocStatus(function(err, status) {
          this.setState({
            pandadoc: status
          });
        }.bind(this));
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
      
      var pandadocStatus = (
          <p>Status unknown</p>
      );;
      if(this.state.pandadoc === 'disabled') {
        pandadocStatus = (
          <p>PandaDoc integration has not been enabled</p>
        );
      } else if(this.state.pandadoc === 'enabled') {
        pandadocStatus = (
            <p>
              PandaDoc integration is enabled but has not been authenticated.<br/>
              <a href="/pandadoc/login">Click here to authenticate</a>
            </p>
        );
      } else if(this.state.pandadoc === 'authenticated') {
        pandadocStatus = (
          <p>PandaDoc integration is enabled and authenticated</p>
        );
      }
      return (
        <div>
          <div>
            <h3>Connected peers</h3>
            <p></p>
            <ul>
              {peers}
            </ul>
          </div>
          <p></p>
          <div>
            <h3>Users</h3>
            <p></p>
            <ul>
              {users}
            </ul>
          </div>
          <p></p>
          <div>
          <Link to="/admin/create-user">Create user</Link>
          </div>
          <p></p>
          <div>
            <h3>PandaDoc integration</h3>
            {pandadocStatus}
          </div>
        </div>
      )
    }
  }
}

