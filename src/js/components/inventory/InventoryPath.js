import {
    h
}
from 'preact'

module.exports = function (Component) {
    
    return class InventoryPath extends Component {
        constructor(props) {
            super(props);
            //console.log('view props:', JSON.stringify(props))
            const inventoryPath = this.updateInventoryPath(this.props.inventoryPath)
            this.state = {
                inventoryPath:inventoryPath,
                inventoryItem:{}
            }
            
        }
        
        componentWillReceiveProps(nextProps)
        {
            this.updateInventoryPath(nextProps.inventoryPath)
        }
        
        updateInventoryPath(newPath) {
            //console.log('update inventory path:',newPath)
            if (!newPath) return
            const pathChild = "border: 1px solid grey; height:200px"
            const inventoryPath = [];
            for (var i=0; i<newPath.length; i++) {
                var id = 'path_'+i
                inventoryPath.push( <div id={id} key={id} class="tile is-child is-2" style={pathChild} /> )
            }
            this.inventoryPath = inventoryPath
            this.newPath = newPath.length
            this.setState({inventoryPath:inventoryPath, newPath:newPath.length})
            return inventoryPath
        }
        
        render() {
            
            const itemChild = "border: 1px solid grey; height:400px"
            const pathMaxHeight = "height: 200px;"
            const itemMaxHeight = "height: 600px;"
            const pathChild = "border: 1px solid grey; height:200px"
            
            //console.log('InventoryPath render:',this.state.inventoryPath)
            return (
                <div id="inventory_tiles" class="tile is-ancestor" style="position:relative; left:75px">
                    <div class="tile is-vertical is-10">
                        <div id="inventory_path" class="tile is-parent" style={pathMaxHeight}>
                            {this.state.inventoryPath}
                        </div>
                        <div id="inventory_item" class="tile is-parent" style={itemMaxHeight}>
                            <div id="i1" class="tile is-child is-4" style={itemChild} />
                            <div id="i2" class="tile is-child is-8" style={itemChild} />
                        </div>
                    </div>
                </div>
            )
        }
    }
}
