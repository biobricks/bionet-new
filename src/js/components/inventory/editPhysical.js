import {
    h
}
from 'preact'
import linkState from 'linkstate';
import ashnazg from 'ashnazg'

module.exports = function (Component) {
    const StorageContainer = require('./storageContainer')(Component)
    const ItemTypes = require('./itemTypes')(Component)
    //const EditTable = require('./editTable')(Component)
    
    return class EditPhysical extends Component {
        constructor(props) {
            super(props);
            this.componentWillReceiveProps(props)
            this.focus = this.focus.bind(this)
            this.close = this.close.bind(this)
            this.inventoryCellLocation=this.inventoryCellLocation.bind(this)
            ashnazg.listen('global.inventoryCellLocation', this.inventoryCellLocation.bind(this));
        }
        
        componentWillReceiveProps(nextProps) {
            if (!nextProps.tabular) console.log('EditPhysical props:',nextProps)
            const active = (nextProps.active) ? 'is-active' : ''
            
            var item={}
            if (nextProps.item) {
                item = nextProps.item
            } else {
                item.id = null
                item.parent_id = null
            }
            
            this.item = item
            this.id = item.id
            this.parent_item = (item.parent_id) ? app.actions.inventory.getItemFromInventoryPath(item.parent_id) : null
            
            const titlePrefix = (this.id) ? 'Edit '+item.name : 'Create '+item.type
            const attributes = (item.type) ? app.actions.inventory.getAttributesForType(item.type) : []
            
            this.setState({
                attributes:attributes,
                title:titlePrefix,
                active:active
            })
            
        }
        
        inventoryCellLocation(loc) {
            console.log('setting parent x,y',loc,this.parent_item,this.id)
            if (this.props.tabular) return
            //console.log('setting parent x,y',loc,this.parent_item,this.id)
            if (loc.parentId !== this.parent_item) return
            /*
            this.setState(
                {
                    px:loc.x,
                    py:loc.y
                }
            )
            */
            this.item.parent_x = loc.x
            this.item.parent_y = loc.y
            //console.log('inventoryCellLocation',loc, this.item)
        }
        
        enableModal() {
            //console.log('enableModal:',app.state.global.enableEditPhysical)
            const isActive = (app.state.global.enableEditPhysical)  ? 'is-active' : ''
            this.setState({active:isActive})
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
            this.close()
            
            // edit existing item
            var dbData = this.item
            
            const selection = app.state.global.inventorySelection
            if (selection && !this.item.id) {
                dbData.parent_id = selection.parentId
                dbData.parent_x = selection.x
                dbData.parent_y = selection.y
            }

            // merge form data
            delete dbData.salt
            delete dbData.loc
            console.log('edit physical, submit:',dbData, selection)
            //return
            app.actions.inventory.saveToInventory(dbData, null, null, function(err, id) {
                if (err) {
                    app.actions.notify("Error saving "+dbData.name, 'error');
                    return
                }
                app.actions.notify(dbData.name+" saved", 'notice', 2000);
                app.actions.inventory.getInventoryPath(dbData.parent_id)
            })
            
        }
        
        close () {
            this.setState({active:''})
            if (this.props.isOpen) this.props.isOpen(false)
        }
        
        onClickRow(e) {
            e.preventDefault();
            if (this.props.onFocus) this.props.onFocus(this.props.id)
        }
        
        focus(active, navigate) {
            if (active) console.log('focus selectedRow:',this.props.item)
            this.setState({isFocused:active})
            //if (active) app.actions.inventory.updateCellLocation(this.props.id, this.props.item.parent_id, this.props.item.parent_x, this.props.item.parent_y )
            if (active) app.actions.inventory.selectCell(this.props.id, this.props.item.parent_id, this.props.item.parent_x, this.props.item.parent_y, false )
        }
        
        msgFunction(msg) {
            //return ''
        }
        
        editVirtual(e) {
            e.preventDefault();
            if (!this.props.item) return
            console.log('edit virtual:',this.props.item)
        }
        
        render() {
            //console.log('EditPhysical render state:',this.state, this.props)
            const item = this.item
            if (!item) return null
            const selectedItemId = (item) ? item.id : null
            //console.log('EditStorageContainer:',selectedItemId)
            const containerSize = 250
            const style = "width:400px; height:400px;border: 1px solid black;"
            const tabular = this.props.tabular
            
            const parent_item = this.parent_item
                      
            const linkFormData = function(component, fid, valuePath) {
              return event => {
                var update = {};
                update[fid] = event.currentTarget.value;
                Object.assign(this.item, update)
              };
            }.bind(this)
                
            const FormInputText = function(props) {
                //console.log('FormInputText:',props)
                if (tabular) {
                    return(
                        <div class={"tile is-child "+props.classProps} style="padding:0; margin:0">
                            <input id={props.fid} class="input" type="text" placeholder={props.label} oninput={linkFormData(this, props.fid)} value={props.value} readonly={props.readonly} onblur={this.onblur.bind(this)}>
                                {this.msgFunction(props.msg)}
                            </input>
                        </div>
                    )
                } else {
                    return (
                        <div class="field">
                            <label class="label">{props.label}</label>
                            <div class="control has-icons-left has-icons-right">
                                <input class="input" style="padding-left: 0.75em;" type="text" placeholder={props.label} oninput={linkFormData(this, props.fid)} value={props.value} readonly={props.readonly}/>
                            </div>
                            {this.msgFunction(props.msg)}
                        </div>
                    )
                }
            }.bind(this)
            
            const ActionButton = function(props) {
                const classProps = (props.classProps) ? props.classProps : ''
                return (
                    <div onclick={props.onclick} class={"tile is-1 "+classProps} style="padding:0; margin:0;align-items:center;cursor:pointer;">
                        <div class={"tile button is-small mdi mdi-18px mdi-"+props.icon} style="color:#606060;"></div>
                    </div>
                   )
            }
            
            const attributeDefs = this.state.attributes
            const attributes=[]
            if (attributeDefs) {
                for (var i=0; i<attributeDefs.length; i++) {
                    var field = attributeDefs[i]
                    var fieldId = field.name.toLowerCase()
                    var label = fieldId.charAt(0).toUpperCase() + fieldId.slice(1);
                    var value = (item && item[fieldId]) ? item[fieldId] : ''
                    var classProps = (this.props.classProps && (i+3<this.props.classProps.length)) ? this.props.classProps[i+3].class : ''
                    attributes.push( <FormInputText fid={fieldId} label={label} value={value}  classProps={classProps}/> )
                }
            }
                                    
            var types=[]
            const currentSelectionType = parent_item.type.toLowerCase()
            const isBox = currentSelectionType.indexOf('box') >= 0
            if (app.state.global.inventoryTypes && parent_item) {
                types = (isBox) ? app.state.global.inventoryTypes.materials : app.state.global.inventoryTypes.locations
            }
                    
            var document = null
            if (isBox) {
                document = (<ActionButton dbid={selectedItemId} onclick={this.editVirtual.bind(this)} icon="file-document" />)
            }

            if (tabular) {
                const focusStyle = (this.state.isFocused) ? 'border: 1px solid black;' : ''
                const label = this.item.parent_x+','+this.item.parent_y
                //console.log('tabular:',this.props.classProps)
                return (
                    <form onsubmit={this.submit.bind(this)}>
                        <div class="tile is-parent is-11"  style={"box-sizing:border-box;padding:0; margin:0;"+focusStyle} onclick={this.onClickRow.bind(this)}>
                            <FormInputText fid='name' value={this.item.name} label="Name" classProps={this.props.classProps[0].class}/>
                            <ItemTypes type={this.item.type} types={types} setType={this.setType} classProps={this.props.classProps[1].class} onblur={this.onblur.bind(this)} />
                            <FormInputText fid='loc' value={label} label="Loc"  classProps={this.props.classProps[2].class}/>
                            {document}
                            {attributes}
                        </div>
                    </form>
                )
            } else {
                //const editTable=(item.type.indexOf('box') >= 0) ? <EditTable item={item} items={item.children}/> : null
                const editTable = null
                var storageContainer = null
                if (parent_item) {
                    storageContainer = (<StorageContainer dbid={parent_item.id} height={containerSize} width={containerSize} title={parent_item.name} childType={parent_item.child} xunits={parent_item.xUnits} yunits={parent_item.yUnits} item={parent_item} items={parent_item.children} selectedItem={selectedItemId}  px={this.item.parent_x} py={this.item.parent_y} mode="edit"/>)
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
                                            <div style="margin-top:10px;margin-bottom:30px;">
                                                {attributes}
                                            </div>
                                            {editTable}
                                            <div class="field">
                                                <div class="control">
                                                    <input type="submit" class="button is-link" value="Save" />
                                                    <span style="margin-right:20px;">&nbsp;</span>
                                                    <input type="button" class="button is-link" value="Cancel" onclick={this.close} />
                                                </div>
                                            </div>
                                        </div>
                                        <div class="column">
                                            {storageContainer}
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
}
