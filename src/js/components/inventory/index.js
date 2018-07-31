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
                types:{},
                inventoryPath:null
            }

          if(props.match.params.virtual_id) {
            this.state.inventoryPath = {
              virtual_id: props.match.params.virtual_id
            }
          }

            ashnazg.listen('global.user', this.loggedInUser.bind(this));
        }
        
        componentWillReceiveProps(props) {
            const id = (props.match) ? props.match.params.id : null
            //console.log('inventory main props:', id, this.state.id, this.props)
            if (id !== this.state.id || app.state.inventory.forceRefresh) this.getInventoryPath(id)

          if(props.match.params.virtual_id) {
            this.setState({
              inventoryPath: {
                virtual_id: props.match.params.virtual_id
              },
              err:null
            })
          }

          
        }
        
        componentWillMount() {
            this.setState({
                types:app.actions.inventory.getInventoryTypes()
            })
        }
        
        getInventoryPath(id) {
            console.log('inventory.actions.getInventoryPath main, id:',id)
            const self=this
            if (id) {
                app.actions.inventory.getInventoryPath(id, function(err, inventoryPath) {
                    //console.log('getInventoryPath2, id:',id)
                    if (err) {
                        if (!self.state.err) app.actions.notify(err.message, 'error');
                        self.setState({
                            id:id,
                            err:err,
                            inventoryPath:null
                        })
                        return
                    }
                    self.setState({
                        id:id,
                        err:null,
                        inventoryPath:inventoryPath
                    })
                })
            } else {
                app.actions.inventory.getRootItem(function(err, rootId) {
                    if (err) {
                        console.log('getRootItem, error:',err)
                        //app.actions.notify(err.message, 'error');
                        self.setState({
                            id:rootId,
                            err:err,
                            inventoryPath:null
                        })
                        return
                    } else {
                        console.log('inventory.actions.getInventoryPath root, id:',id)
                        app.actions.inventory.getInventoryPath(rootId, function(err, inventoryPath){
                            if (err) {
                                //app.actions.notify(err.message, 'error');
                                self.setState({
                                    id:rootId,
                                    err:err,
                                    inventoryPath:null
                                })
                                return
                            }
                            //console.log('getInventoryPath3, rootid:',rootId, self.state, self.props, inventoryPath)
                            self.setState({
                                id:rootId,
                                err:null,
                                inventoryPath:inventoryPath
                            })
                        })
                    }
                })
            }
        }
        
        shouldComponentUpdate(nextProps, nextState) {
            const idProp = (nextProps.match) ? nextProps.match.params.id : null
            const idState = nextState.id
            if (app.state.inventory.forceRefresh) {
                //console.log('inventory main, forcing refresh:',nextProps)
                app.state.inventory.forceRefresh=false
                return true
            }
            if (!idProp && idState) return true
            return idState === idProp
        }
        
        loggedInUser(loggedInUser) {
            //console.log('logged in inventory: user', loggedInUser, app.remote, this.initialized)
            if (!loggedInUser) {
                return
            }
            this.initialized=true
            app.actions.inventory.getInventoryTypes()
            app.actions.inventory.getFavorites()
            app.actions.inventory.getWorkbenchContainer()
            const id = (this.props.match) ? this.props.match.params.id : null
            this.getInventoryPath(id)
        }
        
        componentDidMount() {
            if (!this.state.inventoryPath) {
                this.loggedInUser(app.state.global.user)
            }
        }
        
        render() {
            console.log('inventory index.js render',this.state)
            if (!app.state.global.user) {
                console.log('inventory index.js not logged in',this.state.inventoryPath)
                // todo: this message could be displayed for reasons other than not having a logged in user
                return null
                /*
                return (
                    <div>You must be logged in to view this page.</div>
                )
                */
            }
            
            if (this.state.err) {
                return (
                    <div>Error:{this.state.err.message}</div>
                )
            }

            return (
                <InventoryPath state="inventoryPath" id={this.state.id} inventoryPath={this.state.inventoryPath}/>
            )
        }
    }
}
