import { h } from 'preact';
import { Redirect, Link } from 'react-router-dom';

module.exports = function(Component) {

  return class ServerPanel extends Component {

    constructor(props) {
      super(props);
      this.state = {
        connected: true,
      };
    }

    render() {
      return (
        <div class="ServerPanel">
          <div class="columns is-centered">
            
            <div class="column is-12-mobile is-8-tablet is-6-desktop">
              <div class="panel">
                <div class="panel-heading has-text-centered">
                  <h3>Server Status</h3>
                </div>
                <div class="panel-block">
                  <div class="has-text-centered" style={{'margin': '0 auto'}}>
                    {(this.state.connected) ? (
                      <p>
                        Network: <span class="has-text-success">Connected</span>
                      </p>
                    ) : (
                      <p>
                        Network: <span class="has-text-danger">Disconnected</span>
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>    
        </div>
      )
    }
  }
}  