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
            if (app.state.inventory.listener) app.state.inventory.listener.assignPhysical = this.inventoryCellLocation.bind(this);
        }
        
        componentWillReceiveProps(nextProps) {
            console.log('editVirtual, props:',nextProps)
            const active = (nextProps.active) ? 'is-active' : ''
            //const active='is-active'
            if (!nextProps.item) {
                this.setState({
                    active:active
                })
                return
            }
            
            var item = nextProps.item
            this.item = item
            this.mode = (item.id) ? 'edit' : 'create'
            var titlePrefix = (item.id) ? 'Edit '+item.name : 'Create '+item.type
            this.id = item.id
            
            this.setState({
                id:item.id,
                physicals:item.children,
                mergedPhysicals:[],
                attributes:app.actions.inventory.getAttributesForType(item.type),
                title:titlePrefix,
                active:active
            })
        }
        
        inventoryCellLocation(loc) {
            console.log('inventoryCellLocation',loc)
            if (!loc.id ||!this.state.physicals ||!this.state.assignCells) return
            const physicals = this.state.physicals
            for (var i=0; i<physicals.length; i++) {
                if (physicals[i].id===loc.id) {
                    physicals[i].parent_x = loc.x
                    physicals[i].parent_y = loc.y
                    this.setState({physicals:physicals})
                    return
                }
            }
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
                    app.actions.notify(err.message, 'error');
                    return
                }
            })
        }
        
        saveVirtual(e) {
            this.close()
            const name = (this.item) ? this.item.name : ''
            app.actions.notify(name+" saved", 'notice', 2000);
            app.actions.inventory.forceRefresh(this.props.parent.id)
        }
        
        createPhysicals(e) {
            e.preventDefault();
            
            var dbData = (this.item) ? this.item : {}
            const instances = dbData.instances
            
            const thisModule=this
            delete dbData.instances
            app.actions.inventory.saveVirtual(dbData, function(err, virtual_id) {
                if (err) {
                    app.actions.notify(err.message, 'error');
                    return
                }
                console.log('saveVirtual result, ',virtual_id)
                dbData.id = virtual_id
                app.actions.notify(dbData.name+" created", 'notice', 2000);
                var wellData = {
                    x:1,
                    y:1
                }
                const subdivisions = thisModule.props.parent.subdivisions
                const emptyCellArray = app.actions.inventory.getEmptyCellArray(subdivisions) 
                app.actions.inventory.generatePhysicals(dbData.id, dbData.name, instances, thisModule.props.parent.id, emptyCellArray, function(err, physicals) {
                    if (err) {
                        app.actions.notify(err.message, 'error');
                        return
                    }
                    const mergedPhysicals = physicals.concat(thisModule.props.parent.children)
                    //console.log('generatePhysicals result, ',physicals, mergedPhysicals)
                    thisModule.setState({
                        mergedPhysicals:mergedPhysicals,
                        physicals:physicals,
                        assignCells:true
                    })
                })
            })
        }
        
        open() {
            this.setState({active:'is-active'})
            if (this.props.onClose) this.props.onClose(true)
        }
        
        close () {
            this.setState({active:''})
            app.actions.prompt.reset()
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
            //if (active) console.log('focus selectedRow:',this.props.item)
            this.setState({isFocused:active})
            if (active) app.actions.inventory.selectCell(this.props.id, this.props.parent.id, this.props.parent.parent_x, this.props.parent.parent_y, false )
        }
        
        assignCells() {
            this.setState({assignCells:true})
        }
        
        componentDidMount() {
          const nameInput = document.getElementById('name');
          if (nameInput) nameInput.focus(true);
        }
        
        render() {
            console.log('EditVirtual render state:',this.state, this.props)
            const item = this.item
            if (!item) return null
            const selectedItemId = (item) ? item.id : null
            //console.log('EditStorageContainer:',selectedItemId)
            const containerSize = 250
            const style = "width:400px; height:400px;border: 1px solid black;"
            
            const parent_item = this.props.parent
            var assignCells = null
            
            if (this.state.assignCells) {
                var storageContainer = null
                if (parent_item) {
                    var px = 0
                    var py = 0
                    if (item) {
                        px = parent_item.parent_x
                        py = parent_item.parent_y
                    }
                    storageContainer = (<StorageContainer dbid={parent_item.id} item={parent_item} height={containerSize} width={containerSize} title={parent_item.name} childType={parent_item.child} xunits={parent_item.xUnits} yunits={parent_item.yUnits} items={this.state.mergedPhysicals} selectedItem={selectedItemId}  px={px} py={py} mode="edit"/>)
                }
                assignCells = (
                    <div>
                        {storageContainer}
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
                    
            const GenerateVirtualForm = function(props) {
                var originator = null
                if (item.created) {
                    originator = (<div style="margin-bottom:10px;">Originator: {item.created.user}<br/></div>)
                }
                return (
                    <div>
                        <FormInputText fid='name' value={this.item.name} label="Name" />
                        {originator}
                        <label class="label">Type</label>
                        <ItemTypes fid="type" type={this.item.type} types={types} setType={this.setType}/>
                        <FormInputText fid='instances' value={this.item.name} label="Instances" />
                        <div style="margin-top:10px;margin-bottom:30px;">
                            {attributes}
                        </div>
                    </div>
                )
            }.bind(this)
            
            
            var virtualForm = null
            var tabularData = null
            if (this.state.assignCells) {
                tabularData = (
                    <div style="margin-bottom:20px;">
                        <EditTable item={item} items={this.state.physicals} height={window.innerHeight} mode="edit" />
                    </div>
                )
            } else {
                virtualForm = (<GenerateVirtualForm />)
            }
                               
            const nextStep = (assignCells) ?
                (
                    <span style="margin-right:20px;">
                        <input type="button" class="button is-link" value="Save" onclick={this.saveVirtual.bind(this)} />
                    </span>
                )
                :(
                    <span style="margin-right:20px;">
                        <input type="button" class="button is-link" value="Assign Locations" onclick={this.createPhysicals.bind(this)} />
                    </span>
                )

            return (
                <form onsubmit={this.saveVirtual.bind(this)}>
                    <div class="columns">
                        <div class="column">
                            {virtualForm}
                            {tabularData}
                            <div>
                                {nextStep}
                                <span class="control">
                                    <input type="button" class="button is-link" value="Cancel" onclick={this.close.bind(this)} />
                                </span>
                            </div>
                        </div>
                        <div class="column">
                            {assignCells}
                        </div>
                    </div>
                    <button class="modal-close" aria-label="close" onclick={this.close}></button>
                </form>
            )
        }
    }
}
