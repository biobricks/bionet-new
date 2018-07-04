import {h} from 'preact';
import {Link} from 'react-router-dom';

module.exports = function(Component) {

  const MapGrid = require('./MapGrid.js')(Component);

  return class MapPanel extends Component {

	  render() {
      let record = this.props.selectedRecord;
      let isContainer = Object.keys(record).indexOf('children') > -1;
      let isEditMode = this.props.editMode;
      let isNewMode = this.props.newMode;    
      return (
        <div class="MapPanel panel has-background-white">
          <div className="panel-heading">
            {(isContainer) ? (
              <span>{this.props.selectedRecord.name}</span>
            ) : null }
            {(!isContainer) ? (
              <span>{this.props.parentRecord.name}</span>
            ) : null }
          </div>
          <div className="panel-block">
            <div id="nav-panel" class="map-container">
              <MapGrid 
                {...this.props}
              />
            </div>
          </div>         
        </div>
      )
    }
  }
}
