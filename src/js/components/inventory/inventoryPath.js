import { h } from 'preact'
import ashnazg from 'ashnazg'

module.exports = function (Component) {
    
    const StorageContainer = require('./storageContainer')(Component)
    const EditPhysical = require('./editPhysical')(Component)
    const PrintLabel = require('../print')(Component)
    const ScanLabel = require('../scan')(Component)
    const EditTable = require('./editTable')(Component)
    const MoveItem = require('./moveItem')(Component)
    
    return class InventoryPath extends Component {
        constructor(props) {
            super(props);
            //console.log('view props:', JSON.stringify(props))
            this.state = {
                inventoryPath:null,
                inventoryItem:{},
                containerSize:150
            }
            this.containerRef = {}
            app.state.selectCellListener = this.selectCellListener.bind(this)
        }
        
        componentWillReceiveProps(props) {
            if (!props.inventoryPath) return
        }
        
        selectCellListener(cellLocation) {
            console.log('selectCellListener:',cellLocation, this.props)
            for (var containerId in this.containerRef) {
                var container = this.containerRef[containerId]
                if (container.props.dbid===cellLocation.parentId) {
                    console.log('selectCellListener, container:',containerId,container)
                    container.selectCellListener(cellLocation)
                    break
                }
            }
            if (app.state.editContainerListener) app.state.editContainerListener(cellLocation, true)
        }
        
        updateInventoryPath(newPath) {
            if (!newPath) return
            //console.log('update inventory path:',newPath)
            
            var containerSize = window.innerWidth/8
            containerSize = (containerSize > 150) ? 150: containerSize
            if (!containerSize) containerSize = 150
            const thisModule = this
            const inventoryPath = []
            for (var i=0; i<newPath.length; i++) {
                var item = newPath[i]
                var nextItem = (i<newPath.length-1) ? newPath[i+1] : {}
                var yUnits = (item.type==='lab') ? item.children.length : item.yUnits
                var ref = (container) => { if (container) thisModule.containerRef[container.props.dbid] = container; }
                inventoryPath.push(
                    <StorageContainer dbid={item.id} type={item.type} ref={ref} height={containerSize} width={containerSize} title={item.name} childType={item.child} xunits={item.xUnits} yunits={yUnits} item={item} items={item.children} selectedItem={nextItem.id} px={nextItem.parent_x} py={nextItem.parent_y}/>
                )
            }
            this.inventoryPath = inventoryPath
            this.newPath = newPath.length
            return inventoryPath
        }
        
        print() {
            const path = this.props.inventoryPath
            if (!path || path.length<1) return null
            const item = path[path.length-1]
            if (!item) return
            const id = item.id
            const name = item.name
            app.actions.prompt.initRender(<PrintLabel/>)
            app.actions.prompt.display('Print label for '+name+'?', function(accept) {
                console.log('print item:',accept)
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
        
        updateMoveItem(item) {
            this.setState({moveItem:item})
        }
        
        selectedItemHeader() {
            const path = this.props.inventoryPath
            if (!path || path.length<1) return null
            const selectedItem = path[path.length-1]
            if (!selectedItem) return null
            const iconStyle = "font-size:20px;"
            var moveId = null
            var moveName = null
            const moveItem = app.state.global.moveItem
            if (moveItem) {
                moveId = moveItem.id
                moveName = moveItem.name
            }
            return (
                <div class="navbar tile is-11" style="background-color:#f0f0f0;border: 1px solid black;margin-bottom:10px;">
                    <div class="tile is-7">
                        <div class="navbar-start">
                            <h1 class="title is-5" style="padding:12px">{selectedItem.name}</h1>
                        </div>
                    </div>
                    <div class="tile">
                        <div class="navbar-end">
                            <MoveItem name={moveName} moveId={moveId} onclick={this.moveItem} />
                            <a class="navbar-item mdi mdi-printer"  style={iconStyle} onclick={this.print.bind(this)}></a>
                        </div>
                    </div>
                </div>
            )
        }
        
        render() {
            
            //const path = this.state.inventoryPath
            const path = this.updateInventoryPath(this.props.inventoryPath)
            if (!path) return
            
            const ipath = this.props.inventoryPath
            if (!ipath) return
            
            const currentItem = ipath[path.length-1]
            var childItems = (currentItem) ? currentItem.children : null
            //console.log('inventory path render:',ipath,currentItem)
            
            const selectedItemHeader = this.selectedItemHeader()
            
            const pathMaxHeight = "height: "+this.state.containerSize+"px;margin:0;padding:0;"
            const itemChild = "border:1px solid grey;margin:0;padding:0;"
            const itemMaxHeight = "margin:0;padding:0;height:calc(100vh - "+this.state.containerSize+"px - 40px)"
            const pathChild = "border: 1px solid grey; height:"+this.state.containerSize+"px;margin:0;padding:0;"
            const selectedItemElements = (this.state.selectedItem) ? this.state.selectedItem.items : null        
            const tableHeight =  window.innerHeight-this.state.containerSize-100
            
            return (
                <div id="inventory_tiles" class="tile is-12">
                    <div class="tile is-vertical">
                        <div id="inventory-header" class="tile is-parent is-12" style="margin:0;padding:0;">
                            {selectedItemHeader}
                        </div>
                        <div id="inventory_path" class="tile is-parent is-12" style={pathMaxHeight}>
                            {path}
                        </div>
                        <br/>
                        <EditTable item={currentItem} items={childItems} height={tableHeight} />
                    </div>
                </div>
            )
        }
    }
}
