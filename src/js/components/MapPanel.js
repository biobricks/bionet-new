import { h } from 'preact';
import ashnazg from 'ashnazg';

module.exports = function (Component) {

  const MapGrid = require('./MapGrid')(Component);

  return class MapPanel extends Component {

    constructor(props) {
      super(props);
      this.state = {};
      // this.onRecordMouseEnter = this.onRecordMouseEnter.bind(this);
      // this.onRecordMouseLeave = this.onRecordMouseLeave.bind(this);     
    }

    getHeadingIcon() {

    }
    // onRecordMouseEnter(e) {
    //   const hoveredRecordId = e.target.getAttribute('id');
    //   const type = this.props && this.props.type || null;
    //   let selectedRecord;
    //   switch (type) {
    //     case 'physical':
    //       selectedRecord = this.props.inventoryPath[this.props.inventoryPath.length - 2];
    //       break;
    //     case 'virtual':
    //       selectedRecord = this.props.inventoryPath[0];
    //       break;
    //     default:
    //       selectedRecord = this.props.inventoryPath[this.props.inventoryPath.length - 1];    
    //   }
    //   let hoveredRecord = null;
    //   for(let i = 0; i < selectedRecord.children.length; i++){
    //     if (selectedRecord.children[i].id === hoveredRecordId){
    //       hoveredRecord = selectedRecord.children[i];
    //     }
    //   }
    //   this.props.updateHoveredRecord(hoveredRecord);
    // }

    // onRecordMouseLeave(e) {
    //   const id = e.target.getAttribute('id');
    //   console.log(`On Mouse Leave: ${id}`);
    //   this.props.updateHoveredRecord(null);
    // }

    render() {
      const inventoryPath = this.props.inventoryPath || [];
      let selectedRecord = this.props.selectedRecord || {};
      const selectedRecordExists = Object.keys(this.props.selectedRecord).length > 0;
      let type = this.props.selectedRecord.type || 'container';
      const mode = this.props.mode || 'view';
      const parentRecord = this.props.parentRecord || {};
      
      // console.log(`MapPanel.render type: ${type}`);
      // console.log(`MapPanel.render parentRecord:`, parentRecord);
      
      let mapRecord;
      switch (type) {
        case 'lab':
          mapRecord = selectedRecord;
          break;
        case 'container':
          if (mode === 'edit') {
            mapRecord = parentRecord;
          } else {
            mapRecord = selectedRecord;
          }
          break;
        case 'physical':
          mapRecord = parentRecord;
          break;
        case 'virtual':
          mapRecord = inventoryPath[0];
          break;
        default:
          mapRecord = selectedRecord;      
      }
      
      let headingIcon;
      switch (mapRecord.type) {
        case 'lab':
          headingIcon = 'mdi mdi-home-outline';
          break;
        case 'container':
          headingIcon = 'mdi mdi-grid';
          break;
        case 'physical':
          headingIcon = 'mdi mdi-grid';
          break;
        case 'virtual':
          headingIcon = 'mdi mdi-home-outline';
          break;
        default:
          headingIcon = 'mdi mdi-grid';
      }
      const mapExpandIcon = this.props.mapFullScreen ? 'mdi mdi-arrow-collapse' : 'mdi mdi-arrow-expand';
      return (
        <div class="panel">
          <div class="panel-heading">
            <i class={headingIcon}/>&nbsp;
            {selectedRecordExists && mapRecord.name || 'Loading...'}
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

          <MapGrid 
            type={type}
            selectedRecord={ mapRecord }
            //selectedRecord={selectedRecord}
            // onRecordMouseEnter={this.onRecordMouseEnter}
            // onRecordMouseLeave={this.onRecordMouseLeave}
          />

        </div>
      );
    }

  }
}