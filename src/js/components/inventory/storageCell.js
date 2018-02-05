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
        }
        
        onClickCell(e) {
            this.setState({isActive:!this.state.isActive})
            var id=null
            if (this.props.item) {
                id = this.props.item.id
                app.actions.inventory.getInventoryPath(id)
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
                var backgroundColor = (this.state.isActive&0) ? '#00ffff' : cellBackground
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
