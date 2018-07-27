import {h} from 'preact';
import {Link} from 'react-router-dom';

module.exports = function(Component) {

  const MapGrid = require('./MapGrid.js')(Component);

  return class MapPanel extends Component {

	  render() {
      let record = this.props.selectedRecord;
      //let isContainer = Object.keys(record).indexOf('children') > -1;
      let isContainer = record.layoutHeightUnits && record.layoutWidthUnits && record.layoutHeightUnits > 1 && record.layoutWidthUnits > 1;    
      return (
        <div class="MapPanel panel has-background-white">
          
          <div class="panel-heading is-capitalized">
            <div class="is-block">

              {(isContainer) ? (
                <span><i class="mdi mdi-grid"></i> {record.name}</span>
              ) : null }
              {(!isContainer) ? (
                <span><i class="mdi mdi-flask"></i> {record.name}</span>
              ) : null }            

            </div>
          </div>
          
     
          <div class="map-container">
            {(isContainer) ? (
              <MapGrid 
                {...this.props}
                record={this.props.selectedRecord}
                setHoveredRecord={this.props.setHoveredRecord}
              />
            ) : null }
            {(!isContainer) ? (
              <MapGrid 
                {...this.props}
                record={this.props.selectedRecord}
                setHoveredRecord={this.props.setHoveredRecord}
              />
            ) : null }              
          </div>
             
        </div>
      )
    }
  }
}
