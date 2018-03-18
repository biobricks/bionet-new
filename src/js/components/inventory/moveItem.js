import {
    h
}
from 'preact'

module.exports = function (Component) {
    const StorageContainer = require('./storageContainer')(Component)
    return class MoveItem extends Component {
        constructor(props) {
            super(props)
            this.moveButtonClick = this.moveButtonClick.bind(this)
            this.state={
                moveActive:false
            }
        }
        
        moveButtonClick() {
            const container = app.actions.inventory.getLastPathItem()
            const selection = app.state.inventory.selection
            const moveItem = app.state.inventory.moveItem
            console.log('move button:',selection.x, selection.y)
            //return
            if (moveItem && selection) {
                moveItem.parent_id = container.id
                moveItem.parent_x = selection.x
                moveItem.parent_y = selection.y
                console.log('moved item to:',moveItem, selection)
                //return
                app.actions.inventory.saveToInventory(moveItem, null, null, function(err, id) {
                    if (err) {
                        app.actions.notify("Error moving "+moveItem.name, 'error');
                    }
                    else {
                        app.actions.notify(moveItem.name+" moved", 'notice', 2000);
                        app.actions.inventory.selectInventoryId(container.id)
                    }
                })
            }
        }
        
        render() {
            const close=function() {
                app.actions.inventory.setMoveItem(null)
            }
            if (!this.props.moveId) return null
            const parent_item = app.state.inventory.moveItem
            var storageContainer = null
            
            const isActive = (this.state.moveActive) ? 'is-active' : ''

            return (
                <a id={this.props.moveId} class="navbar-item is-dark" style="background-color:#404040;">
                    <button class="button is-small is-light" aria-haspopup="true" aria-controls="dropdown-menu-move" style="color:#000000;" onclick={this.moveButtonClick}>Move:</button>
                    <span style="color:#ffffff;margin-left:5px; margin-right:20px;font-weight:800;">{this.props.name}</span>
                    <span class="button is-rounded" style="background-color:rgb(64,64,64);border:none;" onclick={close}><a class="mdi mdi-close-box mdi-24px mdi-light" style="color:#000000;font-weight:800;"></a></span>
                </a>
            )
        }
    }
}
