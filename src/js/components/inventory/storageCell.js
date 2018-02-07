import {
    h
}
from 'preact'

module.exports = function (Component) {

    return class StorageCell extends Component {
        constructor(props) {
            super(props);
            this.onClickCell = this.onClickCell.bind(this)
            //console.log('view props:', JSON.stringify(props))
            this.state = {
                isActive:false
            }
            this.clickCount = 0
        }
        
        onClickCell(e) {
            e.preventDefault();
            console.log('onClickCell count:',this.clickCount)
            if (this.clickCount === 0) {
                const timer = setTimeout(function () {
                    console.log('onClickCell timeout count:',this.clickCount)
                    if (this.clickCount === 1) {
                        this.updateSelection(e)
                    }
                    this.clickCount = 0
                }.bind(this), 250)
            }
            if ( this.clickCount++ > 0 ) {
                if (this.props.item && this.props.item.id) app.actions.inventory.editItem(this.props.item)
                else app.actions.inventory.editItem({id:'null', name:'new item'})
                // edit cell contents
            }
        }
        
        updateSelection(e) {
            console.log('updateSelection: e',this)
            this.setState({isActive:!this.state.isActive})
            if (this.props.item) {
                if (this.props.item.id) app.actions.inventory.getInventoryPath(this.props.item.id)
            }
            //console.log('on click cell:',e.target.id,this.state.isActive, id)
        }
        
        render() {
                const width = this.props.width
                const fontSize = (this.props.width>15) ? 11 : 8
                const lineHeight = this.props.height-1
                const cellLabelStyle = "font-size:"+fontSize+"px;line-height:"+lineHeight+"px;text-align:center;"
                const cellBackground = (this.props.occupied) ? '#ffffff' : '#a0a0a0'
                // todo: highlight cell in current path
                var backgroundColor = (this.state.isActive) ? '#00ffff' : cellBackground
                const colStyle = "border: 1px solid black; height:"+this.props.height+"px; max-height:"+this.props.height+"px;width:"+this.props.width+"px;margin:0;padding:0;text-align:center;background-color:"+backgroundColor+";"
                
                const CellLabel = function(props) {
                    if (width>20) return (<span style={cellLabelStyle}>{props.text}</span>)
                }
                                       
                return (
                    <div id={this.props.id} class="tile is-child tooltip" data-tooltip={this.props.name} style={colStyle} onclick={this.onClickCell}>
                        <CellLabel text={this.props.label}/>
                    </div>
                )
        }
    }
}
