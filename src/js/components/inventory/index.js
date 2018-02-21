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
            ashnazg.listen('global.user', this.loggedInUser.bind(this));
        }

        componentDidMount() {
            //console.log('inventory component mounted')
            app.actions.inventory.getInventoryTypes()
        }
        
        loggedInUser(loggedInUser) {
            //console.log('logged in inventory: user', loggedInUser, app.remote)
            if (!(loggedInUser)) return
            const id = (this.props.match) ? this.props.match.params.id : null
            if (id) {
                app.actions.inventory.getInventoryPath(id, function(inventoryPath){
                    const item = inventoryPath[id]
                    //const item = app.actions.inventory.getItemFromInventoryPath(id, inventoryPath)
                    console.log('logged in inventory: id', id, item, inventoryPath)
                    app.actions.inventory.selectCell(item.id, item.parent_id, item.parent_x, item.parent_y, false)
                })
            } else {
                console.log('logged in inventory: no id', this)
                app.actions.inventory.getRootItem(function(item) {
                    if (item) {
                        app.actions.inventory.getInventoryPath(item.id, function(inventoryPath){})
                        app.actions.inventory.selectCell(item.id, item.parent_id, item.parent_x, item.parent_y, false)
                    }
                }.bind(this))
            }
        }
        
        render() {
            return ( 
                <div id="inventory_view" class="tile is-ancestor">
                    <ActionNavbar state="inventoryNav" menu={app.state.global.inventoryTypes}/>
                    <InventoryPath state="inventoryPath" inventoryPath={app.state.global.inventoryPath}/>
                </div>
            )
        }
    }
}
