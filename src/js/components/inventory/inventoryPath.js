import {
    h
}
from 'preact'

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
        }
        
        componentWillReceiveProps(nextProps)
        {
            this.updateInventoryPath(nextProps.inventoryPath)
        }
        
        updateInventoryPath(newPath) {
            console.log('update inventory path:',newPath)
            const containerSize = this.state.containerSize-20

            if (!newPath) return
            const pathChild = "height:"+this.state.containerSize+"px;margin:0px;padding:0;"
            //const pathChild = "border: 1px solid blue; height:"+this.state.containerSize+"px;margin:10px;padding:10px;"
            const inventoryPath = [];
            for (var i=0; i<newPath.length; i++) {
                var unit = newPath[i]
                var id = 'path_'+i
                inventoryPath.push( 
                    <div id={id} key={id} class="tile is-child is-2" style={pathChild}>
                        <StorageContainer height={containerSize} width={containerSize} title={unit.label} childType={unit.child} xunits={unit.x} yunits={unit.y} items={unit.items}/>
                    </div>
                )
            }
            this.inventoryPath = inventoryPath
            this.newPath = newPath.length
            this.setState({inventoryPath:inventoryPath, newPath:newPath.length})
            return inventoryPath
        }

        render() {
            
            const itemChild = "border: 1px solid grey; height:400px;margin:0;padding:0;"
            const pathMaxHeight = "height: "+this.state.containerSize+"px;width:"+(this.state.containerSize+30)*this.state.inventoryPath.length+"px;margin:0;padding:0;"
            const itemMaxHeight = "height: 600px;margin:0;padding:0;"
            const pathChild = "border: 1px solid grey; height:"+this.state.containerSize+"px;margin:0;padding:0;"
            
            //console.log('InventoryPath render:',this.state.inventoryPath)
            return (
                <div id="inventory_tiles" class="tile is-ancestor" style="position:relative; left:75px">
                    <div class="tile is-vertical">
                        <div id="inventory_path" class="tile is-parent" style={pathMaxHeight}>
                            {this.state.inventoryPath}
                        </div>
                        <div id="inventory_item" class="tile is-parent" style={itemMaxHeight}>
                            <div id="i1" class="tile is-child is-8" style={itemChild} />
                            <div id="i2" class="tile is-child is-4" style={itemChild}>
                                <StorageContainer title="box" height="300" width="300" xunits="10" yunits="10" childType="well" />
                            </div>
                        </div>
                    </div>
                </div>
            )
        }
    }
}
