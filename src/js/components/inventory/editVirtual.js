import {
    h
}
from 'preact'
import linkState from 'linkstate';
import ashnazg from 'ashnazg'

module.exports = function (Component) {
    const StorageContainer = require('./storageContainer')(Component)
    const ItemTypes = require('./itemTypes')(Component)
    const EditTable = require('./editTable')(Component)
    
    return class EditVirtual extends Component {
        constructor(props) {
            super(props);
            this.componentWillReceiveProps(this.props)
            this.close = this.close.bind(this)
            this.focus = this.focus.bind(this)
            this.setType = this.setType.bind(this)
            this.assignCells = this.assignCells.bind(this)
            ashnazg.listen('global.inventoryCellLocation', this.inventoryCellLocation.bind(this));
        }
        
        componentWillReceiveProps(nextProps) {
            const active = (nextProps.active) ? 'is-active' : ''
            if (!nextProps.item) {
                this.setState({
                    active:active
                })
                return
            }
            
            var item = nextProps.item
            this.item = item
            var titlePrefix = (item.id) ? 'Edit '+item.name : 'Create '+item.type
            this.id = item.id
            this.parent_item = app.actions.inventory.getItemFromInventoryPath(item.parent_id)
            
            this.setState({
                id:item.id,
                physicals:item.children,
                attributes:app.actions.inventory.getAttributesForType(item.type),
                title:titlePrefix,
                active:active
            })
        }
        
        inventoryCellLocation(loc) {
            const px = this.item.parent_x
            const py = this.item.parent_y
            this.item.parent_x = loc.x
            this.item.parent_y = loc.y
            //console.log('inventoryCellLocation',loc, this.item)
        }
        
        onblur(e, fid, fvalue) {
            if (!this.item) return
            var id = e.target.id
            var value = e.target.value
            if (fid) {
                id = fid
                value = fvalue
            }
            const dbData = this.item
            dbData[id]=value
            console.log('onblur:',id, value, dbData)
            app.actions.inventory.saveToInventory(dbData, null, null, function(err, id) {
                if (err) {
                    app.actions.notify("Error saving "+dbData.name, 'error');
                }
            })
        }
        
        submit(e) {
            e.preventDefault();
            //this.close()
            
            const item = this.item
            var parentId = null
            var x = 1
            var y = 1
            var dbData = {}
            if (item) {
                dbData = {
                    name:item.name,
                    type:item.type
                }
                parentId = item.parent_id
            }
            
            const selection = app.state.inventory.selection
            var wellData = {
                x:1,
                y:1
            }
            if (selection) {
                // todo: enable selection of start item in box - parent type needs to be box to enable material selection menu
                /*
                wellData = {
                    x:selection.x,
                    y:selection.y
                }
                */
            }
            
            // merge form data
            const attributes = (item.type) ? app.actions.inventory.getAttributesForType(item.type) : []
            for (var i=0; i<attributes.length; i++) {
                var fid = attributes[i].name.toLowerCase()
                dbData[fid] = item[fid]
            }
            
            const thisModule=this
            app.actions.inventory.saveVirtual(dbData, item.instances, parentId, wellData, function(err, id, physicals) {
                console.log('physicals saved:',err,id,physicals)
                if (err) {
                    app.actions.notify("Error saving "+dbData.name, 'error');
                    return
                }
                app.actions.notify(dbData.name+" created", 'notice', 2000);
                if (physicals) {
                    thisModule.setState({physicals:physicals})
                }
            })
            
        }
        
        open() {
            this.setState({active:'is-active'})
            if (this.props.onClose) this.props.onClose(true)
        }
        
        close () {
            this.setState({active:''})
            app.actions.inventory.editVirtualItem(null)
            if (this.props.onClose) this.props.onClose(false)
        }
        
        setType(type) {
            this.item.type = type
        }
        
        onClickRow(e) {
            e.preventDefault();
            if (this.props.onFocus) this.props.onFocus(this.props.id)
        }
        
        focus(active, navigate) {
            if (active) console.log('focus selectedRow:',this.props.item)
            this.setState({isFocused:active})
            if (active) app.actions.inventory.selectCell(this.props.id, this.props.item.parent_id, this.props.item.parent_x, this.props.item.parent_y, false )
        }
        
        msgFunction(msg) {
            //return ''
        }
        
        assignCells() {
            this.setState({assignCells:true})
        }
        
        render() {
            //console.log('EditPhysical render state:',this.state, this.props)
            const item = this.item
            if (!item) return null
            const selectedItemId = (item) ? item.id : null
            //console.log('EditStorageContainer:',selectedItemId)
            const containerSize = 250
            const style = "width:400px; height:400px;border: 1px solid black;"
            
            const parent_item = this.parent_item
            var assignCells = null
            if (this.state.assignCells) {
                var storageContainer = null
                if (parent_item) {
                    var px = 0
                    var py = 0
                    if (item) {
                        px = item.parent_x
                        py = item.parent_y
                    }
                    storageContainer = (<StorageContainer dbid={parent_item.id} height={containerSize} width={containerSize} title={parent_item.name} childType={parent_item.child} xunits={parent_item.xUnits} yunits={parent_item.yUnits} items={parent_item.children} selectedItem={selectedItemId}  px={px} py={py} mode="edit"/>)
                }
                assignCells = (
                    <div>
                        {storageContainer}
                        <EditTable item={item} items={this.state.physicals}/>
                    </div>
                )
            }
                      
            const linkFormData = function(component, fid, valuePath) {
              return event => {
                var update = {};
                update[fid] = event.currentTarget.value;
                Object.assign(this.item, update)
              };
            }.bind(this)
                
            const FormInputText = function(props) {
                return (
                    <div class="field">
                        <label class="label">{props.label}</label>
                        <div class="control has-icons-left has-icons-right">
                            <input class="input" style="padding-left: 0.75em;" type="text" placeholder={props.label} oninput={linkFormData(this, props.fid)} value={props.value} readonly={props.readonly}/>
                        </div>
                        {this.msgFunction(props.msg)}
                    </div>
                )
            }.bind(this)
            
            const attributeDefs = this.state.attributes
            const attributes=[]
            if (attributeDefs) {
                for (var i=0; i<attributeDefs.length; i++) {
                    var field = attributeDefs[i]
                    var fieldId = field.name.toLowerCase()
                    var label = fieldId.charAt(0).toUpperCase() + fieldId.slice(1);
                    var value = (item && item[fieldId]) ? item[fieldId] : ''
                    attributes.push( <FormInputText fid={fieldId} label={label} value={value} /> )
                }
            }
                                    
            var types=[]
            if (app.state.inventory.types && parent_item) {
                const currentSelectionType = parent_item.type.toLowerCase()
                types = (currentSelectionType.indexOf('box') >= 0) ? app.state.inventory.types.materials : app.state.inventory.types.locations
            }

            return (
                <div class={"modal "+this.state.active}>
                  <div class="modal-background" onclick={this.close}></div>
                      <div class="modal-content" style="background-color:#ffffff;padding:10px;width:calc(100vw - 5%);">
                        <form onsubmit={this.submit.bind(this)}>

                            <section class="hero is-info ">
                              <div class="hero-body">
                                <div class="container">
                                  <h1 class="title">{this.state.title}</h1>
                                </div>
                              </div>
                            </section>
                            <div class=" post-hero-area">
                                <div class="columns">
                                    <div class="column">
                                        <FormInputText fid='name' value={this.item.name} label="Name" />
                                        <label class="label">Type</label>
                                        <ItemTypes fid="type" type={this.item.type} types={types} setType={this.setType}/>
                                        <FormInputText fid='instances' value={this.item.name} label="Instances" />
                                        <div style="margin-top:10px;margin-bottom:30px;">
                                            {attributes}
                                        </div>
                                        <div class="field">
                                            <div class="control">
                                                <input type="submit" class="button is-link" value="Create Physicals" />
                                                <span style="margin-right:20px;">&nbsp;</span>
                                                <input type="button" class="button is-link" value="Assign Locations" onclick={this.assignCells} />
                                                <span style="margin-right:20px;">&nbsp;</span>
                                                <input type="button" class="button is-link" value="Close" onclick={this.close} />
                                            </div>
                                        </div>
                                    </div>
                                    <div class="column">
                                        {assignCells}
                                    </div>
                                </div>
                            </div>
                        </form>
                        <button class="modal-close" aria-label="close" onclick={this.close}></button>
                    </div>
                </div>
            )
        }
    }
}
