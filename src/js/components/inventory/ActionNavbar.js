import {
    h
}
from 'preact'

module.exports = function (Component) {
    
    return class ActionNavBar extends Component {
        
        constructor(props) {
            super(props);
            this.state = {
                addItemMenuDisplay:'',
                addMenu:{}
            }
        }
        
        componentWillReceiveProps(nextProps)
        {
            if (!nextProps || !nextProps.menu) return
            //console.log('ActionNavBar props:',nextProps.menu)
            
            const menuDef = nextProps.menu
            const menu = []
            
            const DropdownMenuItem = function(props) {
                return <a id={props.id} class="dropdown-item {props.isActive}" onClick={props.onClick}>{props.label}</a>
            }
            
            for (var i=0; i<menuDef.length; i++) {
                var item = menuDef[i]
                menu.push(<DropdownMenuItem id={'add_'+item.name} label={item.title} onClick={this.addItemClick.bind(this)} />)
            }
            this.setState({addMenu:menu})
        }
        
        addItemClick(e) {
            console.log('add menu item:',e.target.id)
            this.setState({addItemMenuDisplay:''})
        }
        
        addItem() {
            const addItemMenuActive = (this.state.addItemMenuDisplay==='is-active') ? '' :'is-active'
            this.setState({addItemMenuDisplay:addItemMenuActive})
        }
        
        starItem() {
            //console.log('star item')
            var n = parseInt(Math.random()*5+1)
            app.actions.inventory.getPath(n)
        }
        
        editItem() {
            //console.log('edit item')
            app.actions.inventory.getPath(2)
        }
        
        deleteItem() {
            app.actions.inventory.getPath(3)
            //console.log('delete item')
        }
        
        upload() {
            //console.log('upload item')
            app.actions.inventory.getPath(4)
        }
        
        render() {
                    
            
            var by = 25
            const ActionMenuButton = function(props) {
                by += 65
                var style = "position:fixed; border-radius:50%; width:55px; height:55px; top:"+by+"px; left:10px;color:#ffffff;background-color:#0080ff;"
                return <button class="button" onclick={props.onClick} style={style}><i class="material-icons">{props.icon}</i></button>
            }
                
            return (
                <div id="inventory_actions">
                    <div class={"dropdown "+this.state.addItemMenuDisplay}>
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
                </div>
            )
        }
    }
}
