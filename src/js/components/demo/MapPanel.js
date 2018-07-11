import {h} from 'preact';
import {Link} from 'react-router-dom';

module.exports = function(Component) {

  const MapGrid = require('./MapGrid.js')(Component);

  return class MapPanel extends Component {

    constructor(props) {
      super(props);
      this.state = {
        mapType: 'end to end'
      };
      this.toggleMapType = this.toggleMapType.bind(this);
    }

    toggleMapType(e) {
      let mapType = e.target.getAttribute('name');
      console.log(`switched to ${mapType}`);
      this.setState({ mapType });
    }

	  render() {
      let record = this.props.selectedRecord;
      let isContainer = Object.keys(record).indexOf('children') > -1;
          
      return (
        <div class="MapPanel panel has-background-white">
          
          <div class="panel-heading is-capitalized">
            <div class="is-block">

              {(isContainer) ? (
                <span><i class="mdi mdi-grid"></i> {this.props.selectedRecord.name}</span>
              ) : null }
              {(!isContainer) ? (
                <span><i class="mdi mdi-flask"></i> {this.props.parentRecord.name}</span>
              ) : null }

              {(this.state.mapType === 'end to end') ? (
                <div class="toolbox is-pulled-right">
                  <div class="buttons has-addons">
                    <span 
                      class="button is-small is-primary"
                      name="end to end"
                      onClick={this.toggleMapType}
                      disabled
                    >
                      <i class="mdi mdi-view-sequential" name="end to end"></i>
                    </span>
                    <span 
                      class="button is-small is-dark"
                      name="free form"
                      onClick={this.toggleMapType}
                    >
                      <i class="mdi mdi-view-quilt" name="free form"></i>
                    </span>
                  </div>
                </div>
              ) : (
                <div class="toolbox is-pulled-right">
                  <div class="buttons has-addons">
                    <span 
                      class="button is-small is-dark"
                      name="end to end"
                      onClick={this.toggleMapType}
                    >
                      <i class="mdi mdi-view-sequential" name="end to end"></i>
                    </span>
                    <span 
                      class="button is-small is-primary"
                      name="free form"
                      onClick={this.toggleMapType}
                      disabled
                    >
                      <i class="mdi mdi-view-quilt" name="free form"></i>
                    </span>
                  </div>
                </div>
              )}              

            </div>
          </div>
          
          {(this.state.mapType === 'end to end') ? (
            <div class="map-container">
              {(isContainer) ? (
                <MapGrid 
                  {...this.props}
                  record={this.props.selectedRecord}
                  selectRecord={this.props.selectRecord}
                />
              ) : null }
              {(!isContainer) ? (
                <MapGrid 
                  {...this.props}
                  record={this.props.parentRecord}
                  selectRecord={this.props.selectRecord}
                />
              ) : null }              
            </div>
          ) : (
            <div class="map-container">
              Free Form Component Goes Here
            </div>
          )}      
        </div>
      )
    }
  }
}
