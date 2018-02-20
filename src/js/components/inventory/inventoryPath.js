import { h } from 'preact'
import ashnazg from 'ashnazg'

module.exports = function (Component) {
    
    const StorageContainer = require('./storageContainer')(Component)
    const EditPhysical = require('./editPhysical')(Component)
    const PrintLabel = require('../print')(Component)
    const ScanLabel = require('../scan')(Component)
    const EditTable = require('./editTable')(Component)
    
    return class InventoryPath extends Component {
        constructor(props) {
            super(props);
            //console.log('view props:', JSON.stringify(props))
            const inventoryPath = this.updateInventoryPath(this.props.inventoryPath)
            var containerSize = window.innerWidth/8
            containerSize = (containerSize > 150) ? 150: containerSize
            this.state = {
                inventoryPath:inventoryPath,
                inventoryItem:{},
                containerSize:containerSize
            }
            ashnazg.listen('global.inventoryFunction', this.inventoryFunction.bind(this));
        }
        
        componentWillReceiveProps(nextProps)
        {
            this.updateInventoryPath(nextProps.inventoryPath)

        }
        
        inventoryFunction(f) {
            console.log('inventoryFunction:',f)
            switch(f.name) {
                case 'clearSelection':
                    this.clearSelection(f.id)
                    break;
            }
        }
        
        clearSelection(id) {
            var path = this.inventoryPath
            for (var i=0; i<path.length; i++) {
                var container = path[i]
                /*
                if (container.getId()===id) {
                    container.deselectChildren()
                }
                */
            }
        }
        
        updateInventoryPath(newPath) {
            //console.log('update inventory path:',newPath)
            const containerSize = this.state.containerSize

            if (!newPath) return
            const pathChild = "height:"+this.state.containerSize+"px;margin:0px;padding:0;width:"+(containerSize+20)+"px;"
            const inventoryPath = []
            var selectedItem = null

            for (var i=0; i<newPath.length; i++) {
                var unit = newPath[i]
                var id = 'ipath_'+i
                var nextItemId = (i+1<newPath.length) ? newPath[i+1].id : null
                var px = 0, py = 0
                if (i+1<newPath.length) {
                    var nextUnit = newPath[i+1]
                    px = nextUnit.parent_x
                    py = nextUnit.parent_y
                }

                // todo switch to selected id
                if (unit.label==='box') selectedItem = unit
                inventoryPath.push(
                    <StorageContainer dbid={unit.id} type={unit.type} height={containerSize} width={containerSize} title={unit.name} childType={unit.child} xunits={unit.xUnits} yunits={unit.yUnits} items={unit.children} selectedItem={nextItemId} px={px} py={py}/>
                )
            }
            this.inventoryPath = inventoryPath
            this.newPath = newPath.length
            return inventoryPath
        }
        
        tabularHeader() {
            return(
                <div class="tile is-parent is-11"  style="padding:0; margin:0;font-weight:800">
                    <div class="tile is-child is-3" style="padding-left: calc(0.625em - 1px);">Name</div>
                    <div class="tile is-child is-3" style="padding-left: calc(0.625em - 1px);">Type</div>
                </div>
            )
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
            
        }
        
        selectedItemHeader() {
            const path = this.props.inventoryPath
            if (!path || path.length<1) return null
            const selectedItem = path[path.length-1]
            if (!selectedItem) return null
            window.history.pushState({ foo: "bar" }, selectedItem.name, "/inventory/"+selectedItem.id);
            /*
                        <a class="navbar-item" onclick={this.addFavorite.bind(this)}><i class="material-icons">add</i></a>
                        <a class="navbar-item" onclick={this.addFavorite.bind(this)}><i class="material-icons">edit</i></a>
                        <a class="navbar-item" onclick={this.addFavorite.bind(this)}><i class="material-icons">star</i></a>
                        <a class="navbar-item" onclick={this.addFavorite.bind(this)}><i class="material-icons">open_in_browser</i></a>
                        <a class="navbar-item" onclick={this.print.bind(this)}><i class="material-icons">print</i></a>
                        <a class="navbar-item" onclick={this.addFavorite.bind(this)}><i class="material-icons">delete</i></a>
            */
            return (
                <div class="navbar tile is-11" style="background-color:#f0f0f0;border: 1px solid black;margin-bottom:10px;">
                    <div class="tile is-7">
                        <div class="navbar-start">
                            <h1 class="title is-4" style="padding:12px">{selectedItem.name}</h1>
                        </div>
                    </div>
                    <div class="tile is-4">
                        <div class="navbar-end">
                            <a class="navbar-item" onclick={this.print.bind(this)}><i class="material-icons">print</i></a>
                        </div>
                    </div>
                </div>
            )
        }
        
        updateTabularData() {
            const path = this.props.inventoryPath
            if (!path || path.length<1) return null
            
            const unit = path[path.length-1]
            //console.log('updateTabularData:',unit)
            const items = unit.children
            
            if (items.length===0) {
                return (<div style="padding-left: calc(0.625em - 1px)">{unit.name} is empty.</div>)
            }
            const tabularElement=[]
            for (var i=0; i<items.length; i++) {
                var item = items[i]
                tabularElement.push(<EditPhysical state="enableEditPhysical" active="true" tabular="true" item={item} />)
            }
            return tabularElement
        }

        render() {
            
            //console.log(this.state.inventoryPath)
                    
            const path = this.props.inventoryPath
            if (!path) return
            const currentItem = path[path.length-1]
            var childItems = (currentItem) ? currentItem.children : null
            
            const selectedItemHeader = this.selectedItemHeader()
            const inventoryPath = this.updateInventoryPath(this.props.inventoryPath)
            
            //const tabularHeader = this.tabularHeader()
            //const tabularData = this.updateTabularData()
            
            const pathMaxHeight = "height: "+this.state.containerSize+"px;margin:0;padding:0;"
            const itemChild = "border:1px solid grey;margin:0;padding:0;"
            const itemMaxHeight = "margin:0;padding:0;height:calc(100vh - "+this.state.containerSize+"px - 40px)"
            const pathChild = "border: 1px solid grey; height:"+this.state.containerSize+"px;margin:0;padding:0;"
            const selectedItemElements = (this.state.selectedItem) ? this.state.selectedItem.items : null        
            const tableHeight =  window.innerHeight-this.state.containerSize-40
            //console.log('updateTabularData:',unit)
            
            return (
                <div id="inventory_tiles" class="tile is-12">
                    <div class="tile is-vertical">
                        <div id="inventory-header" class="tile is-parent is-12" style="margin:0;padding:0;">
                            {selectedItemHeader}
                        </div>
                        <div id="inventory_path" class="tile is-parent is-12" style={pathMaxHeight}>
                            {inventoryPath}
                        </div>
                        <br/>
                        <EditTable item={currentItem} items={childItems} height={tableHeight} />
                    </div>
                </div>
            )
        }
    }
}
