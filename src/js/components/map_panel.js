import {h} from 'preact';
import {Link} from 'react-router-dom';

module.exports = function(Component) {

  return class MapPanel extends Component {
    componentDidMount() {
        if (this.props.onMount) {
            const mapContainer = document.getElementById('map-panel')
            var containerWidth=450
            var containerHeight=600
            if (mapContainer) {
            containerWidth=mapContainer.offsetWidth-40
            containerHeight=mapContainer.offsetHeight-60
            }
            this.props.onMount(containerWidth,containerHeight)
          }
      }
	  render() {
      let record = this.props.selectedRecord;
      let isContainer = Object.keys(record).indexOf('children') > -1;
      return (
        <div id="map-panel" class="MapPanel panel has-background-white">
          <div className="panel-heading">
            {(isContainer) ? (
              <span>{this.props.selectedRecord.name}{this.props.header}</span>
            ) : (
              <span>{this.props.parentRecord.name}</span>
            )}
          </div>
          <div className="panel-block">
            <div class="map-container">{this.props.children}</div>
          </div>         
        </div>
      )
    }
  }
}
