import {h} from 'preact';
import {Link} from 'react-router-dom';

module.exports = function(Component) {
    
      const Workbench = require('./inventory/workbench')(Component)

  return class MapPanel extends Component {

    componentDidMount() {
        if (this.props.onMount) {
            const mapContainer = document.getElementById('map-panel-item')
            var containerWidth=450
            var containerHeight=600
            if (mapContainer) {
                containerWidth=mapContainer.offsetWidth
                containerHeight=mapContainer.offsetHeight
            }
            this.props.onMount(containerWidth,containerHeight)
        }
      }
	  render() {   
      let record = this.props.selectedRecord;
      let isContainer = this.props.selectedRecord.type !== 'physical'
      //let isContainer = Object.keys(record).indexOf('children') > -1;
      //<span>{this.props.parentRecord.name}</span>
      return (
        <div id="map-panel" class="MapPanel panel has-background-white">
          <div className="panel-heading">
            {(isContainer) ? (
              <span>{this.props.selectedRecord.name}{this.props.header}</span>
            ) : (
              <span>{this.props.selectedRecord.name}</span>
            )}
            <div class="toolbox is-pulled-right">
                <div class="buttons has-addons">
                    <Workbench state="workbench" />
                </div>
            </div>
          </div>
          <div className="panel-block">
            <div id="map-panel-item" class="map-container">{this.props.children}</div>
          </div>         
        </div>
      )
    }
  }
}
