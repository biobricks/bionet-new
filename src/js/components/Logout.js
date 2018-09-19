
import {h} from 'preact';
import {Redirect} from 'react-router';

module.exports = function(Component) {

  return class Logout extends Component {
   
    constructor(props) {
      super(props);

      app.actions.user.logout(function(err) {
        if(err) return console.error(err);
      });
    };
    
	  render() {

      if(app.state.global.user) {
        return (
            <div>
            Logging out...
            </div>
        )
      } else {
        return (
          <Redirect to="/" />
        )
      }
    }
  }
}
