
import {h} from 'preact';

module.exports = function(Component) {

  return class AccessDenied extends Component {


	  render() {
      var reason;
      if(this.props.group) {
        reason = (
            <h3>Only users in the {this.props.group} group can access this page.</h3>
        )
      } else if(this.props.reason) {
        reason = (
            <h3>{this.props.reason}.</h3>
        )

      } else if(!app.state.global.user) {
        reason = (
            <h3>You must be logged in to access this page.</h3>
        )        
      } else {

        reason = (
            <h3>You do not have the required permissions to access this page.</h3>
        )
      }

      return (
        <div>
          <h1>Access Denied</h1>
          {reason}
        </div>
      )
    }           


  }
}
