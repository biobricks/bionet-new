import { h } from 'preact'
import ashnazg from 'ashnazg'

module.exports = function (Component) {
    const StorageContainer = require('./storageContainer')(Component)
    const EditPhysical = require('./editPhysical')(Component)
    return class InventoryPath extends Component {
        constructor(props) {
            super(props);
            //console.log('view props:', JSON.stringify(props))
            const inventoryPath = this.updateInventoryPath(this.props.inventoryPath)

            this.state = {
                inventoryPath:inventoryPath,
                inventoryItem:{},
                containerSize:150
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
            //const pathChild = "border: 1px solid blue; height:"+this.state.containerSize+"px;margin:10px;padding:10px;"
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
            //this.setState({inventoryPath:inventoryPath, selectedItem:selectedItem})
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
                               
        updateTabularData() {
            const path = this.props.inventoryPath
            if (!path || path.length<1) return null
            
            const unit = path[path.length-1]
            //console.log('updateTabularData:',unit)
            const items = unit.children
            const tabularElement=[]
            for (var i=0; i<items.length; i++) {
                var item = items[i]
                tabularElement.push(<EditPhysical state="enableEditPhysical" active="true" tabular="true" item={item} />)
            }
            return tabularElement
        }

        render() {
            
            //console.log(this.state.inventoryPath)
            if (!this.props.inventoryPath) return
            const inventoryPath = this.updateInventoryPath(this.props.inventoryPath)
            const tabularHeader = this.tabularHeader()
            const tabularData = this.updateTabularData()
            //calc(100vh - 40px);
            const pathMaxHeight = "height: "+this.state.containerSize+"px;margin:0;padding:0;"
            const itemChild = "border:1px solid grey;margin:0;padding:0;"
            const itemMaxHeight = "margin:0;padding:0;height:calc(100vh - "+this.state.containerSize+"px - 40px)"
            const pathChild = "border: 1px solid grey; height:"+this.state.containerSize+"px;margin:0;padding:0;"
            const selectedItemElements = (this.state.selectedItem) ? this.state.selectedItem.items : null        
            
            return (
                <div id="inventory_tiles" class="tile is-11">
                    <div class="tile is-vertical">
                        <div id="inventory_path" class="tile is-11 is-parent" style={pathMaxHeight}>
                            {inventoryPath}
                        </div>
                        <br/>
                        <div id="inventory_item" class="tile is-parent" style={itemMaxHeight}>
                            <div id="i1" class="tile is-child is-12" style="margin:0;padding:0;">
                                {tabularHeader}
                                {tabularData}
                            </div>
                        </div>
                    </div>
                </div>
            )
        }
    }
}
