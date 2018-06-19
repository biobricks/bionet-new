import {h} from 'preact';
import {Link} from 'react-router-dom';

module.exports = function(Component) {

  return class MapPanel extends Component {
	  render() {
      return (
        <div class="MapPanel panel has-background-white">
          <div className="panel-heading">
            Map Panel
          </div>
          <div className="panel-block">
            Map Area
          </div>          
          <div className="panel-block">
            Status
          </div>          
        </div>
      )
    }
  }
}
