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
                inventoryPathRendered:null,
                inventoryItem:{},
                containerSize:150,
                moveItem:app.state.inventory.moveItem,
                attributes:{}
                
            }
            this.containerRef = {}

          
          // TODO You are not allowed to directly modify the state.
          //      It must be done using .setState or .changeState
          //      You are also not allowed to put functions into the state.
            app.state.selectCellListener = this.selectCellListener.bind(this)
            app.state.inventory.listener.moveItem = this.updateMoveItem.bind(this)
        }
        
        componentWillReceiveProps(props) {
            if (!props.inventoryPath) return
            //if (props.id !== this.state.id) {
//                console.log('inventory path props:',props)

          this.setState({
            id: props.id,
            inventoryPath: props.inventoryPath
          });
        }
        
        selectCellListener(cellLocation) {
            //console.log('selectCellListener, inventoryPath',cellLocation, this.props)
            for (var containerId in this.containerRef) {
                var container = this.containerRef[containerId]
                if (containerId === cellLocation.parentId) {
                    //console.log('selectCellListener, container:',containerId,container.props.item.name)
                    container.selectCellListener(cellLocation)
                    break
                }
            }
            if (app.state.inventory.listener.editContainerListener) {
                //console.log('invoking editContainerListener')
                app.state.inventory.listener.editContainerListener(cellLocation, true)
            }
        }
        
        updateInventoryPath(newPath, id) {
            if (!newPath) return
            //console.log('update inventory path:',newPath)
            
            var containerSize = app.actions.inventory.getContainerSize()
            const thisModule = this
            const inventoryPath = []
            
            const findInChildren = function(id, children) {
                //console.log('findInChildren:',id,children)
                if (!children) return 0
                for (var i=0; i<children.length; i++) if (id===children[i].id) return i
                return 0
            }
            
            this.containerRef={}
            for (var i=0; i<newPath.length; i++) {
                var item = newPath[i]
                var nextItem = (i<newPath.length-1) ? newPath[i+1] : {}
                var yUnits = item.yUnits
                //var yUnits = (item.type==='lab') ? item.children.length : item.yUnits
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
            //this.focusCells(newPath)

            // FIXED You should not be putting HTML into the state.
            //      All HTML should be rendered from the state 
            //      in the render() function

/*          
            this.setState({
                id:id,
                inventoryPathRendered:inventoryPath
            })
*/
            return inventoryPath;
        }
        
        print() {
            const path = this.props.inventoryPath
            if (!path || path.length<1) return null
            const item = path[path.length-1]
            if (!item) return
            const id = item.id
            const name = item.name
            const promptComponent = (<PrintLabel/>)
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
        
        updateMoveItem(item) {
            //console.log('updateMoveItem:',item)
            this.setState({moveItem:item})
        }
        
        navigateParent(e) {
            const path = this.props.inventoryPath
            const selectedItem = path[path.length-1]
            if (!selectedItem) return null
            app.actions.inventory.selectInventoryId(selectedItem.parent_id)
        }
        
        selectedItemHeader() {
            const path = this.props.inventoryPath
            if (!path || path.length<1) return null
            const selectedItem = path[path.length-1]
            if (!selectedItem) return null
            const iconStyle = "font-size:20px;"
            const navArrowStyle = "font-size:20px;color:#808080;justify-content:center;margin-right:20px;cursor:pointer;"
            const navArrow = (path.length>1) ? (<span onclick={this.navigateParent.bind(this)} class={"mdi mdi-arrow-left"} style={navArrowStyle}/>) : null
            return (
                <div class="navbar tile is-11" style="background-color:#f0f0f0;border: 1px solid black;margin-bottom:10px;">
                    <div class="tile is-7">
                        <div class="navbar-start">
                            <h1 class="title is-5" style="padding:12px">{navArrow}{selectedItem.name}</h1>
                        </div>
                    </div>
                    <div class="tile">
                        <div class="navbar-end">
                            <MoveItem state="workbench" item={this.state.moveItem}/>
                            <a class="navbar-item mdi mdi-printer"  style={iconStyle} onclick={this.print.bind(this)}></a>
                        </div>
                    </div>
                </div>
            )
        }
        
        render() {

            const path = this.updateInventoryPath(this.state.inventoryPath, this.state.id);
//            console.log('render path:', path, this.state.inventoryPath)
            if (!path) return
            if (typeof this.state.inventoryPath === 'object' && this.state.inventoryPath.constructor.name === 'Error') {
                return (
                    <h6 style="margin-top:15px;">{this.state.inventoryPath.message}</h6>
                )
            }
            const ipath = this.state.inventoryPath
            if (!ipath) return
            
            const currentItem = ipath[path.length-1]
            var childItems = (currentItem) ? currentItem.children : null
//            console.log('inventory path render:',path,currentItem)
            const attributes = app.actions.inventory.getAttributesForType(currentItem.type)
            
            const selectedItemHeader = this.selectedItemHeader()
          
          // TODO We should use CSS classes instead of inline styles.
          // TODO We should generally use rem in instead of px
          //      (but border 1px is fine).
          // TODO Why is size based on a state variable? This seems bad.
            const pathMaxHeight = "height: "+this.state.containerSize+"px;margin:0;padding:0;"
            const itemChild = "border:1px solid grey;margin:0;padding:0;"

          // TODO we should avoid calc statements if at all possible
          //      (but sometimes it is not possible)
            const itemMaxHeight = "margin:0;padding:0;height:calc(100vh - "+this.state.containerSize+"px - 40px)"
            const pathChild = "border: 1px solid grey; height:"+this.state.containerSize+"px;margin:0;padding:0;"
            const selectedItemElements = (this.state.selectedItem) ? this.state.selectedItem.items : null        
          // TODO Again this should be CSS rules. Not calculated in javascript.
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
                        <EditTable item={currentItem} items={childItems} height={tableHeight} attributes={attributes}/>
                    </div>
                </div>
            )
        }
    }
}
