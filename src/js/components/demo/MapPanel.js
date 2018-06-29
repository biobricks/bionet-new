import {h} from 'preact';
import {Link} from 'react-router-dom';

module.exports = function(Component) {

  return class MapPanel extends Component {

	  render() {
      let record = this.props.selectedRecord;
      let isContainer = Object.keys(record).indexOf('children') > -1;
      return (
        <div class="MapPanel panel has-background-white">
          <div className="panel-heading">
            {(isContainer) ? (
              <span>{this.props.selectedRecord.name}</span>
            ) : (
              <span>{this.props.parentRecord.name}</span>
            )}
          </div>
          <div className="panel-block">
            <div id="nav-panel" class="map-container">

            </div>
          </div>         
        </div>
      )
    }
  }
}
