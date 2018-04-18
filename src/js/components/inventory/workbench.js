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
            this.state={
                moveActive:true,
                workbench:[]
            }
        }
        
        getWorkbench() {
            app.actions.inventory.getWorkbenchContainer( function(err,tree) {
                console.log('getWorkbench:',tree)
                this.setState({workbench:tree})
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
            try {
                this.getWorkbench()
            } catch(e) {}
        }
        
        render() {
            const totalItems = (this.state.workbench) ? this.state.workbench.length : 0
            const itemText = (totalItems===1) ? 'item' : 'items'
            var storageContainer = null
            const isActive = (this.state.moveActive) ? 'is-active' : ''
            return (
                <a className="navbar-item is-dark" style="background-color:#404040;" ondrop={this.drop} ondragover={this.dragOver} draggable="true" ondragstart={this.dragStart}>
                    <span style="color:#ffffff;margin-left:5px; margin-right:20px;font-weight:800;">{totalItems} {itemText} on bench</span>
                </a>
            )
        }
    }
}
