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
            this.initialized=false
            this.inventoryPath = null
            this.state={
                inventoryPath:null
            }
        }
        
        componentWillReceiveProps(props) {
            const id = (props.match) ? props.match.params.id : null
            const pid = (this.props.match) ? this.props.match.params.id : null
            console.log('inventory main id:', id, pid)
            if (id===pid) return
            const thisModule=this
            if (id) {
                app.actions.inventory.getInventoryPath(id, function(inventoryPath) {
                    console.log('inventory main, path:',inventoryPath)
                    thisModule.setState({inventoryPath:inventoryPath})
                })
            } else {
                app.actions.inventory.getRootItem(function(item) {
                    if (item) {
                        app.actions.inventory.getInventoryPath(item.id, function(inventoryPath){
                            thisModule.setState({inventoryPath:inventoryPath})
                        })
                    } else {
                        console.log('getRootItem - no item found')
                    }
                })
            }
        }
        
        loggedInUser(loggedInUser) {
            console.log('logged in inventory: user', loggedInUser, app.remote, this.initialized)
            
            if (!loggedInUser || this.initialized) {
                return
            }
            this.initialized=true
            app.actions.inventory.initialize()
            app.actions.inventory.getInventoryTypes()
            app.actions.inventory.getFavorites()
            const id = (this.props.match) ? this.props.match.params.id : null
            const thisModule = this
            
            const getRootInventoryPath=function() {
                app.actions.inventory.getRootItem(function(item) {
                    if (item) {
                        app.actions.inventory.getInventoryPath(item.id, function(inventoryPath){
                            thisModule.setState({inventoryPath:inventoryPath})
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
                    const item = app.actions.inventory.getItemFromInventoryPath(id, inventoryPath)
                    console.log('logged in inventory:', id, item, inventoryPath)
                    if (!item) {
                        getRootInventoryPath()
                        return
                    }
                    thisModule.setState({inventoryPath:inventoryPath})
                })
            } else {
                console.log('logged in inventory: no id', this)
                getRootInventoryPath()
            }
        }
        
        render() {
            if (!app.state.global.user) {
                return (
                    <div>You must be logged in to view this page.</div>
                )
            }
            //console.log('inventory main render:', this.props)
            return ( 
                <div id="inventory_view" class="tile is-ancestor">
                    <ActionNavbar state="inventoryNav" menu={app.state.global.inventoryTypes}/>
                    <InventoryPath state="inventoryPath" inventoryPath={app.state.global.inventoryPath}/>
                </div>
            )
        }
    }
}
