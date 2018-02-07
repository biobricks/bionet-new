import {
    h
}
from 'preact'
import linkState from 'linkstate';

module.exports = function (Component) {
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
            return true
        }
        
        componentWillReceiveProps(nextProps) {
            console.log('EditPhysical props:',nextProps)
            const isActive = (nextProps.active) ? 'is-active' : ''
            //if (!nextProps.active) return
            var name=''
            var type=nextProps.type
            var titlePrefix = 'Create '
            if (nextProps.item) {
                const item = nextProps.item
                titlePrefix = 'Edit '
                name = item.name
                type = item.type
            }
            this.setState({
                type:type,
                title:titlePrefix+type,
                active:isActive
                })
            return true
        }
        /*
        editItem(item) {
            console.log('editPhysical2 item:',item, this)
            //if (!item) return
            this.setState(
                {
                    type:item.type,
                    title:'Edit '+item.name,
                    active:'is-active',
                    id:item.id,
                    name:item.name
                }
            )
            //this.enableModal()
            //this.open()
            if (this.props.isOpen) this.props.isOpen(true)
        }
        */
        
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
            //console.log('EditPhysical render state:',this.state)
            
            return (
            <div class={"modal "+this.state.active}>
              <div class="modal-background" onclick={this.close}></div>
                  <div class="modal-content" style="background-color:#ffffff;padding:10px;height:500px;">
                
                <form onsubmit={this.submit.bind(this)}>
                
                <section class="hero is-info ">
                  <div class="hero-body">
                    <div class="container">
                      <h1 class="title">{this.state.title}</h1>
                    </div>
                  </div>
                </section>

                <div class="container post-hero-area">
                  <div class="columns">
                    <div class="column is-6">

                      <div class="field">
                        <label class="label">Id</label>
                        <div class="control has-icons-left has-icons-right">
                          <input class="input" type="text" oninput={linkState(this, 'id')} />
                        </div>
                        {this.nameMessage()}
                      </div>
                          
                      <div class="field">
                        <label class="label">Name</label>
                        <div class="control has-icons-left has-icons-right">
                          <input class="input" type="text" oninput={linkState(this, 'name')} />
                        </div>
                        {this.nameMessage()}
                      </div>

                      <div class="field">
                        <label class="label">Type</label>
                        <div class="control has-icons-left has-icons-right">
                          <input class="input" type="text" oninput={linkState(this, 'type')} />
                          {this.typeMessage()}
                        </div>
                      </div>
                          
                      <div class="field">
                        <div class="control">
                          <input type="submit" class="button is-link" value="Submit" />
                        </div>
                      </div>

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
