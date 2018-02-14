import {
    h
}
from 'preact'
import ashnazg from 'ashnazg'

module.exports = function (Component) {
    const EditPhysical = require('./editPhysical')(Component)
    
    return class ActionNavBar extends Component {
        
        constructor(props) {
            super(props);
            this.state = {
                addItemMenuDisplay:'',
                displayAddPhysicalModal:false,
                test:false
            }
            app.changeState({
                global: {
                    inventoryItem: null
                }
            });
            ashnazg.listen('global.inventoryItem', this.editItemListener.bind(this));

            this.showAddPhysicalModal = this.showAddPhysicalModal.bind(this)
        }
        
        editItemListener(item) {
            //console.log('editItemListener:',item)

            this.setState(
                {
                    displayAddPhysicalModal:true
                }
            )
            this.item = item
            this.displayAddPhysicalModal = true
        }

        initMenus(nextProps)
        {

            if (!nextProps || !nextProps.menu) return
            //console.log('ActionNavBar props:',nextProps.menu, this.state, this.item)
            
            const menuDef = nextProps.menu.locations
            const menu = []
            
            const DropdownMenuItem = function(props) {
                return <a id={props.id} class="dropdown-item {props.isActive}" onClick={props.onClick}>{props.label}</a>
            }
            
            for (var i=0; i<menuDef.length; i++) {
                var item = menuDef[i]
                menu.push(<DropdownMenuItem id={item.name} label={item.title} onClick={this.addItemClick.bind(this)} />)
            }
            return menu
        }

        addItemClick(e) {

            //console.log('add menu item:',e.target.id, this.editPhysical)
            
            const parent_id = app.state.global.inventorySelection.id
            
            this.displayAddMenu(false)
            
            // todo: ashnagz listner is not triggered if unchanged
            var item = {
                salt: Math.random(),
                type: e.target.id,
                name: '',
                parent_id: parent_id,
                parent_x: 1,
                parent_y: 1
            }
            app.actions.inventory.editItem(item)
        }
    
        displayAddMenu(show) {
            this.setState({ addItemMenuDisplay: (show) ? 'is-active' : '' })
        }
        
        showAddPhysicalModal(isOpen, item) {

          this.setState(
            {
              addItemMenuDisplay:'',
              displayAddPhysicalModal:isOpen,
              item:item
            }
          )

          this.displayAddPhysicalModal=isOpen

        }
      
        addItemButton() {
            this.displayAddMenu(this.state.addItemMenuDisplay !== 'is-active')
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
            //console.log('actionNavbar render:', this.state)
            const actionButtonContainer = "max-height:75px; height:75px;"
            const actionMenuButtonStyle = "border-radius:50%; width:55px; height:55px;max-height:55px;color:#ffffff;background-color:#0080ff;"
            const menu = this.initMenus(this.props)
            
            const ActionMenuButton = function(props) {
                return (
                        <div class="tile" style={actionButtonContainer}>
                            <button class="button" onclick={props.onClick} style={actionMenuButtonStyle}><i class="material-icons">{props.icon}</i></button>
                        </div>
                       )
            }
            const actionsContainerHeight = 5*75
            const actionsContainerStyle = "height:"+actionsContainerHeight+"px;max-height:"+actionsContainerHeight+"px;"
            return (
                <div id="inventory_actions" class="tile is-1 is-vertical" style={actionsContainerStyle}>
                    <div class={"dropdown tile "+this.state.addItemMenuDisplay} style={actionButtonContainer}>
                        <div class="dropdown-trigger">
                            <ActionMenuButton icon="add" onClick={this.addItemButton.bind(this)} />
                        </div>
                        <div class="dropdown-menu" id="dropdown-menu" role="menu" style={"position:fixed; top:145px; left:10px;"}>
                            <div class="dropdown-content">
                                {menu}
                            </div>
                        </div>
                    </div>
                    <ActionMenuButton icon="star" onClick={this.starItem.bind(this)} />
                    <ActionMenuButton icon="edit" onClick={this.editItem.bind(this)} />
                    <ActionMenuButton icon="delete" onClick={this.deleteItem.bind(this)} />
                    <ActionMenuButton icon="open_in_browser" onClick={this.upload.bind(this)} />
                    <EditPhysical state="enableEditPhysical" active={this.state.displayAddPhysicalModal} isOpen={this.showAddPhysicalModal} item={this.item} />
                </div>
            )
        }
    }
}
