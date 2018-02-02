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
                inventoryPath:[],
                rootItem:{}
            };
            this.rootItem = null
            console.log('initializing inventory: user', app.state.global.user)
            ashnazg.listen('global.inventoryPath', this.inventoryPathListener.bind(this));
            ashnazg.listen('global.user', this.loggedInUser.bind(this));
        }

        componentDidMount() {
            //console.log('inventory component mounted')
            app.actions.inventory.getPath(1)
            app.actions.inventory.getInventoryTypes()
        }
        
        loggedInUser(loggedInUser) {
            console.log('logged in inventory: user', loggedInUser, app.remote)
            if (!(loggedInUser)) return

            app.actions.inventory.getRootItem(function(rootItem) {
                console.log('getRootItem:', rootItem)
                if (rootItem) {
                    this.rootItem = rootItem
                    app.actions.inventory.getInventoryPath(rootItem.id, function(inventoryPath){
                        console.log('inventoryPath: ', inventoryPath)
                    })
                }
            }.bind(this))
        }
        
        inventoryPathListener(newPath) {
                console.log("global inventoryPath just changed to:", newPath);
                //this.setState({inventoryPath:newPath})
        }
        
        addMenuListener(newMenu) {
                //console.log("global inventoryNav just changed to:", app.state.global.inventoryNav, newMenu);
                //todo: parameter does not return correct value of app.state.global.inventoryNav
                this.setState({addMenu:app.state.global.inventoryNav})
        }
        
        render() {
            console.log('inventory render, state:',this.state)
                    //<InventoryPath state="inventoryPath" inventoryPath={this.state.inventoryPath}/>
                    //<ActionNavbar state="inventoryNav" menu={this.state.addMenu.addMenuLocations}/>
            return ( 
                <div id="inventory_view" class="tile is-ancestor">
                    <ActionNavbar state="inventoryNav" menu={app.state.global.inventoryNav}/>
                    <InventoryPath state="inventoryPath" inventoryPath={app.state.global.inventoryPath}/>
                </div>
            )
        }
    }
}
