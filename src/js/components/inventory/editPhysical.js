import {
    h
}
from 'preact'
import linkState from 'linkstate';

module.exports = function (Component) {
    const StorageContainer = require('./storageContainer')(Component)
    const ItemTypes = require('./itemTypes')(Component)
    return class EditPhysical extends Component {
        constructor(props) {
            super(props);
            this.componentWillReceiveProps(this.props)
            this.close = this.close.bind(this)
            this.setType = this.setType.bind(this)
            /*
            var item = this.props.item
            this.item = item
            this.state = {
                id:'',
                name: '',
                title: 'Add Physical',
                type: '',
                attributes:[],
                active:(this.props.active) ? 'is-active' : '',
                tabular:this.props.tabular
            };
            this.id = null
            this.close()
            */
        }
        
        componentWillReceiveProps(nextProps) {
            console.log('EditPhysical props:',nextProps)
            const active = (nextProps.active) ? 'is-active' : ''
            const tabular = nextProps.tabular
            if (!nextProps.item) {
                this.setState({
                    active:active,
                    tabular:tabular
                })
                return
            }
            
            var item = nextProps.item
            this.item = item
            var titlePrefix = (item.id) ? 'Edit ' : 'Create '
            this.id = item.id
            this.parent_item = app.actions.inventory.getItemFromInventoryPath(item.parent_id)
            
            this.setState({
                id:item.id,
                attributes:app.actions.inventory.getAttributesForType(item.type),
                title:titlePrefix+item.type,
                active:active,
                tabular:tabular
            })
        }
        
        enableModal() {
            //console.log('enableModal:',app.state.global.enableEditPhysical)
            const isActive = (app.state.global.enableEditPhysical)  ? 'is-active' : ''
            this.setState({active:isActive})
        }
        
        submit(e) {
            e.preventDefault();
            this.close()
            
            // edit existing item
            var dbData = this.item
            const selection = app.state.global.inventorySelection
            if (selection) {
                dbData.parent_id = selection.parentId
                dbData.parent_x = selection.x
                dbData.parent_y = selection.y
            }

            // merge form data
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
        
        open() {
            this.setState({active:'is-active'})
            if (this.props.isOpen) this.props.isOpen(true)
        }
        
        close () {
            this.setState({active:''})
            if (this.props.isOpen) this.props.isOpen(false)
        }
        
        setType(type) {
            this.item.type = type
        }
        
        msgFunction(msg) {
            //return ''
        }
        
        render() {
            //console.log('EditPhysical render state:',this.state, this.props)
            const item = this.item
            if (!item) return null
            const selectedItemId = (item) ? item.id : null
            //console.log('EditStorageContainer:',selectedItemId)
            const containerSize = 400
            const style = "width:400px; height:400px;border: 1px solid black;"
            var storageContainer = null
            const tabular = this.state.tabular
            
            const parent_item = this.parent_item
            if (parent_item) {
                var px = 0
                var py = 0
                if (item) {
                    px = item.parent_x
                    py = item.parent_y
                }
                storageContainer = (<StorageContainer dbid={parent_item.id} height={containerSize} width={containerSize} title={parent_item.name} childType={parent_item.child} xunits={parent_item.xUnits} yunits={parent_item.yUnits} items={parent_item.children} selectedItem={selectedItemId}  px={px} py={py} />)
            }
                      
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
                    //                    <div class="tile is-child is-3">Name</div>

                    return(
                        <div class="tile is-child is-3" style="padding:0; margin:0">
                            <input class="input" type="text" placeholder={props.label} oninput={linkFormData(this, props.fid)} value={props.value} readonly={props.readonly}>
                                {this.msgFunction(props.msg)}
                            </input>
                        </div>
                    )
                } else {
                    return (
                        <div class="field">
                            <label class="label">{props.label}</label>
                            <div class="control has-icons-left has-icons-right">
                                <input class="input" type="text" placeholder={props.label} oninput={linkFormData(this, props.fid)} value={props.value} readonly={props.readonly}/>
                            </div>
                            {this.msgFunction(props.msg)}
                        </div>
                    )
                }
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
            const types= (app.state.global.inventoryTypes) ? app.state.global.inventoryTypes.locations : [] 
                                //<FormInputText fid='type' value={this.item.type} label="Type" />
            if (tabular) {
                //                            <ItemTypes type={this.item.type} types={types} setType={this.setType}/>

                return (
                    <form onsubmit={this.submit.bind(this)}>
                        <div class="tile is-parent is-11"  style="padding:0; margin:0">
                            <FormInputText fid='name' value={this.item.name} label="Name" />
                            <ItemTypes type={this.item.type} types={types} setType={this.setType} class="tile is-child is-3"/>
                            {attributes}
                        </div>
                    </form>
                )
            } else {
                return (
                    <div class={"modal "+this.state.active}>
                      <div class="modal-background" onclick={this.close}></div>
                          <div class="modal-content" style="background-color:#ffffff;padding:10px;width:calc(100vw - 25%);">
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
                                            <FormInputText fid='id' value={this.item.id} label="Id" readonly="true"/>
                                            <FormInputText fid='name' value={this.item.name} label="Name" />
                                            <label class="label">Type</label>
                                            <ItemTypes type={this.item.type} types={types} setType={this.setType}/>
                                            {attributes}
                                            <div class="field">
                                                <div class="control">
                                                    <input type="submit" class="button is-link" value="Submit" />
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
