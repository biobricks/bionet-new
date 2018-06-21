import { h } from 'preact'
import ashnazg from 'ashnazg'
import LocationPath from './LocationPath'
import EditContainer from './EditContainer'
import ContainerPropertiesForm from './ContainerPropertiesForm'

module.exports = function (Component) {
    
    const StorageContainer = require('./storageContainer')(Component)
    const EditPhysical = require('./editPhysical')(Component)
    const PrintLabel = require('../print')(Component)
    const ScanLabel = require('../scan')(Component)
    const EditTable = require('./editTable')(Component)
    const Workbench = require('./workbench')(Component)
    
    const DataPanel = require('../data_panel.js')(Component);
    const MapPanel = require('../map_panel.js')(Component);
    
    return class InventoryPath extends Component {
        constructor(props) {
            super(props);
            //console.log('view props:', JSON.stringify(props))
            const currentItem = app.actions.inventory.getLastPathItem()
            this.state = {
                inventoryPathRendered:null,
                inventoryItem:{},
                containerSize:150,
                attributes:{},
                navMode:'navigate',
                editMode:false,
                editItem:currentItem
            }
            this.containerRef = {}

          
          // TODO You are not allowed to directly modify the state.
          //      It must be done using .setState or .changeState
          //      You are also not allowed to put functions into the state.
            app.state.selectCellListener = this.selectCellListener.bind(this)
        }
        
        componentWillReceiveProps(props) {
            if (!props.inventoryPath) return
            const currentItem = app.actions.inventory.getItemFromInventoryPath(props.id)
            this.setState({
                id: props.id,
                editItem:currentItem,
                inventoryPath: props.inventoryPath
            });
        }
        
        selectCellListener(cellLocation) {
            for (var containerId in this.containerRef) {
                var container = this.containerRef[containerId]
                container.selectCellListener(cellLocation)
            }
            if (app.state.inventory.listener.editContainerListener) {
                app.state.inventory.listener.editContainerListener(cellLocation, true)
            }
        }
        
        updateInventoryPath(newPath, id) {
            if (!newPath) return
            //console.log('update inventory path:',newPath)
            
            var containerSize = app.actions.inventory.getContainerSize()
            const thisModule = this
            var inventoryPath = []
            
            const findInChildren = function(id, children) {
                //console.log('findInChildren:',id,children)
                if (!children) return 0
                for (var i=0; i<children.length; i++) if (id===children[i].id) return i
                return 0
            }
            
            this.containerRef={}
            /*
            for (var i=0; i<newPath.length; i++) {
                var item = newPath[i]
                var nextItem = (i<newPath.length-1) ? newPath[i+1] : {}
                var yUnits = item.yUnits
                var ref = (container) => { if (container) thisModule.containerRef[container.props.dbid] = container; }
                var px=null
                var py=null
                if (nextItem.id) {
                    px = (nextItem.parent_x) ? nextItem.parent_x : 1
                    py = (nextItem.parent_y) ? nextItem.parent_y : findInChildren(nextItem.id,item.children)+1
                }

                inventoryPath.push(
                    <StorageContainer dbid={item.id} type={item.type} ref={ref} height={containerSize} width={containerSize} title={item.name} childType={item.child} xunits={item.xUnits} yunits={yUnits} item={item} selectedItem={nextItem.id} px={px} py={py}/>
                )
            }
            */
            if (!this.state.editMode) {
                const width=this.props.width
                const pathId={}
                var zoom=1.0
                newPath.map(container => {
                    pathId[container.id]=container.name
                })
                const locationPath = newPath.map(container => {
                    if (id===container.id) {
                        //zoom = (container.type==='lab') ? 0.5 : 1.5
                        zoom = (container.type==='lab') ? 0.5 : 1.0
                        return app.actions.inventory.initContainerProps(container,pathId,width,1)
                    }
                })
                inventoryPath = <LocationPath path={locationPath} width={this.state.mapPanelWidth} height={this.state.mapPanelHeight} zoom={zoom}/>
            } else {
                const pathId={}
                var zoomIndex=1
                newPath.map(container => {
                    pathId[container.id]=container.name
                })
                //const locationPath=app.actions.inventory.mapPathToGrid(newPath)
                var location=null
                for (var i=0; i<newPath.length; i++) {
                    location=newPath[i]
                    if (location.id===id) {
                        zoomIndex = (location.type==='lab') ? 1 : 1
                        break
                    }
                }
                const container = app.actions.inventory.initContainerProps(location,pathId,this.state.mapPanelWidth,1)
                inventoryPath = <EditContainer container={container} items={container.items} width={this.state.mapPanelWidth} height={this.state.mapPanelHeight} zoomIndex={zoomIndex}/>
            }
            return inventoryPath;
        }
        
        print() {
          const path = this.props.inventoryPath
          if (!path || path.length<1) return null
          const item = path[path.length-1]
          if (!item) return
          const id = item.id
          const name = item.name
          const callback = function(err, labelImageData, labelData) {
            console.log('print callback')
            item.label = labelData;
            app.actions.inventory.saveToInventory(item, labelImageData, true, function(err) {
              if(err) return app.actions.notify(err, "error");
              app.actions.notify("Label is printing!");
            })
          }

          const promptComponent = (<PrintLabel callback={callback} item={item}/>)

          app.actions.prompt.display('Print label for '+name+'?', promptComponent, function(accept) {
            //console.log('print item:',accept)
            if (accept) {
            }
          })
        }
        
        addFavorite() {
            const path = this.props.inventoryPath
            if (!path || path.length<1) return null
            const item = path[path.length-1]
            if (!item) return
            const id = item.id
            app.actions.inventory.addFavorite(id, function() {
                app.actions.notify("Item added to favorites", 'notice', 2000);
            })
        }
        
        navigateParent(e) {
            const path = this.props.inventoryPath
            const selectedItem = path[path.length-1]
            if (!selectedItem) return null
            app.actions.inventory.selectInventoryId(selectedItem.parent_id)
        }
        
        selectedItemHeader() {
            return null
            const path = this.props.inventoryPath
            if (!path || path.length<1) return null
            const selectedItem = path[path.length-1]
            if (!selectedItem) return null
            const iconStyle = "font-size:20px;"
            const navArrowStyle = "font-size:20px;color:#808080;justify-content:center;margin-right:20px;cursor:pointer;"
            const navArrow = (path.length>1) ? (<span onclick={this.navigateParent.bind(this)} class={"mdi mdi-arrow-left"} style={navArrowStyle}/>) : null
            const setNavMode = function(e) {
                this.setState({navMode:e.target.value})
            }
            /*
            return (
                <div class="navbar tile is-11" style="background-color:#f0f0f0;border: 1px solid black;margin-bottom:10px;">
                    <div class="tile is-7">
                        <div class="navbar-start">
                            <h1 class="title is-5" style="padding:12px">{navArrow}{selectedItem.name}</h1>
                        </div>
                    </div>
                    <div class="tile">
                        <div class="navbar-end">
                            <div class="navbar-item">
                                <input type="radio" id="navigate" name="navigate" value="navigate" onChange={setNavMode.bind(this)} checked={this.state.navMode==='navigate'}/>
                                <label style={{marginLeft:'5px'}} for="navigate">Navigate</label>
                            </div>

                            <div class="navbar-item">
                                <input type="radio" id="edit" name="edit" value="edit" onChange={setNavMode.bind(this)} checked={this.state.navMode==='edit'}/>
                                <label style={{marginLeft:'5px'}} for="edit">Edit</label>
                            </div>
            
                            <Workbench state="workbench"/>
                            <a class="navbar-item mdi mdi-printer"  style={iconStyle} onclick={this.print.bind(this)}></a>
                        </div>
                    </div>
                </div>
            )
            */
        }
        
        toggleEditMode() {
            if (this.state.editMode) {
                app.actions.inventory.refreshInventoryPath(this.state.id)
            }
            this.setState({editMode:!this.state.editMode})
        }

        onSaveEditClick() {
            /*
            app.actions.inventory.updateItem(this.state.containerId,function(err,item){
                var updatedItem={}
                if (props.width) {
                    const update = {
                        layoutWidthUnits:props.width,
                        layoutWidth: this.gridWidth*props.width
                    }
                    updatedItem = Object.assign(item,update)
                } else if (props.height) {
                    const update = {
                        layoutHeightUnits:props.height,
                        layoutHeight: this.gridHeight*props.height
                    }
                    updatedItem = Object.assign(item,update)
                } else {
                    updatedItem = Object.assign(item,props)
                }
                console.log('updateSelection:',updatedItem)
                return updatedItem
            }.bind(this))
            */
        }

        onUpdateContainerProperties(props) {
            if (!props.zoom) {
                /*
                app.actions.inventory.updateItem(this.state.containerId,function(err,item){
                    var updatedItem={}
                    if (props.width) {
                        const update = {
                            layoutWidthUnits:props.width,
                            layoutWidth: this.gridWidth*props.width
                        }
                        updatedItem = Object.assign(item,update)
                    } else if (props.height) {
                        const update = {
                            layoutHeightUnits:props.height,
                            layoutHeight: this.gridHeight*props.height
                        }
                        updatedItem = Object.assign(item,update)
                    } else {
                        updatedItem = Object.assign(item,props)
                    }
                    console.log('updateSelection:',updatedItem)
                    return updatedItem
                }.bind(this))
                */
            }
            console.log('onUpdateContainerProperties:',props)
            if (props.name) {
                this.setState({
                    layoutName: props.name
                })
            }
            if (props.width) {
                this.setState({
                    layoutWidthUnits:props.width,
                    layoutWidth: this.gridWidth*props.width
                })
            }
            if (props.height) {
                this.setState({
                    layoutHeightUnits:props.height,
                    layoutHeight: this.gridHeight*props.height
                })
            }
            if (props.majorGridLine) {
                this.setState({
                    majorGridLine: props.majorGridLine
                })
            }
            if (props.units) {
                this.setState({
                    units:props.units
                })
            }
            if (props.zoom) {
                this.setState({
                    zoom:props.zoom
                })
            }
        }
        onMapPanelMount(width,height) {
            this.setState({mapPanelWidth:width,mapPanelHeight:height})
        }

        render() {
            const path = this.updateInventoryPath(this.state.inventoryPath, this.state.id);
            //console.log('render path:', path, this.state.inventoryPath)
            if (!path) return
            
            //const currentItem = app.actions.inventory.getLastPathItem()
            const currentItem=this.state.editItem
            if (!currentItem) return
            
            if (typeof this.state.inventoryPath === 'object' && this.state.inventoryPath.constructor.name === 'Error') {
                return (
                    <h6 style="margin-top:15px;">{this.state.inventoryPath.message}</h6>
                )
            }
            
            var childItems = (currentItem) ? currentItem.children : null
            //console.log('inventory path render:',path,currentItem)
            const attributes = app.actions.inventory.getAttributesForType(currentItem.type)
            
            const selectedItemHeader = this.selectedItemHeader()
          
            const pathMaxHeight = "height: "+this.state.containerSize+"px;margin:0;padding:0;"
            const itemChild = "border:1px solid grey;margin:0;padding:0;"

            const itemMaxHeight = "margin:0;padding:0;height:calc(100vh - "+this.state.containerSize+"px - 40px)"
            const pathChild = "border: 1px solid grey; height:"+this.state.containerSize+"px;margin:0;padding:0;"
            const selectedItemElements = (this.state.selectedItem) ? this.state.selectedItem.items : null        
            const tableHeight =  window.innerHeight-this.state.containerSize-100
            /*
                      <DataPanel 
                        {...this.state}
                        onSaveNewClick={this.onSaveNewClick}
                        onSaveEditClick={this.onSaveEditClick}
                        onDeleteClick={this.onDeleteClick}
                        toggleEditMode={this.toggleEditMode}
                        toggleNewMode={this.toggleNewMode}
                      />
                                    <div id="inventory-header" class="tile is-parent is-5" style="margin:0;padding:0;">
                                        {selectedItemHeader}
                                    </div>
                                    <br/>
                                    <EditTable state="edittable" item={currentItem} items={childItems} height={tableHeight} attributes={attributes}/>
            */
            var dataItems = {}
            if (this.state.editMode) {
                dataItems=(<ContainerPropertiesForm
                            name={currentItem.name}
                            width={currentItem.layoutWidthUnits}
                            height={currentItem.layoutHeightUnits}
                            majorGridLine={currentItem.majorGridLine}
                            units={currentItem.units}
                            onChange={this.onUpdateContainerProperties.bind(this)}
                        />)

            } else {
                dataItems=(<EditTable state="edittable" item={currentItem} items={childItems} height={tableHeight} attributes={attributes}/>)
            }
            return (
                <div class="LabInventory">
                  <div class="columns is-desktop">
                    <div class="column is-7-desktop">
                      <DataPanel 
                        {...this.state}
                        selectedRecord={currentItem}
                        parentRecord={{}}
                        toggleEditMode={this.toggleEditMode.bind(this)}
                        onSaveEditClick={this.onSaveEditClick.bind(this)}
                        >
                        {dataItems}
                    </DataPanel>
                    </div>
                    <div class="column is-5-desktop">
                      <MapPanel
                        {...this.state}
                        selectedRecord={currentItem}
                        parentRecord={{}}
                        header={selectedItemHeader}
                        onMount={this.onMapPanelMount.bind(this)}
                        >
                            <div id="inventory_tiles" class="tile is-5">
                                <div class="tile is-vertical">
                                    <div id="inventory_path" class="tile is-parent is-5" style={pathMaxHeight}>
                                        {path}
                                    </div>
                                </div>
                            </div>
                      </MapPanel>
                    </div>
                  </div>
                </div>
                
            )
        }
    }
}
