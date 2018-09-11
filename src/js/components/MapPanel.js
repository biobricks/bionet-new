import { h } from 'preact';
import ashnazg from 'ashnazg';

module.exports = function (Component) {

  const MapGrid = require('./MapGrid')(Component);

  return class MapPanel extends Component {

    constructor(props) {
      super(props);
      this.state = {
        parentVisible: false
      };
      // this.onRecordMouseEnter = this.onRecordMouseEnter.bind(this);
      // this.onRecordMouseLeave = this.onRecordMouseLeave.bind(this);  
      this.toggleParentVisible = this.toggleParentVisible.bind(this);   
      this.onCellDragStart = this.onCellDragStart.bind(this);
      this.onCellDragOver = this.onCellDragOver.bind(this);
      this.onCellDragEnd = this.onCellDragEnd.bind(this);
      this.onCellDrop = this.onCellDrop.bind(this);
    }

    toggleParentVisible() {
      this.setState({
        parentVisible: !this.state.parentVisible
      });
    }

    onCellDragStart(e) {
      //console.log('onCellDragStart');
      let selectedRecord = this.props.selectedRecord;
      let children = selectedRecord.children || [];
      let draggedCell;
      
      for(let i = 0; i < children.length; i++){
        let child = children[i];
        if(String(child.id) === String(e.target.id)){
          draggedCell = child;
        }
      }
      //console.log('draggedCell: ', draggedCell);
      e.dataTransfer.setData("draggedCell", JSON.stringify(draggedCell));
    }

    onCellDragOver(e) {
      e.preventDefault();
    }

    onCellDragEnd(e) {
      //console.log('onCellDragEnd');  
    }

    onCellDrop(e) {
      //console.log('onCellDrop');
      const draggedCell = JSON.parse(e.dataTransfer.getData("draggedCell"));
      const targetCellRow = Number(e.target.getAttribute('row'));
      const targetCellColumn = Number(e.target.getAttribute('col'));
      const targetCellPosition = Number(e.target.getAttribute('pos'));
      //console.log(`Cell ${draggedCell.name} dragged and dropped to ${targetCellColumn}, ${targetCellRow}`);
      //console.log(`Replacing ${draggedCell.parent_x},${draggedCell.parent_y} with ${targetCellColumn}, ${targetCellRow} - grid index ${targetCellPosition - 1}`);
      // a child of the selected record has been dragged and dropped
      // need to replace the parent_x and parent_y attributes of the child
      draggedCell.parent_x = targetCellColumn;
      draggedCell.parent_y = targetCellRow;
      this.props.moveItem(draggedCell);
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
      //const selectedRecordNameShort = selectedRecordExists && selectedRecord.name.length <= 13 ? selectedRecord.name : selectedRecord.name.substr(0, 10) + '...';
      //const parentRecordNameShort = parentRecord && parentRecord.name.length <= 13 ? parentRecord.name : parentRecord.name.substr(0, 10) + '...';
      // console.log(`MapPanel.render type: ${type}`);
      // console.log(`MapPanel.render parentRecord:`, parentRecord);
      
      let mapRecord;
      switch (type) {
        case 'lab':
          mapRecord = selectedRecord;
          break;
        case 'container':
          mapRecord = this.state.parentVisible ? parentRecord : selectedRecord;
          break;
        case 'physical':
          mapRecord = parentRecord;
          break;
        case 'virtual':
          mapRecord = null;
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
                {(mode === 'edit') ? (  
                  <span 
                    class="button is-small is-secondary"
                    onClick={this.toggleParentVisible}
                  >
                    <i class={this.state.parentVisible ? 'mdi mdi-24px mdi-menu-down-outline' : 'mdi mdi-24px mdi-menu-up-outline'}></i>
                  </span>
                ) : null }
              </div>
            </div>
          </div>

          <MapGrid 
            {...this.props}
            type={type}
            selectedRecord={ mapRecord }
            onCellDragStart={this.onCellDragStart}
            onCellDragOver={this.onCellDragOver}
            onCellDragEnd={this.onCellDragEnd}
            onCellDrop={this.onCellDrop}
            parentVisible={this.state.parentVisible}
            //selectedRecord={selectedRecord}
            // onRecordMouseEnter={this.onRecordMouseEnter}
            // onRecordMouseLeave={this.onRecordMouseLeave}
          />

        </div>
      );
    }

  }
}