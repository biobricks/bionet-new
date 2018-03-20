import {
    h
}
from 'preact'
import ashnazg from 'ashnazg'

module.exports = function (Component) {
    var ActionNavbar = require('./actionNavbar')(Component)
    var InventoryPath = require('./inventoryPath')(Component)

    return class Inventory extends Component {

        constructor(props) {
            super(props);
            this.initialized=false
            app.actions.inventory.initialize()
            this.state={
                types:app.actions.inventory.getInventoryTypes(),
                inventoryPath:null
            }
            ashnazg.listen('global.user', this.loggedInUser.bind(this));
        }
        
        componentWillReceiveProps(props) {
            const id = (props.match) ? props.match.params.id : null
            const pid = (this.props.match) ? this.props.match.params.id : null
            //console.log('inventory main id:', id, pid)
            if (id !== pid) this.getInventoryPath(id)
        }
        
        getInventoryPath(id) {
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
        
        getRootInventoryPath(cb) {
            if (!app.remote) {
                return
            }
            app.actions.inventory.getRootItem(function(item) {
                if (item) {
                    app.actions.inventory.getInventoryPath(item.id, function(inventoryPath){
                        if (cb) cb(inventoryPath)
                    })
                } else {
                    console.log('getRootItem - no item found')
                    if (cb) cb(null)
                }
            })
        }
        
        loggedInUser(loggedInUser) {
            //console.log('logged in inventory: user', loggedInUser, app.remote, this.initialized)
            
            if (!loggedInUser || this.initialized) {
                return
            }
            this.initialized=true
            app.actions.inventory.getInventoryTypes()
            app.actions.inventory.getFavorites()
            const id = (this.props.match) ? this.props.match.params.id : null
            this.getInventoryPath(id)
        }
        
        componentDidMount() {
            if (!this.state.inventoryPath) {
                this.loggedInUser(app.state.global.user)
            }
        }
        
        render() {
            if (!app.state.global.user) {
                return (
                    <div>You must be logged in to view this page.</div>
                )
            }
            //console.log('inventory main render:', this.props, this.state)
            return (
                <div id="inventory_view" class="tile is-ancestor">
                    <ActionNavbar state="inventoryNav" menu={this.state.types}/>
                    <InventoryPath state="inventoryPath" inventoryPath={this.state.inventoryPath}/>
                </div>
            )
        }
    }
}
