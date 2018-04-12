import {
    h
}
from 'preact'
import ashnazg from 'ashnazg'

module.exports = function (Component) {
    const EditPhysical = require('./editPhysical')(Component)
    const EditVirtual = require('./editVirtual')(Component)
    const AddExisting = require('./addExisting')(Component)
    const Favorites = require('./favorites')(Component)
    
    return class ActionNavBar extends Component {
        
        constructor(props) {
            super(props);
            this.componentWillReceiveProps(props)
            this.state={
                enableAddItemMenu:'',
                enableFavoritesMenu:''
            }
        }
        
        componentWillMount() {
            app.state.inventory.listener.physicalItem = this.editItemListener.bind(this)
            app.state.inventory.listener.virtualItem = this.editVirtualItemListener.bind(this)
        }

        componentWillReceiveProps(nextProps) {
            if (!nextProps || !nextProps.menu) return
            //console.log('ActionNavBar props:',nextProps.menu, this.state, nextProps)
            
            var menuDef=[]
            const currentItem = app.actions.inventory.getLastPathItem()
            if (currentItem) {
                const currentSelectionType = currentItem.type.toLowerCase()
                var menuDef = app.actions.inventory.getActiveTypes(currentSelectionType)
            }
            this.createType = app.actions.inventory.isInstanceContainerSelected()
            this.setState({menuDef:menuDef})
        }
        
        editItemListener(item) {
            console.log('editItem listener:',item)
            var title = 'Create Physical'
            if (item && item.name) {
                title = 'Edit '+item.name
            }
            const promptComponent = (<EditPhysical state="EditPhysical" active="true" item={app.state.inventory.physicalItem} />)
            app.actions.prompt.display(title, promptComponent, function(result) {
                console.log('edit result')
            })
        }
        
        editVirtualItemListener(virtual) {
            const parent = app.actions.inventory.getSelectedItem()
            if (virtual) {
                console.log('edit virtual, virtual:',virtual)
                const promptComponent = <EditVirtual state="EditVirtual" item={virtual} modal="true" parent={parent}/>
                const promptTitle = 'Edit '+virtual.name
                app.actions.prompt.display(promptTitle, promptComponent, function(result) {
                    console.log('virtual result')
                })
            } else {
                const promptComponent = (<EditVirtual state="EditVirtual" id={null} item={null} parent={parent}/>)
                app.actions.prompt.display("Create Virtual", promptComponent, function(result) {
                    console.log('virtual result')
                })
            }
            
        }
        
        generateNewItem(parent_id,x,y,type) {
            return {
                type: type,
                name: '',
                parent_id: parent_id,
                parent_x: x,
                parent_y: y
            }
        }
            
        addExisting(e) {

          const parent = app.actions.inventory.getSelectedItem();
          const promptComponent = (<AddExisting parent={parent} />)
          app.actions.prompt.display("Create physical", promptComponent, function(result) {
            console.log('virtual result')
          })          
        }

        addItemClick(e) {
            //console.log('add menu item:',e.target.id, this.editPhysical)
            this.closeAddItemMenu()
            const parent = app.actions.inventory.getLastPathItem()
            if (!parent) return null
            const type = e.target.id
            if (this.createType) {
                const virtual = {
                    type:type,
                    name:''
                }
                console.log('add virtual, virtual:',virtual)
                const promptComponent = <EditVirtual state="EditVirtual" item={virtual} parent={parent}/>
                const promptTitle = 'Create Virtual '
                app.actions.prompt.display(promptTitle, promptComponent, function(result) {
                    console.log('virtual result')
                })
            }
            else {
                const item = this.generateNewItem(parent.id, parent.parent_x, parent.parent_y, type)
                app.actions.inventory.editItem(item)
            }
        }
    
        openAddItemMenu() {
            this.setState({ enableAddItemMenu: (!this.state.enableAddItemMenu) ? 'is-active' : '' })
        }
        
        closeAddItemMenu() {
            this.setState({ enableAddItemMenu:'' })
        }
        
        openFavoritesMenu() {
            this.setState({ enableFavoritesMenu: (!this.state.enableFavoritesMenu) ? 'is-active' : '' })
        }
        
        closeFavoritesMenu() {
            this.setState({ enableFavoritesMenu:'' })
        }
        
        addItemButton() {
            this.displayAddMenu(this.state.enableAddItemMenu === '')
        }
        
        homeItem() {
            app.actions.inventory.getRootItem(function(err, rootId) {
                if (err) {
                    app.actions.notify(err.message, 'error');
                    return
                }
                if (rootId) {
                    app.actions.inventory.selectInventoryId(rootId)
                }
            })
        }
        
        editItem() {
            var item = null
            if (!app.state.inventory.selection || !app.state.inventory.selection.id) {
                item = this.generateNewItem(app.state.inventory.selection.parentId,app.state.inventory.selection.x, app.state.inventory.selection.y,'')
            } else {
                item = app.actions.inventory.getSelectedItem()
            }
            app.actions.inventory.editItem(item)
        }
        
        deleteItem() {
            //app.actions.notify("Error deleting item", 'error');
            //return
            
            const item = app.actions.inventory.getLastPathItem()
            if (!item) return
            const id = item.id
            if (!id) return
            const name = item.name
            const parentId = item.parent_id
            console.log('deleting item 1:', id, name, parentId, item)
            app.actions.prompt.display('Do you wish to delete '+name+'?', null, function(accept) {
                if (accept) {
                    app.actions.inventory.delPhysical(id, function(err,id2) {
                        if (err) {
                            app.actions.notify(err.message, 'error');
                            return
                        }
                        app.actions.notify(name+" deleted", 'notice', 2000);
                        if (!parentId) return
                        const parentItem = app.actions.inventory.getItemFromInventoryPath(parentId)
                        app.actions.inventory.selectInventoryId(parentId)
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
                app.actions.inventory.selectInventoryId(id)
            }
        }

        addFavorite() {
            const item = app.actions.inventory.getSelectedItem()
            if (!item) return
            app.actions.inventory.addFavorite(item, function(err) {
                if (err) {
                    app.actions.notify(err.message, 'error');
                    return
                }
                else {
                    app.actions.notify(item.name+" added to favorites", 'notice', 2000);
                    app.actions.inventory.getFavorites()
                }
            }.bind(this))
        }

        // todo: display open local files modal then upload
        upload() {
        }
        
        moveItem() {
            const item = app.actions.inventory.getSelectedItem()
            console.log('moveItem:',item)
            app.actions.inventory.setMoveItem(item)
        }

        render() {
            const thisModule=this
            const initMenu = function() {
                const menuDef = this.state.menuDef
                if (!menuDef) return null
                const menu = []
                const DropdownMenuItem = function(props) {
                    return <a id={props.id} class={'dropdown-item ' + ((props.emphasis) ? 'bold' : '')} onClick={props.onClick}>{props.label}</a>
                }

              if(app.actions.inventory.isInstanceContainerSelected()) {
                menu.push(<DropdownMenuItem label="Existing" emphasis onClick={this.addExisting.bind(this)} />)
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
            //console.log('actionNavbar render: app.state.inventory.physicalItem', app.state.inventory.physicalItem)

            /*
            const editPhysical = (app.state.inventory.physicalItem) ? (<EditPhysical state="EditPhysical" active="true" item={app.state.inventory.physicalItem} />) : null
            */
                                                                     
            const closeClickBackground = "position:fixed;top:0;left:0;right:0;bottom:0;background-color:rgba(0,0,0,0);"
            return (
                <div id="inventory_actions" class="tile is-1 is-vertical" style={actionsContainerStyle}>
                    <ActionMenuButton icon="home" onClick={this.homeItem.bind(this)} />
            
                    <div class={"dropdown tile "+this.state.enableAddItemMenu}>
                        <div class="dropdown-trigger">
                            <ActionMenuButton icon="plus" onClick={this.openAddItemMenu.bind(this)} />
                        </div>
                        <div class="dropdown-menu" id="dropdown-menu" role="menu">
                            <div onclick={this.closeAddItemMenu.bind(this)} style={closeClickBackground}>
                                <div class="dropdown-content" style={"position:fixed;top:200px;left:7px;"}>
                                    {menu}
                                </div>
                            </div>
                        </div>
                    </div>
            
                    <div class={"dropdown "+this.state.enableFavoritesMenu}>
                        <div class="dropdown-trigger">
                            <ActionMenuButton icon="star" onClick={this.openFavoritesMenu.bind(this)} />
                        </div>
                        <div class="dropdown-menu" id="dropdown-menu4" role="menu" style="margin:0;padding:0;">
                            <div onclick={this.closeFavoritesMenu.bind(this)} style={closeClickBackground}>
                                <div class="dropdown-content"  style={"position:fixed;top:265px;left:7px;"}>
                                    <div class="dropdown-item"  style="margin:0;padding:0;">
                                        <Favorites state="favorites" favorites={this.state.favorites} selectFunction={this.selectFavorite.bind(this)} addFunction={this.addFavorite.bind(this)} selectedItem={app.state.inventory.selection}/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <ActionMenuButton icon="pencil" onClick={this.editItem.bind(this)} />
                    <ActionMenuButton icon="cursor-move" onClick={this.moveItem.bind(this)} />
                    <ActionMenuButton icon="open-in-app" onClick={this.upload.bind(this)} />
                    <ActionMenuButton icon="delete" onClick={this.deleteItem.bind(this)} />
                </div>
            )
        }
    }
}
