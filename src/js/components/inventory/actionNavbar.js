import {
    h
}
from 'preact'

module.exports = function (Component) {
    const EditPhysical = require('./editPhysical')(Component)
    
    return class ActionNavBar extends Component {
        
        constructor(props) {
            super(props);
            this.state = {
                addItemMenuDisplay:'',
                addMenu:{},
                displayAddPhysicalModal:false
            }
            this.showAddPhysicalModal = this.showAddPhysicalModal.bind(this)
        }
        
        componentWillReceiveProps(nextProps)
        {
            if (!nextProps || !nextProps.menu) return
            console.log('ActionNavBar props:',nextProps.menu)
            
            const menuDef = nextProps.menu.addMenuLocations
            const menu = []
            
            const DropdownMenuItem = function(props) {
                return <a id={props.id} class="dropdown-item {props.isActive}" onClick={props.onClick}>{props.label}</a>
            }
            
            for (var i=0; i<menuDef.length; i++) {
                var item = menuDef[i]
                menu.push(<DropdownMenuItem id={item.name} label={item.title} onClick={this.addItemClick.bind(this)} />)
            }
            this.setState({addMenu:menu})
            return true
        }
        
        addItemClick(e) {
            console.log('add menu item:',e.target.id, this.editPhysical)
            /*
            app.setState({
                global: {
                    enableEditPhysical: true
                }
            });
            */
            this.setState(
                {
                    itemType:e.target.id,
                    addItemMenuDisplay:'',
                    displayAddPhysicalModal:true
                }
            )
        }
        
        showAddPhysicalModal(isOpen) {
            this.setState(
                {
                    addItemMenuDisplay:'',
                    displayAddPhysicalModal:isOpen
                }
            )
        }
        
        addItem() {
            const addItemMenuDisplay = (this.state.addItemMenuDisplay==='is-active') ? '' :'is-active'
            this.setState({addItemMenuDisplay:addItemMenuDisplay})
            // todo: activate edit physical modal
            /*
            app.remote.getType('lab',function(e,type) {
                console.log('getType: ',type, e)
            })
            */
        }
        
        starItem() {
            //console.log('star item')
            var n = parseInt(Math.random()*5+1)
            app.actions.inventory.getPath(n)
        }
        
        editItem() {
            //console.log('edit item')
            app.actions.inventory.getPath(1)
        }
        
        deleteItem() {
            app.actions.inventory.getPath(2)
            //console.log('delete item')
        }
        
        upload() {
            //console.log('upload item')
            app.actions.inventory.getPath(5)
        }
        
        render() {

            var by = 25
            const ActionMenuButton = function(props) {
                by += 65
                //var style = "position:fixed; border-radius:50%; width:55px; height:55px; top:"+by+"px; left:10px;color:#ffffff;background-color:#0080ff;"
                var style = "border-radius:50%; width:55px; height:55px;color:#ffffff;background-color:#0080ff;"
                return (
                        <div class="tile">
                            <button class="button" onclick={props.onClick} style={style}><i class="material-icons">{props.icon}</i></button>
                        </div>
                       )
            }
                
            return (
                <div id="inventory_actions" class="tile is-1 is-vertical">
                    <div class={"dropdown tile "+this.state.addItemMenuDisplay}>
                        <div class="dropdown-trigger">
                            <ActionMenuButton icon="add" onClick={this.addItem.bind(this)} />
                        </div>
                        <div class="dropdown-menu" id="dropdown-menu" role="menu" style={"position:fixed; top:145px; left:10px;"}>
                            <div class="dropdown-content">
                                {this.state.addMenu}
                            </div>
                        </div>
                    </div>
                    <ActionMenuButton icon="star" onClick={this.starItem.bind(this)} />
                    <ActionMenuButton icon="edit" onClick={this.editItem.bind(this)} />
                    <ActionMenuButton icon="delete" onClick={this.deleteItem.bind(this)} />
                    <ActionMenuButton icon="open_in_browser" onClick={this.upload.bind(this)} />
                            
                                
                    <EditPhysical state="enableEditPhysical" active={this.state.displayAddPhysicalModal} type={this.state.itemType} isOpen={this.showAddPhysicalModal}/>
                    
                </div>
            )
        }
    }
}
