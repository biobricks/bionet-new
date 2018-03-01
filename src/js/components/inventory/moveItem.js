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
            if (this.state.moveActive) {
                const selection = app.state.global.inventorySelection
                if (selection) {
                    const item = app.actions.inventory.getSelectedItem()
                    console.log('moved item from:',item.parent_x, item.parent_y)
                    item.parent_id = selection.parentId
                    item.parent_x = selection.x
                    item.parent_y = selection.y
                    console.log('moved item to:',item.parent_x, item.parent_y)
                    app.actions.inventory.saveToInventory(item, null, null, function(err, id) {
                        if (err) {
                            app.actions.notify("Error moving "+item.name, 'error');
                        }
                        else {
                            app.actions.notify(item.name+" moved", 'notice', 2000);
                            //app.actions.inventory.getInventoryPath(item.id)
                        }
                    })
                }
            }
            this.setState({moveActive:!this.state.moveActive})
        }
        
        render() {
            const close=function() {
                app.actions.inventory.setMoveItem(null)
            }
            if (!this.props.moveId) return null
            const parent_item = app.state.global.moveItem
            var storageContainer = null
            if (parent_item) {
                const containerSize=200
                storageContainer = (<StorageContainer dbid={parent_item.id} height={containerSize} width={containerSize} title={parent_item.name} childType={parent_item.child} xunits={parent_item.xUnits} yunits={parent_item.yUnits} item={parent_item} items={parent_item.children} selectedItem={null}  px="1" py="1" mode="edit"/>)
            }
            
            const cb = (this.props.onclick) ? this.props.onclick : null
            const isActive = (this.state.moveActive) ? 'is-active' : ''
            //                            <span class="button is-small is-light" style="color:#000000;" onclick={cb}>Move to:</span>
            return (
                <a id={this.props.moveId} class="navbar-item is-dark" style="background-color:#404040;">
                    <div class={"dropdown "+isActive}>
                        <div class="dropdown-trigger">
                            <button class="button is-small is-light" aria-haspopup="true" aria-controls="dropdown-menu-move" style="color:#000000;" onclick={this.moveButtonClick}>Move to:</button>
                        </div>
                        <div class="dropdown-menu" id="dropdown-menu-move" role="menu">
                            <div class="dropdown-content">
                                <div class="dropdown-item">{storageContainer}</div>
                            </div>
                        </div>
                    </div>
                    <span style="color:#ffffff;margin-left:5px; margin-right:20px;font-weight:800;">{this.props.name}</span>
                    <span class="button is-rounded is-small is-light" onclick={close}><a class="mdi mdi-window-close" style="color:#000000;font-weight:800;"></a></span>
                </a>
            )
        }
    }
}
