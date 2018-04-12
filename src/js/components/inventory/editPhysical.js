import {
    h
}
from 'preact'
import linkState from 'linkstate';
import ashnazg from 'ashnazg'

module.exports = function (Component) {
    const StorageContainer = require('./storageContainer')(Component)
    const ItemTypes = require('./itemTypes')(Component)
    const DropdownButton = require('./dropdownButton')(Component)
    
    return class EditPhysical extends Component {
        constructor(props) {
            super(props);
            this.componentWillReceiveProps(props)
            this.focus = this.focus.bind(this)
            this.close = this.close.bind(this)
            this.setType = this.setType.bind(this)
            this.inventoryCellLocation=this.inventoryCellLocation.bind(this)
        }
        
        componentWillReceiveProps(nextProps) {
            //if (!nextProps.tabular) console.log('EditPhysical props:',nextProps)
            const active = (nextProps.active) ? 'is-active' : ''
            
            var item={}
            if (nextProps.item) {
                const dbData = JSON.parse(JSON.stringify(nextProps.item))
                // remove extraneous attributes
                delete dbData.loc
                delete dbData.children
                delete dbData.subdivisions
                item = dbData
            } else {
                item.id = null
                item.parent_id = null
            }
            
            this.item = item
            //if (item) console.log('editphysical props:',JSON.stringify(item,null,2))
            this.id = item.id
            this.parent_item = (item.parent_id) ? app.actions.inventory.getItemFromInventoryPath(item.parent_id) : null
            
            const titlePrefix = (this.id) ? 'Edit '+item.name : 'Create '+item.type
            const attributes = (item.type) ? app.actions.inventory.getAttributesForType(item.type) : []
            
            this.setState({
                item:item,
                attributes:attributes,
                title:titlePrefix,
                active:active
            })
            
        }
        
        inventoryCellLocation(loc) {
            //console.log('setting parent x,y',loc,this.parent_item,this.id)
            if (this.props.tabular) return
            if (loc.parentId !== this.parent_item) return
            const item = this.state.item
            item.parent_x = loc.x
            item.parent_y = loc.y
            this.setState({item:item})
        }
        
        onblur(e, fid, fvalue) {
            if (!this.state.item) return
            var id = e.target.id
            var value = e.target.value
            if (fid) {
                id = fid
                value = fvalue
            }
            const dbData = this.state.item
            dbData[id]=value
            this.setState({item:dbData})
            
            ///todo: saving rowdata causes inventory tree to be corrupted
            /*
            if (dbData.id) {
                app.actions.inventory.saveToInventory(dbData, null, null, function(err, id) {
                    if (err) {
                        app.actions.notify("Error saving "+dbData.name, 'error');
                    }
                })
            }
            */
        }
        
        setType(type) {
            const item = this.state.item
            item.type=type
            this.setState({item:item})
        }
        
        submit(e) {
            e.preventDefault();
            this.close()
            
            // deep-copy current item
            const dbData = this.state.item
            
            const selection = app.state.inventory.selection
            if (selection && !dbData.id) {
                dbData.parent_id = selection.parentId
            }
            dbData.parent_x = selection.x
            dbData.parent_y = selection.y

            console.log('edit physical, submit:',dbData, selection)
            //return
            app.actions.prompt.reset()
            app.actions.inventory.saveToInventory(dbData, null, null, function(err, id) {
                if (err) {
                    app.actions.notify(err.message, 'error');
                    return
                }
                app.actions.notify(dbData.name+" saved", 'notice', 2000);
                //console.log('savePhysical, forcing path refresh:',id)
                app.actions.inventory.forceRefresh(id)
            })
        }
        
        close () {
            this.setState({active:''})
            app.actions.inventory.editItem(null)
            if (this.props.onClose) this.props.onClose(false)
            app.actions.prompt.reset()
        }
        
        onClickRow(e) {
            e.preventDefault();
            if (this.props.onFocus) this.props.onFocus(this.props.id)
        }
        
        focus(active, navigate) {
            if (active) console.log('focus selectedRow:',this.props.item)
            this.setState({isFocused:active})
            if (active) {
                app.actions.inventory.selectCell(this.props.id, this.props.item.parent_id, this.props.item.parent_x, this.props.item.parent_y, false )
            }
        }
        
        navigateItem(e) {
            if (!this.state.item) return
            var id = this.state.item.id
            app.actions.inventory.selectInventoryId(id)
        }

        updateSelection(selection) {
            if (!this.state.isFocused || !this.state.item) return
            const dbData = this.state.item
            dbData.parent_x = selection.x
            dbData.parent_y = selection.y
            console.log('updateSelection, dbdata:',dbData, selection)
            this.setState({item:dbData})
            if (dbData.id) {
                app.actions.inventory.saveToInventory(dbData, null, null, function(err, id) {
                    if (err) {
                        app.actions.notify(err.message, 'error');
                        return
                    }
                })
            }
        }
        
        showVirtual(e) {
            console.log('edit virtual, props:',this.props)
            e.preventDefault();
            if (!this.props.item || !this.props.item.virtual_id) return

          app.actions.route('/virtual/show/'+this.props.item.virtual_id);
//            app.actions.inventory.editVirtualItem(this.props.item.virtual_id)
        }
        
        getLabel() {
            if (this.props.item) {
                const item = this.props.item
                const label = (item.parent_x && item.parent_y) ? item.parent_x+','+item.parent_y : ''
                return label
            }
        }
        
        componentDidMount() {
            if (!window.editPhysical) window.editPhysical=1
            else window.editPhysical++
            /*
            // todo: the focus method does not work in some browser configurations
          const nameInput = document.getElementById('name');
          if (nameInput && nameInput.focus) nameInput.focus(true);
          */
        }
        
        render() {
            //console.log('EditPhysical render state:',this.state, this.props)
            
            const item = this.state.item
            if (!item) return null
            
            const selectedItemId = item.id
            const style = "width:400px; height:400px;border: 1px solid black;"
            const tabular = this.props.tabular
            const parent_item = this.parent_item
                      
            const linkFormData = function(component, fid, valuePath) {
              return event => {
                var update = {};
                update[fid] = event.currentTarget.value;
                Object.assign(item, update)
              };
            }.bind(this)
                
            const FormInputText = function(props) {
                //console.log('FormInputText:',props)
                const value = (props.value) ? props.value : ''
                if (tabular) {
                    return(
                        <div className={"tile is-child "+props.classProps} style="padding:0; margin:0">
                            <input id={props.fid} className="input" type="text" placeholder={props.label} oninput={linkFormData(this, props.fid)} value={value} readonly={props.readonly} onblur={this.onblur.bind(this)}>
                            </input>
                        </div>
                    )
                } else {
                    return (
                        <div class="field">
                            <label className="label">{props.label}</label>
                            <div className="control has-icons-left has-icons-right">
                                <input id={props.fid} class="input" style="padding-left: 0.75em;" type="text" placeholder={props.label} oninput={linkFormData(this, props.fid)} value={value} readonly={props.readonly}/>
                            </div>
                        </div>
                    )
                }
            }.bind(this)
            
            const ActionButton = function(props) {
                const classProps = (props.classProps) ? props.classProps : ''
                return (
                    <div onclick={props.onclick} className={"tile is-1 "+classProps} style="padding:0; margin:0;align-items:center;cursor:pointer;">
                        <div className={"tile button is-small mdi mdi-18px mdi-"+props.icon} style="color:#606060;"></div>
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
                    var classProps = (this.props.classProps && this.props.classProps[i+3]) ? this.props.classProps[i+3].class : 'cnf'
                    attributes.push( <FormInputText fid={fieldId} label={label} value={value}  class={classProps}/> )
                }
            }
                                    
            var types=[]
            var isBox = false
            if (parent_item) {
                const currentSelectionType = parent_item.type.toLowerCase()
                var types = app.actions.inventory.getActiveTypes(currentSelectionType)
                //console.log('edit physical, types:',types, currentSelectionType)
                isBox = currentSelectionType.indexOf('box') >= 0
            }
            const typeSelectionList = types.map(type => type.title)

            if (tabular) {
                var document = null
                if (isBox) {
                    document = (<ActionButton dbid={selectedItemId} onclick={this.showVirtual.bind(this)} icon="file-document" />)
                }
                const focusStyle = (this.state.isFocused) ? 'border: 1px solid black;' : ''
                const label = (item.parent_x && item.parent_y) ? item.parent_x+','+item.parent_y : ''
                //console.log('tabular:',this.props.classProps)
                const navArrowStyle = "font-size:20px;line-height:35px;color:#808080;display:flex;justify-content:center;margin-right:0px;"
                const itemName = item.name
                /*
                            <ItemTypes type={item.type} types={typeSelectionList} setType={this.setType} classProps={this.props.classProps[2].class} onblur={this.onblur.bind(this)} />
                */
                return (
                    <form onsubmit={this.submit.bind(this)} style="padding:0;">
                        <div className="tabular-row tile is-parent is-11"  style={focusStyle+'padding:0;margin:0;box-sizing:border-box;'} onclick={this.onClickRow.bind(this)}>
                            <div className={"tile is-child "+this.props.classProps[0].class} style="justify-content:center;line-height:30px;">
                                <a onclick={this.navigateItem.bind(this)} class={"mdi mdi-arrow-right"} style={navArrowStyle}></a>
                            </div>
                            <FormInputText fid={itemName+'_name'} value={item.name} label="Name" classProps={this.props.classProps[1].class}/>
                            <DropdownButton fid={itemName+"_types"} selectedItem={item.type} selectionList={typeSelectionList} setSelectedItem={this.setType}/>
                            <FormInputText fid={itemName+'_loc'} value={label} label="Loc"  classProps={this.props.classProps[3].class}/>
                            {document}
                            {attributes}
                        </div>
                    </form>
                )
            } else {
                //const editTable=(item.type.indexOf('box') >= 0) ? <EditTable item={item} items={item.children}/> : null
                const containerSize = 250
                const editTable = null
                var storageContainer = null
                var originator = null
                if (item.created) {
                    originator = (<div style="margin-bottom:10px;">Originator: {item.created.user}<br/></div>)
                }
                if (parent_item) {
                    storageContainer = (<StorageContainer dbid={parent_item.id} height={containerSize} width={containerSize} title={parent_item.name} childType={parent_item.child} xunits={parent_item.xUnits} yunits={parent_item.yUnits} item={parent_item} items={parent_item.children} selectedItem={selectedItemId}  px={item.parent_x} py={item.parent_y} mode="edit"/>)
                }
                    
                const locationType = app.actions.inventory.getLocationType(item.type)
                var xUnits = (item.xUnits) ? item.xUnits : (locationType) ? locationType.xUnits : 1
                var yUnits = (item.yUnits) ? item.yUnits : (locationType) ? locationType.yUnits : 1
                                //<ItemTypes fid="type" type={item.type} types={types} setType={this.setType}/>
                
                return (
                    <form onsubmit={this.submit.bind(this)}>
                        <div class="columns">
                            <div class="column">
                                <FormInputText fid='name' value={item.name} label="Name" />
                                {originator}
                                <label class="label">Type</label>
                                <DropdownButton fid={item.name+"_types"} selectedItem={item.type} selectionList={typeSelectionList} setSelectedItem={this.setType}/>
                                <div style="margin-top:10px;margin-bottom:30px;">
                                    <FormInputText fid="xUnits" label="Cols" value={xUnits}/>
                                    <FormInputText fid="yUnits" label="Rows" value={yUnits}/>
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
                        <button class="modal-close" aria-label="close" onclick={this.close}></button>
                    </form>
                )
            }
        }
    }
}
