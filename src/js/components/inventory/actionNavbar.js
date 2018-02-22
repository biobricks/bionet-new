import {
    h
}
from 'preact'
import ashnazg from 'ashnazg'

module.exports = function (Component) {
    const EditPhysical = require('./editPhysical')(Component)
    const EditVirtual = require('./editVirtual')(Component)
    
    return class ActionNavBar extends Component {
        
        constructor(props) {
            super(props);
            this.showAddPhysicalModal = this.showAddPhysicalModal.bind(this)
            this.showAddVirtualModal = this.showAddVirtualModal.bind(this)
            this.componentWillReceiveProps(props)
            ashnazg.listen('global.inventoryItem', this.editItemListener.bind(this));
            ashnazg.listen('global.virtualItem', this.editVirtualItemListener.bind(this));
        }
        
        componentWillReceiveProps(nextProps) {
            if (!nextProps || !nextProps.menu) return
            //console.log('ActionNavBar props:',nextProps.menu, this.state, this.item)
            var physicalMenu = false
            if (app.state.global.inventorySelection) {
                const currentItem = app.actions.inventory.getItemFromInventoryPath(app.state.global.inventorySelection.id)
                if (currentItem && currentItem.type) {
                    const currentSelectionType = currentItem.type.toLowerCase()
                    if (currentSelectionType.indexOf('box')>=0) physicalMenu = true
                }
            }
            const menuDef = (physicalMenu) ? nextProps.menu.materials : nextProps.menu.locations 
            this.createType = physicalMenu
            this.setState({menuDef:menuDef})
        }

        editItemListener(item) {
            console.log('editItemListener:',item)
            this.item = item
            this.displayAddPhysicalModal=true
            this.displayAddVirtualModal=false
            this.setState({displayAddPhysicalModal:true})
        }
        
        editVirtualItemListener(item) {
            console.log('editVirtualItemListener:',item)
            this.item = item
            this.displayAddVirtualModal=true
            this.displayAddPhysicalModal=false
            //this.setState({displayAddPhysicalModal:true})
        }
        
        generateNewItem(parent_id,x,y,type) {
            // todo: ashnagz listner is not triggered if unchanged, salt property is temporary work-around
            return {
                salt: Math.random(),
                type: type,
                name: '',
                parent_id: parent_id,
                parent_x: x,
                parent_y: y
            }
        }
            
        addItemClick(e) {

            //console.log('add menu item:',e.target.id, this.editPhysical)
            this.displayAddMenu(false)
            
            // todo: ashnagz listner is not triggered if unchanged
            const item = this.generateNewItem(app.state.global.inventorySelection.id, app.state.global.inventorySelection.x, app.state.global.inventorySelection.y, e.target.id)
            //const item = this.generateNewItem(app.state.global.inventorySelection.id, e.target.id)
            if (this.createType) app.actions.inventory.editVirtualItem(item)
            else app.actions.inventory.editItem(item)
        }
    
        displayAddMenu(show) {
            this.setState({ addItemMenuDisplay: (show) ? 'is-active' : '' })
        }
        
        showAddVirtualModal(isOpen, item) {
          this.setState(
            {
              addItemMenuDisplay:'',
              displayAddPhysicalModal:false,
              displayAddVirtualModal:isOpen,
              item:item
            }
          )
          this.displayAddPhysicalModal=false
          this.displayAddVirtualModal=isOpen
        }
        
        showAddPhysicalModal(isOpen, item) {
          this.setState(
            {
              addItemMenuDisplay:'',
              displayAddVirtualModal:false,
              displayAddPhysicalModal:isOpen,
              item:item
            }
          )
          this.displayAddVirtualModal=false
          this.displayAddPhysicalModal=isOpen
        }
      
        addItemButton() {
            this.displayAddMenu(this.state.addItemMenuDisplay !== 'is-active')
        }
        
        homeItem() {
            //console.log('star item')
            if (!app.state.global.inventoryPath || !app.state.global.inventoryPath.length>0) return
            const root = app.state.global.inventoryPath[0]
            const id = root.id
            if (id) app.actions.inventory.getInventoryPath(id)
        }
        
        starItem() {
            //console.log('star item')
            //var n = parseInt(Math.random()*5+1)
            //app.actions.inventory.getPath(n)
        }
        
        editItem() {
            const id = app.state.global.inventorySelection.id
            var item = null
            if (!id) {
                item = this.generateNewItem(app.state.global.inventorySelection.parentId,app.state.global.inventorySelection.x, app.state.global.inventorySelection.y,'')
            } else {
                item = app.actions.inventory.getItemFromInventoryPath(id)
            }
            console.log('edit item',id, app.state.global.inventorySelection, item)
            app.actions.inventory.editItem(item)
        }
        
        deleteItem() {
            const id = app.state.global.inventorySelection.id
            if (!id) return
            const item = app.actions.inventory.getItemFromInventoryPath(id)
            if (!item) return
            const name = item.name
            app.actions.prompt.display('Do you wish to delete '+name+'?', function(accept) {
                console.log('delete item:',accept)
                if (accept) {
                    app.actions.inventory.delPhysical(id, function(err,id) {
                        if (err) {
                            app.actions.notify("Error deleting item", 'error');
                            return
                        }
                        app.actions.notify("Item deleted", 'notice', 2000);
                        const parentId = app.state.global.inventorySelection.parentId
                        console.log('delete refresh parentId:',parentId)
                        app.actions.inventory.getInventoryPath(parentId)
                    })
                }
            })
        }
        
        upload() {
            //console.log('upload item')
            //app.actions.inventory.getPath(5)
        }

        render() {
            const initMenu = function() {
                const menuDef = this.state.menuDef
                if (!menuDef) return null
                const menu = []
                const DropdownMenuItem = function(props) {
                    return <a id={props.id} class="dropdown-item {props.isActive}" onClick={props.onClick}>{props.label}</a>
                }
                for (var i=0; i<menuDef.length; i++) {
                    var item = menuDef[i]
                    menu.push(<DropdownMenuItem id={item.name} label={item.title} onClick={this.addItemClick.bind(this)} />)
                }
                return menu
            }.bind(this)
            
            //console.log('actionNavbar render:', this.state)
            const actionButtonContainer = "justify-content:flex-start;"
            const actionMenuButtonStyle = "font-size:20px;line-height:55px;border-radius:50%; width:55px; height:55px;max-height:55px;color:#ffffff;background-color:#0080ff;"
            const menu = initMenu()
            
            const ActionMenuButton = function(props) {
                return (
                        <div class="tile" style={actionButtonContainer}>
                            <button class="button" style="border:none" onclick={props.onClick}><a class={"mdi mdi-"+props.icon} style={actionMenuButtonStyle}></a></button>
                        </div>
                       )
            }
            const actionsContainerHeight = 5*75
            const actionsContainerStyle = "height:"+actionsContainerHeight+"px;max-height:"+actionsContainerHeight+"px;"
            const editPhysical = (this.displayAddPhysicalModal) ? (<EditPhysical state="EditPhysical" active={this.displayAddPhysicalModal} isOpen={this.showAddPhysicalModal} item={this.item} />) : null
            const editVirtual = (this.displayAddVirtualModal) ? (<EditVirtual state="EditVirtual" active={this.displayAddVirtualModal} isOpen={this.showAddVirtualModal} item={this.item} />) : null
            return (
                <div id="inventory_actions" class="tile is-1 is-vertical" style={actionsContainerStyle}>
                    <ActionMenuButton icon="home" onClick={this.homeItem.bind(this)} />
            
                    <div class={"dropdown tile "+this.state.addItemMenuDisplay} style={actionButtonContainer}>
                        <div class="dropdown-trigger">
                            <ActionMenuButton icon="plus" onClick={this.addItemButton.bind(this)} />
                        </div>
                        <div class="dropdown-menu" id="dropdown-menu" role="menu" style={"position:fixed; top:195px; left:10px;"}>
                            <div class="dropdown-content">
                                {menu}
                            </div>
                        </div>
                    </div>
                    <ActionMenuButton icon="star" onClick={this.starItem.bind(this)} />
                    <ActionMenuButton icon="pencil" onClick={this.editItem.bind(this)} />
                    <ActionMenuButton icon="open-in-app" onClick={this.upload.bind(this)} />
                    <ActionMenuButton icon="delete" onClick={this.deleteItem.bind(this)} />
                    {editPhysical}
                    {editVirtual}
                </div>
            )
        }
    }
}
