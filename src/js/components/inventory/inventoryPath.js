import { h } from 'preact'
import ashnazg from 'ashnazg'

module.exports = function (Component) {
    const StorageContainer = require('./storageContainer')(Component)
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
            return
            var path = this.state.inventoryPath
            for (var i=0; i<path.length; i++) {
                var container = path[i]
                if (container.getId()===id) {
                    container.deselectChildren()
                }
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
                    <div id={id} key={id} class="tile is-child is-2" style={pathChild}>
                        <StorageContainer dbid={unit.id} height={containerSize} width={containerSize} title={unit.name} childType={unit.child} xunits={unit.xUnits} yunits={unit.yUnits} items={unit.children} selectedItem={nextItemId} px={px} py={py}/>
                    </div>
                )
            }
            this.inventoryPath = inventoryPath
            this.newPath = newPath.length
            this.setState({inventoryPath:inventoryPath, selectedItem:selectedItem})
            return inventoryPath
        }

        render() {
            //console.log(this.state.inventoryPath)
            if (!this.state.inventoryPath) return
            
            //calc(100vh - 40px);
            
            const pathMaxHeight = "height: "+this.state.containerSize+"px;margin:0;padding:0;"
            const itemChild = "border:1px solid grey;margin:0;padding:0;"
            const itemMaxHeight = "margin:0;padding:0;"
            const pathChild = "border: 1px solid grey; height:"+this.state.containerSize+"px;margin:0;padding:0;"
            const selectedItemElements = (this.state.selectedItem) ? this.state.selectedItem.items : null        
            
            return (
                <div id="inventory_tiles" class="tile is-11" style="">
                    <div class="tile is-vertical">
                        <div id="inventory_path" class="tile is-11 is-parent" style={pathMaxHeight}>
                            {this.state.inventoryPath}
                        </div>
                        <div id="inventory_item" class="tile is-parent" style={itemMaxHeight}>
                            <div id="i1" class="tile is-child is-12" style={itemChild} />
                        </div>
                    </div>
                </div>
            )
        }
    }
}
