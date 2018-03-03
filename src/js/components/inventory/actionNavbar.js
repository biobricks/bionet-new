import {
    h
}
from 'preact'
import ashnazg from 'ashnazg'

module.exports = function (Component) {
    const EditPhysical = require('./editPhysical')(Component)
    const EditVirtual = require('./editVirtual')(Component)
    const Favorites = require('./favorites')(Component)
    
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
        
        componentDidMount() {
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
            const parent = app.actions.inventory.getLastPathItem()
            if (!parent) return null
            const item = this.generateNewItem(parent.id, parent.parent_x, parent.parent_y, e.target.id)
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
            if (id) {
                app.actions.inventory.selectCell(id, root.parent_id, root.parent_x, root.parent_y, true)
                app.actions.inventory.getInventoryPath(id)
            }
        }
        
        starItem() {
        }
        
        editItem() {
            var item = app.actions.inventory.getSelectedItem()
            const id = app.state.global.inventorySelection.id
            //var item = null
            if (!id) {
                item = this.generateNewItem(app.state.global.inventorySelection.parentId,app.state.global.inventorySelection.x, app.state.global.inventorySelection.y,'')
            } else {
                //item = app.actions.inventory.getItemFromInventoryPath(id)
            }
            //if (item) item.salt = Math.random()
            console.log('edit item',id, app.state.global.inventorySelection, item)
            app.actions.inventory.editItem(item)
        }
        
        deleteItem() {
            const item = app.actions.inventory.getLastPathItem()
            if (!item) return
            const id = item.id
            if (!id) return
            const name = item.name
            const parentId = item.parent_id
            console.log('deleting item 1:', id, name, parentId, item)
            app.actions.prompt.display('Do you wish to delete '+name+'?', function(accept) {
                if (accept) {
                        /*
                        console.log('deleting item 2:', id, name, parentId, item)
                        app.actions.notify(name+" deleted", 'notice', 2000);
                        if (!parentId) return
                        const parentItem = app.actions.inventory.getItemFromInventoryPath(parentId)
                        app.actions.inventory.getInventoryPath(parentId)
                        if (!parentItem) return
                        app.actions.inventory.selectCell(parentItem.id, parentItem.parent_id, parentItem.parent_x, parentItem.parent_y, true)
                        return
                        */
                    
                    app.actions.inventory.delPhysical(id, function(err,id2) {
                        if (err) {
                            app.actions.notify("Error deleting item", 'error');
                            return
                        }
                        app.actions.notify(name+" deleted", 'notice', 2000);
                        if (!parentId) return
                        const parentItem = app.actions.inventory.getItemFromInventoryPath(parentId)
                        app.actions.inventory.getInventoryPath(parentId)
                        if (!parentItem) return
                        console.log('delete refresh parentId:',parentId)
                        app.actions.inventory.selectCell(parentItem.id, parentItem.parent_id, parentItem.parent_x, parentItem.parent_y, true)
                    })
                }
            })
        }
        
        selectFavorite(id) {
            console.log('selectFavorite:',id)
            if (id) {
                app.actions.inventory.getInventoryPath(id)
            }
        }
        
        addFavorite() {
            const item = app.actions.inventory.getSelectedItem()
            if (!item) return
            app.actions.inventory.addFavorite(item, function(err) {
                if (err) app.actions.notify("Error adding "+item.name+" to favorites", 'error', 8000);
                else {
                    app.actions.notify(item.name+" added to favorites", 'notice', 2000);
                    app.actions.inventory.getFavorites()
                }
            }.bind(this))
        }
        
        upload() {
        }
        
        moveItem() {
            app.actions.inventory.setMoveItem(app.actions.inventory.getSelectedItem())
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
            const actionButtonContainer = "border-radius:50%; margin-bottom:10px;width:55px; height:55px;max-height:55px;color:#ffffff;background-color:#0080ff;justify-content:center;"
            const actionMenuButtonStyle = "font-size:20px;line-height:55px;color:#ffffff;display:flex;width:55px;justify-content:center;"
            const menu = initMenu()
            
            const ActionMenuButton = function(props) {
                return (
                    <div class="tile" style={actionButtonContainer}>
                            <a onclick={props.onClick} class={"mdi mdi-"+props.icon} style={actionMenuButtonStyle}></a>
                        </div>
                       )
            }
            const actionsContainerHeight = 5*75
            const actionsContainerStyle = "height:"+actionsContainerHeight+"px;max-height:"+actionsContainerHeight+"px;"
//            const editPhysical = (this.displayAddPhysicalModal) ? (<EditPhysical state="EditPhysical" active={this.displayAddPhysicalModal} isOpen={this.showAddPhysicalModal} item={this.item} />) : null
            const editPhysical = (this.displayAddPhysicalModal) ? (<EditPhysical state="EditPhysical" active={this.displayAddPhysicalModal} isOpen={this.showAddPhysicalModal} item={app.state.global.inventoryItem} />) : null
            const editVirtual = (this.displayAddVirtualModal) ? (<EditVirtual state="EditVirtual" active={this.displayAddVirtualModal} isOpen={this.showAddVirtualModal} item={this.item} />) : null
            return (
                <div id="inventory_actions" class="tile is-1 is-vertical" style={actionsContainerStyle}>
                    <ActionMenuButton icon="home" onClick={this.homeItem.bind(this)} />
            
                    <div class={"dropdown tile "+this.state.addItemMenuDisplay}>
                        <div class="dropdown-trigger">
                            <ActionMenuButton icon="plus" onClick={this.addItemButton.bind(this)} />
                        </div>
                        <div class="dropdown-menu" id="dropdown-menu" role="menu" style={"position:fixed; top:195px; left:10px;"}>
                            <div class="dropdown-content">
                                {menu}
                            </div>
                        </div>
                    </div>
                    <div class="dropdown is-hoverable">
                      <div class="dropdown-trigger">
                        <ActionMenuButton icon="star" onClick={this.starItem.bind(this)} />
                      </div>
                      <div class="dropdown-menu" id="dropdown-menu4" role="menu" style="margin:0;padding:0;">
                        <div class="dropdown-content"  style="margin:0;padding:0;">
                          <div class="dropdown-item"  style="margin:0;padding:0;">
                            <Favorites favorites={app.state.global.favorites} selectFunction={this.selectFavorite.bind(this)} addFunction={this.addFavorite.bind(this)} selectedItem={app.state.global.inventorySelection}/>
                          </div>
                        </div>
                      </div>
                    </div>            
                    <ActionMenuButton icon="pencil" onClick={this.editItem.bind(this)} />
                    <ActionMenuButton icon="cursor-move" onClick={this.moveItem.bind(this)} />
                    <ActionMenuButton icon="open-in-app" onClick={this.upload.bind(this)} />
                    <ActionMenuButton icon="delete" onClick={this.deleteItem.bind(this)} />
                    {editPhysical}
                    {editVirtual}
                </div>
            )
        }
    }
}
