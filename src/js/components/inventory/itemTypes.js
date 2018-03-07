import {
    h
}
from 'preact'

module.exports = function (Component) {

    return class ItemTypes extends Component {
        constructor(props) {
            super(props);
            this.componentWillReceiveProps(props)
            this.toggleDropdown = this.toggleDropdown.bind(this)
            this.selectType = this.selectType.bind(this)
        }
        
        componentWillReceiveProps(nextProps) {
            //console.log('Item types:',nextProps)
            this.setState({
                type:nextProps.type,
                types:nextProps.types
            })
        }
        
        toggleDropdown(e) {
            this.setState({active:!this.state.active})
        }
        
        mouseOut(e) {
            console.log('selectType mouse out')
        }
        
        selectType(e) {
            e.preventDefault()
            const type = e.target.id
            //console.log('selectType:',type)
            this.setState({
                type:type,
                active:false
            })
            if (this.props.setType) this.props.setType(type)
            if (this.props.onblur) this.props.onblur(e, "type", type)
        }
        
        render() {
            const types = this.state.types
            if (!types || !types.length) return
            const thisComponent = this
            const DropdownItem = function(props) {
                const active = (props.active) ? 'is-active' : ''
                //menu.push(<DropdownMenuItem id={item.name} label={item.title} onClick={this.addItemClick.bind(this)} />)
                return (
                      <div id={props.type} class={"dropdown-item "+active} onclick={thisComponent.selectType}>{props.title}</div>
                )
            }
            
            const typeElements = []
            const selectedType = this.state.type
            for (var i=0; i<types.length; i++) {
                var type = types[i]
                typeElements.push(<DropdownItem type={type.name} title={type.title} active={selectedType === type.name} />)
            }
                                  
            const active = (this.state.active) ? 'is-active' : ''
            return(
                <div class={"dropdown "+active+" tile "+this.props.classProps} style={this.props.style}>
                  <div class={"dropdown-trigger"}  style="min-width:100%;width:100%">
                    <button id={this.props.fid} class="button" aria-haspopup="true" aria-controls="dropdown-menu3" onclick={this.toggleDropdown.bind(this)}  style="min-width:100%;width:100%;justify-content:flex-start">
                      <span>{this.state.type}</span>
                      <span class="icon is-small">
                        <a class="mdi mdi-menu-down" style="color:black;"></a>
                      </span>
                    </button>
                  </div>
                  <div class="dropdown-menu" id="dropdown-menu" role="menu" >
                    <div class="dropdown-content test" onmouseout="this.mouseOut.bind(this)">
                        {typeElements}
                    </div>
                  </div>
                </div>
            )
        }
    }
}
