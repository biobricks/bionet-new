import {
    h
}
from 'preact'

module.exports = function (Component) {

    return class dropdownButton extends Component {

        constructor(props) {
            super(props);
            this.selectItem = this.selectItem.bind(this)
            this.componentWillReceiveProps(props)
        }
        
        componentWillReceiveProps(nextProps) {
            this.setState({
                selectedItem:nextProps.selectedItem
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

        selectItem(e) {
            e.preventDefault()
            const selectedItem = e.target.id
            console.log('selectItem:',selectedItem)
            this.setState({
                selectedItem:selectedItem,
                active:false
            })
            if (this.props.setSelectedItem) this.props.setSelectedItem(selectedItem)
        }

        render() {
            const selectionList = this.props.selectionList
            if (!selectionList || !selectionList.length) return
            const thisComponent = this
            const DropdownItem = function(props) {
                const active = (props.active) ? 'is-active' : ''
                return (
                      <div id={props.item} className={"dropdown-item "+active} onclick={thisComponent.selectItem}>{props.title}</div>
                )
            }
            
            const items = []
            const selectedItem = this.state.selectedItem
            for (var i=0; i<selectionList.length; i++) {
                var item = selectionList[i]
                items.push(<DropdownItem item={item} title={item} active={selectedItem === item} />)
            }
                                  
            const active = (this.state.active) ? ' is-active' : ''
            const classProps = (this.props.classProps) ? this.props.classProps+' ' : ''
            return(
                <div id={"wrapper"+this.props.fid} className={"dropdown tile "+active+classProps}>
                  <div className="dropdown-trigger" style="min-width:100%;width:100%">
                    <button type="button" id={this.props.fid} className="button" aria-haspopup="true" aria-controls="dropdown-menu3"  style="min-width:100%;width:100%;justify-content:flex-start">
                        <span id={this.props.fid}>{this.state.selectedItem}</span>
                        <span className="icon is-small">
                            <i id={this.props.fid} className="mdi mdi-menu-down" aria-hidden="true"></i>
                        </span>                
                    </button>
                  </div>
                  <div className="dropdown-menu" id="dropdown-menu" role="menu">
                    <div className="dropdown-content" style="position:fixed;">
                        {items}
                    </div>
                  </div>
                </div>
            )
        }
    }
}
