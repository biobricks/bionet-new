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
            ashnazg.listen('global.inventoryPath', this.onUpdatePath.bind(this));
            window.onpopstate = this.onpopstate.bind(this)
            this.pushHistory=true
        }
        
        onUpdatePath(path) {
            //console.log('onUpdatePath:',path)
            if (!this.pushHistory) {
                this.pushHistory=true
                return
            }
            if (!path || path.length<1) return null
            const selectedItem = path[path.length-1]
            if (!selectedItem) return null
            
            const historyEntry = {
                id:selectedItem.id,
                name:selectedItem.name,
                url:"/inventory/"+selectedItem.id
            }
            window.history.pushState(historyEntry, selectedItem.name, historyEntry.url);
            console.log('onUpdatePath historyEntry:',historyEntry)
        }
            
        onpopstate(e) {
            console.log('onpopstate:',e.state, history.state)
            const id = e.state.id
            this.pushHistory=false
            if (id) app.actions.inventory.getInventoryPath(id)
        }

        componentDidMount() {
            //console.log('inventory component mounted')
        }
        
        loggedInUser(loggedInUser) {
            //console.log('logged in inventory: user', loggedInUser, app.remote)
            if (!(loggedInUser)) return
            
            app.actions.inventory.initialize()
            
            app.actions.inventory.getInventoryTypes()
            app.actions.inventory.getFavorites()
            const id = (this.props.match) ? this.props.match.params.id : null
            const thisModule = this
            
            const getRootInventoryPath=function() {
                app.actions.inventory.getRootItem(function(item) {
                    if (item) {
                        app.actions.inventory.getInventoryPath(item.id, function(inventoryPath){
                            app.actions.inventory.selectCell(item.id, item.parent_id, item.parent_x, item.parent_y, false)
                        })
                    } else {
                        console.log('getRootItem - no item found')
                    }
                })
            }
            
            if (id) {
                app.actions.inventory.getInventoryPath(id, function(inventoryPath){
                    if (!inventoryPath) {
                        getRootInventoryPath()
                        return
                    }
                    const item = inventoryPath[id]
                    if (item) {
                        //const item = app.actions.inventory.getItemFromInventoryPath(id, inventoryPath)
                        console.log('logged in inventory: id', id, item, inventoryPath)
                        app.actions.inventory.selectCell(item.id, item.parent_id, item.parent_x, item.parent_y, false)
                    } else {
                        console.log('logged in inventory: id not found', this)
                        getRootInventoryPath()
                    }
                })
            } else {
                console.log('logged in inventory: no id', this)
                getRootInventoryPath()
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
