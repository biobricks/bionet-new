import {
    h
}
from 'preact'
import ashnazg from 'ashnazg'

module.exports = function (Component) {
    
    var ActionNavbar = require('./actionNavbar')(Component);
    var InventoryPath = require('./inventoryPath')(Component);
    
    return class Inventory extends Component {

        constructor(props) {
            super(props);
            
            this.state = {
                rootId:null,
                selectedItemId:null,
                addMenu:{},
                inventoryPath:[]
            };

            ashnazg.listen('global.inventoryPath', this.inventoryPathListener.bind(this));
            ashnazg.listen('global.inventoryNav', this.addMenuListener.bind(this));
        }
    
        componentDidMount() {
            //console.log('inventory component mounted')
            
            app.actions.inventory.getPath(1)
            app.actions.inventory.getInventoryTypes()
        }

        
        inventoryPathListener(newPath) {
                //console.log("global inventoryPath just changed to:", newPath);
                this.setState({inventoryPath:newPath})
        }
        
        addMenuListener(newMenu) {
                //console.log("global inventoryNav just changed to:", app.state.global.inventoryNav, newMenu);
                //todo: parameter does not return correct value of app.state.global.inventoryNav
                this.setState({addMenu:app.state.global.inventoryNav})
        }
        
        render() {
            console.log('inventory render, state:',this.state)
            return ( 
                <div id="inventory_view">
                    <ActionNavbar state="inventoryNav" menu={this.state.addMenu.addMenuLocations}/>
                    <InventoryPath state="inventoryPath" inventoryPath={this.state.inventoryPath}/>
                </div>
            )
        }
    }
}
