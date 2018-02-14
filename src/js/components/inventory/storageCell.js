import {
    h
}
from 'preact'

module.exports = function (Component) {

    return class StorageCell extends Component {
        constructor(props) {
            super(props);
            this.onClickCell = this.onClickCell.bind(this)
            this.onDoubleClickCell = this.onDoubleClickCell.bind(this)
            this.state = {
                isActive:false,
                isSelected:false
            }
            this.clickCount = 0
        }
        
        componentWillReceiveProps(nextProps) {
            this.setState({
                isActive:nextProps.active,
                isSelected:false
            })
        }
        
        onClickCell(e) {
            e.preventDefault();
            console.log('updateSelection: e',this)
            //this.setState({isActive:!this.state.isActive})
            //this.setState({isSelected:true})
            var itemId = null
            const parentId = this.props.parent_id
            app.actions.inventory.deselectItem(parentId)
            this.setState({isActive:true})
            if (this.props.item) {
                itemId = this.props.item.id
                if (itemId) app.actions.inventory.getInventoryPath(itemId)
            }
            app.actions.inventory.selectCell(itemId, parentId, this.props.parent_x, this.props.parent_y )
            //console.log('on click cell:',e.target.id,this.state.isActive, id)
        }

        onDoubleClickCell(e) {
            console.log('onDoubleClickCell',e)
            e.preventDefault();
            if (this.props.item && this.props.item.id) app.actions.inventory.editItem(this.props.item)
            else app.actions.inventory.editItem({id:null, name:'new item', parent_id:this.props.parent_id, parent_x:this.props.parent_x, parent_y:this.props.parent_y})
        }
        
        deactivate() {
            this.setState({isActive:false})
        }
        
        
        render() {
                const width = this.props.width
                const fontSize = (this.props.width>15) ? 11 : 8
                const lineHeight = this.props.height-1
                const cellLabelStyle = "font-size:"+fontSize+"px;line-height:"+lineHeight+"px;text-align:center;pointer-events:none;"
                const cellBackground = (this.props.occupied) ? '#ffffff' : '#a0a0a0'
                
                const fontWeight = (this.state.isSelected) ? 800 : 300
                const cellBorderWidth = (this.state.isSelected) ? 1 : 1
                var backgroundColor = (this.state.isActive) ? '#00ffff' : cellBackground
                const colStyle = "border: "+cellBorderWidth+"px solid black; height:"+this.props.height+"px; max-height:"+this.props.height+"px;width:"+this.props.width+"px;margin:0px;padding-right:1px;text-align:center;background-color:"+backgroundColor+";font-weight:"+fontWeight+";"
                
                const CellLabel = function(props) {
                    if (width>20) return (<span style={cellLabelStyle}>{props.text}</span>)
                }
                                       
                return (
                    <div id={this.props.id} class="tile is-child tooltip" data-tooltip={this.props.name} style={colStyle} ondblclick={this.onDoubleClickCell} onclick={this.onClickCell} >
                        <CellLabel text={this.props.label}/>
                    </div>
                )
        }
    }
}
