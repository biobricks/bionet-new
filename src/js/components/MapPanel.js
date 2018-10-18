import { h } from 'preact';
import ashnazg from 'ashnazg';
import { ForceGraph2D, ForceGraph3D } from 'react-force-graph';

module.exports = function (Component) {

  const MapGrid = require('./MapGrid')(Component);
  const Visualizer = require('./Visualizer')(Component);

  return class MapPanel extends Component {

    constructor(props) {
      super(props);

      this.state = {
        vis:app.actions.inventory.enableVisualizer(),
        inventoryPath: props.inventoryPath
      }
      // this.onRecordMouseEnter = this.onRecordMouseEnter.bind(this);
      // this.onRecordMouseLeave = this.onRecordMouseLeave.bind(this);     
      this.onCellDragStart = this.onCellDragStart.bind(this);
      this.onCellDragOver = this.onCellDragOver.bind(this);
      this.onCellDragEnd = this.onCellDragEnd.bind(this);
      this.onCellDrop = this.onCellDrop.bind(this);
    }

    componentWillReceiveProps(newProps) {
      this.setState({
        inventoryPath:newProps.inventoryPath
      })
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

    selectContainer(id) {
      console.log('visualizer selected record:',id)
      if (!id) return
      if (this.props.mode === 'edit') {
          var self=this
          app.actions.inventory.getInventoryPath(id, function(err,inventoryPath) {
              if (!err) {
                self.setState({
                  selectedRecord:id,
                  inventoryPath: inventoryPath
                })
              }
          })
      } else {
        app.state.history.push('/inventory/'+id+"?vis=true")
      }
    }

    moveItem() {
        console.log('moving item to:',this.props.selectedRecord.id, this.state.selectedRecord)
        /*
        app.actions.inventory.moveItemToContainer(id, this.state.selectedRecord,function(err){
          //update message
        })        
        */
    }

    render() {
      const inventoryPath = this.props.inventoryPath || [];
      let selectedRecord = this.props.selectedRecord || {};
      const selectedRecordExists = Object.keys(this.props.selectedRecord).length > 0;
      let type = this.props.selectedRecord.type || 'container';
      const mode = this.props.mode || 'view';
      const mapMode = this.props.mapMode || 'grid'
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
          mapRecord = this.props.parentVisible ? parentRecord : selectedRecord;
          break;
        case 'physical':
          mapRecord = parentRecord;
          break;
        case 'virtual':
          mapRecord = parentRecord;
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

      let graphInput = {
        nodes: [],
        links: []
      }
      let prevNode;
      for(let i = 0; i < inventoryPath.length; i++) {
        let pathItem = inventoryPath[i];
        let node = {
          "id": pathItem.id,
          "name": pathItem.name,
          "val": pathItem.type === 'lab' ? ((pathItem.layoutWidthUnits + pathItem.layoutHeightUnits) / 2) : (pathItem.type === 'container' ? (pathItem.xUnits + pathItem.yUnits) : 5)
        }
        let link = {
          "source": prevNode ? prevNode.id : null,
          "target": node.id
        };
        if (pathItem.type === 'lab'){
          console.log('Lab', inventoryPath[i]);
          graphInput.nodes.push(node);
          for (let j = 0; j < pathItem.children.length; j++){
            let child = pathItem.children[j];
            let childNode = {
              "id": child.id,
              "name": child.name,
              "val": child.type === 'container' ? (child.xUnits + child.yUnits) : 5
            };
            let childLink = {
              "source": pathItem.id,
              "target": child.id
            }
            let nextPathItem = inventoryPath[i + 1];
            try {

            if (childNode.id !== nextPathItem.id){
              graphInput.nodes.push(childNode);
              graphInput.links.push(childLink);
            }
          } catch (e) {}
        }
          prevNode = node; 
        }
        if (pathItem.type === 'container'){
          console.log('Container', inventoryPath[i]);
          graphInput.nodes.push(node);
          graphInput.links.push(link);
          prevNode = node;
        }
        if (pathItem.type === 'physical'){
          console.log('Physical', inventoryPath[i]);
          graphInput.nodes.push(node);
          graphInput.links.push(link);
          prevNode = node;          
        }
      }

      return (
        <div class="panel">
          {(Object.keys(mapRecord).length > 0) ? ( 
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
                  {(mapMode === 'grid') ? (
                    <span 
                      mode="2D"
                      class="button is-small is-secondary"
                      onClick={this.props.setMapMode}
                    >
                      2D
                    </span>                    
                  ) : null }
                  {(mapMode === '2D') ? (
                    <span 
                      mode="3D"
                      class="button is-small is-secondary"
                      onClick={this.props.setMapMode}
                    >
                      3D
                    </span>                    
                  ) : null }
                  {(mapMode === '3D') ? (
                    <span 
                      mode="grid"
                      class="button is-small is-secondary"
                      onClick={this.props.setMapMode}
                    >
                      Grid
                    </span>                    
                  ) : null }
                  {(mode === 'edit') ? (  
                    <span 
                      class="button is-small is-secondary"
                      onClick={this.moveItem.bind(this)}
                    >
                      <i class="mdi mdi-cursor-move"></i>
                    </span>
                  ) : null }
                  {(mode === 'edit' && selectedRecord.type === 'container') ? (  
                    <span 
                      class="button is-small is-secondary"
                      onClick={this.props.toggleParentVisible}
                    >
                      <i class={this.props.parentVisible ? 'mdi mdi-24px mdi-menu-down-outline' : 'mdi mdi-24px mdi-menu-up-outline'}></i>
                    </span>
                  ) : null }
                </div>
              </div>
            </div>
          ) : null }
          <div class="panel-block">

          </div>
          {(Object.keys(mapRecord).length > 0 && mapMode === 'grid') ? (       
              (this.state.vis) ? (
                <Visualizer
                  name="bionet_container"
                  diagram="bionet-container"
                  inventoryPath={inventoryPath}
                  inventoryTree={this.state.inventoryTree}
                  />
                ) : (
              <MapGrid 
              {...this.props}
              type={type}
              selectedRecord={ mapRecord }
              onCellDragStart={this.onCellDragStart}
              onCellDragOver={this.onCellDragOver}
              onCellDragEnd={this.onCellDragEnd}
              onCellDrop={this.onCellDrop}
              parentVisible={this.props.parentVisible}
              //selectedRecord={selectedRecord}
              // onRecordMouseEnter={this.onRecordMouseEnter}
              // onRecordMouseLeave={this.onRecordMouseLeave}
            />
            )
          ) : null }
          {(Object.keys(mapRecord).length > 0 && mapMode === '2D') ? (
            <div class="NodeGraph panel-block">
              {(this.state.vis) ? (
                (this.props.mapFullScreen) ? (
                  <div style="width:100%;display:flex">
                    <div style="width:60%;display:block;margin:12px;min-height:calc(100vh-40px)">
                      <Visualizer
                        name="tree"
                        diagram="tree"
                        inventoryPath={this.state.inventoryPath}
                        inventoryTree={this.state.inventoryTree}
                        onclick={this.selectContainer.bind(this)}
                      />
                    </div>
                    <div style="width:40%;display:block;margin:12px;min-height:calc(100vh-40px)">
                      <Visualizer
                        name="bionet_container"
                        diagram="bionet-container"
                        inventoryPath={this.state.inventoryPath}
                        inventoryTree={this.state.inventoryTree}
                        onclick={this.selectContainer.bind(this)}
                      />
                    </div>
                  </div>
                ) : (
                    <div style="width:100%;display:block;margin:12px;min-height:calc(100vh-40px)">
                      <Visualizer
                        name="tree"
                        diagram="tree"
                        inventoryPath={this.state.inventoryPath}
                        inventoryTree={this.state.inventoryTree}
                        onclick={this.selectContainer.bind(this)}
                      />
                    </div>
                  )
              ) : (
              <div class="d-block">
                <ForceGraph2D 
                 graphData={graphInput} 
                  style={{'height': '300px', 'width': '300px'}}
                  linkDirectionalArrowLength={3.5}
                  linkDirectionalArrowRelPos={1}
                  linkCurvature={0}
                  />
              </div>
              )
              }
            </div>
          ) : null }
          {(Object.keys(mapRecord).length > 0 && mapMode === '3D') ? (       
            <div class="NodeGraph panel-block">
              <div class="d-block">
                <ForceGraph3D 
                  graphData={graphInput} 
                  style={{'height': '300px', 'width': '300px'}}
                  linkDirectionalArrowLength={3.5}
                  linkDirectionalArrowRelPos={1}
                  linkCurvature={0}
                />
              </div>
            </div>
          ) : null }          
        </div>
      );
    }

  }
}