import {
    h
}
from 'preact'

module.exports = function (Component) {

    return class ItemTypes extends Component {
        constructor(props) {
            super(props);
            this.componentWillReceiveProps(props)
            this.selectType = this.selectType.bind(this)
        }
        
        componentWillReceiveProps(nextProps) {
            this.setState({
                type:nextProps.type,
                types:nextProps.types
            })
        }
        
        componentDidMount() {
            const clickId = this.props.fid
            const clickElement = document.getElementById(clickId)
            if (clickElement) {
                clickElement.addEventListener('click', function (e) {
                    if (e.target.id===clickId) {
                        e.preventDefault()
                        this.setState({active:!this.state.active})
                    }
                }.bind(this))
            }
        }
        
        selectType(e) {
            e.preventDefault()
            const type = e.target.id
            console.log('selectType:',type)
            this.setState({
                type:type,
                active:false
            })
            if (this.props.setType) this.props.setType(type)
        }
        
        render() {
            const types = this.state.types
            if (!types || !types.length) return
            const thisComponent = this
            const DropdownItem = function(props) {
                const active = (props.active) ? 'is-active' : ''
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
                                  
            const active = (this.state.active) ? ' is-active' : ''
            const classProps = (this.props.classProps) ? this.props.classProps+' ' : ''
            return(
                <div id={"wrapper"+this.props.fid} class={"dropdown tile "+active+classProps}>
                  <div class="dropdown-trigger" style="min-width:100%;width:100%">
                    <button type="button" id={this.props.fid} class="button" aria-haspopup="true" aria-controls="dropdown-menu3"  style="min-width:100%;width:100%;justify-content:flex-start">
                      <span id={this.props.fid}>{this.state.type}</span>
                      <span id={this.props.fid} class="icon is-small">
                        <a class="mdi mdi-menu-down" style="color:black;"></a>
                      </span>
                    </button>
                  </div>
                  <div class="dropdown-menu" id="dropdown-menu" role="menu">
                    <div class="dropdown-content" style="position:fixed;">
                        {typeElements}
                    </div>
                  </div>
                </div>
            )
        }
    }
}
