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
            //console.log('initializing inventory: user', app.state.global.user)
            ashnazg.listen('global.user', this.loggedInUser.bind(this));
        }

        componentDidMount() {
            //console.log('inventory component mounted')
            app.actions.inventory.getInventoryTypes()
        }
        
        loggedInUser(loggedInUser) {
            //console.log('logged in inventory: user', loggedInUser, app.remote)
            if (!(loggedInUser)) return

            app.actions.inventory.getRootItem(function(rootItem) {
                //console.log('getRootItem:', rootItem)
                if (rootItem) {
                    this.rootItem = rootItem
                    app.actions.inventory.getInventoryPath(rootItem.id, function(inventoryPath){
                        //console.log('inventoryPath: ', inventoryPath, app.state.global.inventoryLocationPath)
                    })
                }
            }.bind(this))
        }
        
        render() {
            //console.log('inventory render, state:',this.state)
            return ( 
                <div id="inventory_view" class="tile is-ancestor">
                    <ActionNavbar state="inventoryNav" menu={app.state.global.inventoryTypes}/>
                    <InventoryPath state="inventoryPath" inventoryPath={app.state.global.inventoryPath}/>
                </div>
            )
        }
    }
}
