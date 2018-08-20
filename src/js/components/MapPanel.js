import { h } from 'preact';
import ashnazg from 'ashnazg';

module.exports = function (Component) {

  return class MapPanel extends Component {

    constructor(props) {
      super(props);
      this.state = {};
    }

    render() {
      const inventoryPath = this.props && this.props.inventoryPath || [];
      let selectedRecord = this.props && this.props.selectedRecord || null;
      const type = this.props && this.props.type || null;
      let headingIcon;
      switch (type) {
        case 'lab':
          headingIcon = 'mdi mdi-home-outline';
          break;
        case 'container':
          headingIcon = 'mdi mdi-grid';
          break;
        case 'physical':
          headingIcon = 'mdi mdi-grid';
          // if physical change selected record to parent
          selectedRecord = inventoryPath[inventoryPath.length - 2];
          break;
        case 'virtual':
          headingIcon = 'mdi mdi-home-outline';
          // if virtual change selected record to lab
          selectedRecord = inventoryPath[0];
          break;
        default:
          headingIcon = 'mdi mdi-grid';
      }
      const mapExpandIcon = this.props.mapFullScreen ? 'mdi mdi-arrow-collapse' : 'mdi mdi-arrow-expand';
      return (
        <div class="panel">
          <div class="panel-heading">
            <i class={headingIcon}/>&nbsp;
            {selectedRecord && selectedRecord.name || 'Loading...'}
            <div class="PanelToolbar toolbox pull-right">
              <div class="buttons has-addons">
                <span 
                  class="button is-small is-primary"
                  mode="new"
                  onClick={this.props.toggleMapFullScreen}
                >
                  <i class={mapExpandIcon}></i>
                </span>
              </div>
            </div>  
          </div>
          <div class="panel-block">
            {selectedRecord && `${selectedRecord.name} Map` || 'Loading...'}
          </div>
        </div>
      );
    }

  }
}