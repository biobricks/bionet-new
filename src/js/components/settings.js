
import {h} from 'preact';
import {Link} from 'react-router-dom';
import util from '../util.js';

module.exports = function(Component) {

  var AccessDenied = require('./access_denied.js')(Component);

  return class Settings extends Component {
   
    constructor(props) {
      super(props);

      this.state = {
      };
    };

    componentDidMount() {

    };

        
	  render() {
      var user = app.state.global.user;
      if(!user) {
        return (<AccessDenied />);
      }

      return (
        <div>
          <p>Not yet implemented. For now contact the administrator if you need to change your email, username or password.</p>
        </div>
      )
    }
  }
}
