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
    const LabPanel = require('../lab_panel.js')(Component);

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
        }

        componentWillReceiveProps(props) {
            if (!props.inventoryPath || props.id===this.state.id) return
            const currentItem = app.actions.inventory.getItemFromInventoryPath(props.id)
            this.setState({
                id: props.id,
                editItem:currentItem,
                inventoryPath: props.inventoryPath
            });
        }
        
        initZoom(panelWidth,layoutWidth) {
            const zoom = panelWidth/layoutWidth
            return isNaN(zoom) ? 1.0 : zoom
        }
        
        print() {
          const path = this.props.inventoryPath
          if (!path || path.length<1) return null
          const item = path[path.length-1]
          if (!item) return
          const id = item.id
          const name = item.name
          const callback = function(err, labelImageData, labelData) {
            //console.log('print callback')
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
        }
        
        toggleEditMode() {
            if (this.state.editMode) {
                app.actions.inventory.refreshInventoryPath(this.state.id)
            }
            this.setState({editMode:!this.state.editMode})
        }

        onSaveEditClick() {
        }

        onUpdateContainerProperties(props) {
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
            
            //console.log('onUpdateContainerProperties:',props)
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
        onEditPanelMount(width,height) {
            this.setState({editPanelWidth:width,editPanelHeight:height})
        }
        onNavPanelMount(width,height) {
            this.setState({mapPanelWidth:width,mapPanelHeight:height})
        }

        render() {
            if (!this.state.inventoryPath) return
            console.log('inventoryPath render, id:',this.state.id, this.state.inventoryPath)
            
            //const currentItem = app.actions.inventory.getLastPathItem()
            const currentItem=this.state.editItem
            if (!currentItem) return
            
            if (typeof this.state.inventoryPath === 'object' && this.state.inventoryPath.constructor.name === 'Error') {
                return (
                    <h6 style="margin-top:15px;">{this.state.inventoryPath.message}</h6>
                )
            }
            
            var childItems = (currentItem) ? currentItem.children : null
            const attributes = app.actions.inventory.getAttributesForType(currentItem.type)
            const selectedItemHeader = this.selectedItemHeader()
          
            const pathMaxHeight = "height: "+this.state.containerSize+"px;margin:0;padding:0;"
            const itemChild = "border:1px solid grey;margin:0;padding:0;"

            const itemMaxHeight = "margin:0;padding:0;height:calc(100vh - "+this.state.containerSize+"px - 40px)"
            const pathChild = "border: 1px solid grey; height:"+this.state.containerSize+"px;margin:0;padding:0;"
            const selectedItemElements = (this.state.selectedItem) ? this.state.selectedItem.items : null        
            const tableHeight =  window.innerHeight-this.state.containerSize-100

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
                dataItems=(
                    <div className="pure-form">
                        <div style={{marginTop:'20px'}}/>
                        <label>Name:</label>{currentItem.name}<br/>
                        <label>Description:</label>{currentItem.description}<br/>
                        <label>Width:</label>{currentItem.layoutWidthUnits}<br/>
                        <label>Height:</label>{currentItem.layoutHeightUnits}<br/>
                        <label>Units:</label>{currentItem.units}<br/>
                        <label>Grid Line:</label>{currentItem.majorGridLine}<br/>
                        <div style={{marginTop:'20px'}}/>
                        <EditTable state="edittable" item={currentItem} items={childItems} height={tableHeight} attributes={attributes}/>
                    </div>
                )
            }

            var dataPanel=null
            var navPanel=null
            var editPanel=null
            const breadcrumbs = this.state.inventoryPath.map(container => {
                return {
                    id:container.id,
                    name:container.name
                }
            })
            const selectRecord=function(e) {
                app.actions.inventory.refreshInventoryPath(e.target.id)
            }
            const parentRecord=app.actions.inventory.getItemFromInventoryPath(currentItem.parent_id)
            
            if (this.state.editMode) {
                const pathId={}
                var zoomIndex=1
                const newPath=this.state.inventoryPath
                const id=this.state.id
                newPath.map(container => {
                    pathId[container.id]=container.name
                })
                var location=null
                for (var i=0; i<newPath.length; i++) {
                    location=newPath[i]
                    if (location.id===id) {
                        break
                    }
                }
                if (!location) return
                var editPanelClass='is-12-desktop'
                var fullWidth=true
                if (location.type!=='lab') {
                    editPanelClass='is-5-desktop'
                    dataPanel = (
                            <div class="column is-7-desktop">
                              <DataPanel 
                                {...this.state}
                                selectedRecord={currentItem}
                                breadcrumbs={breadcrumbs}
                                parentRecord={parentRecord}
                                selectRecord={selectRecord}
                                toggleEditMode={this.toggleEditMode.bind(this)}
                                onSaveEditClick={this.onSaveEditClick.bind(this)}
                                >
                                {dataItems}
                            </DataPanel>
                        </div>
                    )
                }
                const containerLayout = app.actions.inventory.initContainerProps(location,pathId,this.state.editPanelWidth,1)
                const zoom = this.initZoom(this.state.editPanelWidth,containerLayout.layoutWidth)
                    
                editPanel = (
                    <div class={'column '+editPanelClass}>
                      <LabPanel
                        {...this.state}
                        selectedRecord={currentItem}
                        toggleEditMode={this.toggleEditMode.bind(this)}
                        parentRecord={{}}
                        header={selectedItemHeader}
                        onMount={this.onEditPanelMount.bind(this)}
                        >
                            <div id="inventory_tiles" class="tile is-12">
                                <div class="tile is-vertical">
                                    <div id="inventory_path" class="tile is-parent is-12" style={pathMaxHeight}>
                                        <EditContainer container={containerLayout} items={containerLayout.items} width={this.state.editPanelWidth} height={this.state.editPanelHeight} zoom={zoom} fullWidth={fullWidth}/>
                                    </div>
                                </div>
                            </div>
                      </LabPanel>
                    </div>
                )
            } else {
                
                const width=this.props.width
                const pathId={}
                const newPath=this.state.inventoryPath
                const id=this.state.id
                newPath.map(container => {
                    pathId[container.id]=container.name
                })
                var zoom=1.0
                const initZoom=this.initZoom
                const locationPath = newPath.map(container => {
                    if (id===container.id) {
                        var panelWidth=this.state.mapPanelWidth
                        const containerLayout=app.actions.inventory.initContainerProps(container,pathId,width,1)
                        zoom = initZoom(this.state.mapPanelWidth,containerLayout.layoutWidth)
                        return containerLayout
                    }
                })
                    
                dataPanel = (
                        <div class="column is-7-desktop">
                          <DataPanel 
                            {...this.state}
                            selectedRecord={currentItem}
                            breadcrumbs={breadcrumbs}
                            parentRecord={parentRecord}
                            selectRecord={selectRecord}
                            toggleEditMode={this.toggleEditMode.bind(this)}
                            onSaveEditClick={this.onSaveEditClick.bind(this)}
                            >
                            {dataItems}
                        </DataPanel>
                    </div>
                )
                navPanel = (
                    <div class="column is-5-desktop">
                      <MapPanel
                        {...this.state}
                        selectedRecord={currentItem}
                        parentRecord={{}}
                        header={selectedItemHeader}
                        onMount={this.onNavPanelMount.bind(this)}
                        >
                            <div id="inventory_tiles" class="tile is-5">
                                <div class="tile is-vertical">
                                    <div id="inventory_path" class="tile is-parent is-5" style={pathMaxHeight}>
                                        <LocationPath path={locationPath} width={this.state.mapPanelWidth} height={this.state.mapPanelHeight} zoom={zoom}/>
                                    </div>
                                </div>
                            </div>
                      </MapPanel>
                    </div>
                )
            }
            return (
                <div class="LabInventory">
                  <div id="panel-container" class="columns is-desktop">
                    {dataPanel}
                    {navPanel}
                    {editPanel}
                  </div>
                </div>
                
            )
        }
    }
}
