
import {h} from 'preact';

module.exports = function(Component) {

  return class PersistentNotify extends Component {

    constructor(props) {
      super(props);

    }

    
	  render() {
//      console.log("APP.STATE.GLOBAL", app.state.global);

      if(!app.state.global.connection || app.state.global.connection.state !== 'retrying')  return '';

      var msg = '';
      if(!this.state.msg && this.state.time >= 0) {
        msg = "Will attempt to reconnect in " + this.state.time + " seconds.";
      } else {
        msg = this.state.msg;
      }

      return (
        <div class="persistent-notify is-danger">
          <div class="hcenter">
            Disconnected from server. {msg}
          </div>
        </div>
      )
    }
  }
}
