
import {h} from 'preact';
import {Link} from 'react-router-dom';
import util from '../util.js';

module.exports = function(Component) {

  var AccessDenied = require('./access_denied.js')(Component);
  var Loading = require('./loading.js')(Component);

  return class AdminEditUser extends Component {
   
    constructor(props) {
      super(props);

      this.state = {
        user: undefined
      };

      util.whenConnected(this.onConnected.bind(this));
    };

    delUser(e) {
      e.preventDefault();

      app.actions.user.del(this.state.user.username, this.state.user, function(err) {
        if(err) {
          this.changeState({
            error: this.state.error
          });
          return;
        }
        // TODO the notification never happens!
        app.actions.notify("User deleted successfully", 'success');
      });
    }

    back(e) {
      app.actions.route('/admin/edit-user/'+this.state.user.username);
    }

    onConnected() {

      var username = this.props.match.params.username;
      if(!username) {
        this.changeState({
          user: undefined
        });
      }

      app.actions.user.get(this.props.match.params.username, function(err, user) {
        if(err) {
          this.changeState({
            error: this.state.error
          });
          return;
        }
        this.changeState({
          user: user
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

      if(this.state.error) {
        return (
            <div>
            Error: {this.state.error.message}
          </div>
        );
      }

      if(!this.state.user) {
        return (
          <Loading />
        );
      }
      
      return (
        <div>
          <div>
            <h3>Are you sure you want to delete the user: {this.state.user.username}?</h3>
          </div>
          <div>
              <input type="button" value="Yes" onclick={this.delUser.bind(this)} />
              <input type="button" value="No" onclick={this.back.bind(this)} />
          </div>
        </div>
      )
    }
  }
}
