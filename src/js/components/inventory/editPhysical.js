import {
    h
}
from 'preact'
import linkState from 'linkstate';

module.exports = function (Component) {
    const StorageContainer = require('./storageContainer')(Component)
    return class EditPhysical extends Component {
        constructor(props) {
            super(props);
            this.state = {
                id:'',
                name: '',
                title: 'Add Physical',
                type: '',
                active:''
            };
            this.close = this.close.bind(this)
            this.close()
            this.id = null
            this.item = null
            return true
        }
        
        componentWillReceiveProps(nextProps) {
            console.log('EditPhysical props:',nextProps)
            var isActive = false
            if (nextProps.active) {
                isActive=true
                //if (this.props.isOpen) this.props.isOpen(true)
            } else {
                //if (this.props.isOpen) this.props.isOpen(false)
            }
            
            var name=''
            var type=nextProps.type
            var titlePrefix = 'Create '
            
            if (nextProps.item) {
                const item = nextProps.item
                titlePrefix = 'Edit '
                name = item.name
                type = item.type
                this.id = item.id
                this.item = item
            } else {
                this.item = null
                this.id = null
            }
            
            this.setState({
                id:this.id,
                type:type,
                name:name,
                title:titlePrefix+type,
                active:(isActive) ? 'is-active' : ''
                })
        }
        
        enableModal() {
            //console.log('enableModal:',app.state.global.enableEditPhysical)
            const isActive = (app.state.global.enableEditPhysical)  ? 'is-active' : ''
            this.setState({active:isActive})
        }
        
        nameMessage() {
            
        }
        
        typeMessage() {
            
        }
        
        submit(e) {
            e.preventDefault();
            this.close()
            
            // edit existing item
            var dbData = null
            if (this.item) {
                dbData = this.item
                
            // create new item
            } else {
                dbData={}
                dbData.parent_id = this.parent_id
                dbData.parent_x = this.parent_x
                dbData.parent_y = this.parent_y
            }
            
            // merge form data
            dbData.name = this.state.name
            dbData.type = this.state.type
            console.log('edit physical, submit:',dbData)
            
            /*
            app.actions.saveToInventory(dbData, null, null, function(id) {
            })
            */
            
        }
        
        open() {
            this.setState({active:'is-active'})
            if (this.props.isOpen) this.props.isOpen(true)
        }
        
        close () {
            this.setState({active:''})
            if (this.props.isOpen) this.props.isOpen(false)
        }
        
        render() {
            console.log('EditPhysical render state:',this.state, this.props)
            
            const selectedItemId = (this.props.item) ? this.props.item.id : null
            const item = app.state.global.inventoryItemParent
            console.log('EditStorageContainer:',selectedItemId)
            const containerSize = 400
            const style = "width:400px; height:400px;border: 1px solid black;"
            var storageContainer = null
            if (item) {
                storageContainer = (<StorageContainer dbid={item.id} height={containerSize} width={containerSize} title={item.name} childType={item.child} xunits={item.xUnits} yunits={item.yUnits} items={item.children} selectedItem={selectedItemId}  px={this.props.item.parent_x} py={this.props.item.parent_y}/>)
            }
                
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

                      <div class="field">
                        <label class="label">Id</label>
                        <div class="control has-icons-left has-icons-right">
                          <input class="input" type="text" oninput={linkState(this, 'id')}  value={this.state.id}/>
                        </div>
                        {this.nameMessage()}
                      </div>
                          
                      <div class="field">
                        <label class="label">Name</label>
                        <div class="control has-icons-left has-icons-right">
                          <input class="input" type="text" oninput={linkState(this, 'name')} value={this.state.name} />
                        </div>
                        {this.nameMessage()}
                      </div>

                      <div class="field">
                        <label class="label">Type</label>
                        <div class="control has-icons-left has-icons-right">
                          <input class="input" type="text" oninput={linkState(this, 'type')}  value={this.state.type}/>
                          {this.typeMessage()}
                        </div>
                      </div>
                          
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
