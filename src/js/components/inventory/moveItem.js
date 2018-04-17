import {
    h
}
from 'preact'

module.exports = function (Component) {
    const StorageContainer = require('./storageContainer')(Component)
    return class MoveItem extends Component {
        constructor(props) {
            super(props)
            this.drop = this.drop.bind(this)
            this.dragOver = this.dragOver.bind(this)
            this.dragStart = this.dragStart.bind(this)
            this.moveButtonClick = this.moveButtonClick.bind(this)
            this.state={
                moveActive:false,
                workbench:[]
            }
        }
        
        moveButtonClick() {
            const container = app.actions.inventory.getLastPathItem()
            const selection = app.state.inventory.selection
            const moveItem = this.props.item
            //const moveItem = app.state.inventory.moveItem
            console.log('move button:',selection.x, selection.y)
            if (moveItem && selection) {
                moveItem.parent_id = container.id
                moveItem.parent_x = selection.x
                moveItem.parent_y = selection.y
                console.log('moved item to:',moveItem, selection)
                //return
                app.actions.inventory.saveToInventory(moveItem, null, null, function(err, id) {
                    if (err) {
                        app.actions.notify(err.message, 'error');
                        return
                    }
                    else {
                        app.actions.notify(moveItem.name+" moved", 'notice', 2000);
                        app.actions.inventory.forceRefresh(container.id)
                    }
                })
            }
        }
        
        getWorkbench() {
            app.actions.inventory.getWorkbenchTree( function(err,tree) {
                console.log('getWorkbench:',tree)
                this.setState({workbench:tree})
                const currentItem = app.actions.inventory.getLastPathItem()
                app.actions.inventory.refreshInventoryPath(currentItem.id)
            }.bind(this))
        }
        
        drop(e) {
            e.preventDefault();
            var data = e.dataTransfer.getData("text");
            console.log('moveItem drop:',data)
            if (data) {
                app.actions.inventory.saveToWorkbench(data,function(err,m) {
                    console.log('workbench component, item added to workbench:',m)
                    this.getWorkbench()
                }.bind(this))
            }
            var workbench = this.state.workbench
            workbench.push(data)
            this.setState({
                workbench:workbench
            })
            //e.target.appendChild(document.getElementById(data));            
        }
        
        dragStart(e) {
          e.dataTransfer.setData("text/plain", JSON.stringify(this.state.workbench))
        }
        
        dragOver(e) {
            e.preventDefault();
            e.dataTransfer.dropEffect = "move"
        }
        
        close() {
            app.actions.inventory.setMoveItem(null)
        }
        
        componentWillMount() {
            this.getWorkbench()
        }
        
        render() {
            /*
                    <button className="button is-small is-light" aria-haspopup="true" aria-controls="dropdown-menu-move" style="color:#000000;" onclick={this.moveButtonClick}>Move:</button>
                    <span style="color:#ffffff;margin-left:5px; margin-right:20px;font-weight:800;">{item.name}</span>
            */
            const totalItems = (this.state.workbench) ? this.state.workbench.length : 0
            const itemText = (totalItems===1) ? 'item' : 'items'
            if (!this.props.item) return null
            const item = this.props.item
            var storageContainer = null
            const isActive = (this.state.moveActive) ? 'is-active' : ''
            return (
                <a id={item.id} className="navbar-item is-dark" style="background-color:#404040;" ondrop={this.drop} ondragover={this.dragOver} draggable="true" ondragstart={this.dragStart}>
                    <span style="color:#ffffff;margin-left:5px; margin-right:20px;font-weight:800;">{totalItems} {itemText} on bench</span>
                    <span className="button is-rounded" style="background-color:rgb(64,64,64);border:none;" onclick={this.close.bind(this)}><a className="mdi mdi-close-box mdi-24px mdi-light" style="color:#000000;font-weight:800;"></a></span>
                </a>
            )
        }
    }
}
