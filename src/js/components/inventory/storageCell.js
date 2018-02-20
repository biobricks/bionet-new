import {
    h
}
from 'preact'

module.exports = function (Component) {

    return class StorageCell extends Component {
        constructor(props) {
            super(props);
            this.onClickCell = this.onClickCell.bind(this)
            this.getCellCoordinates = this.getCellCoordinates.bind(this)
            this.onDoubleClickCell = this.onDoubleClickCell.bind(this)
            this.componentWillReceiveProps(props)
            this.clickCount = 0
        }
        
        componentWillReceiveProps(nextProps) {
            if (this.state.isActive !== nextProps.active) this.setState({isActive:nextProps.active})
        }
        
        onClickCell(e) {
            e.preventDefault();
            console.log('storageCell onClickCell')
            const id = (this.props.item) ? this.props.item.id : null
            app.actions.inventory.selectCell(id, this.props.parent_id, this.props.parent_x, this.props.parent_y, true)
        }

        onDoubleClickCell(e) {
            e.preventDefault();
            console.log('onDoubleClickCell',e)
            if (this.props.item && this.props.item.id) app.actions.inventory.editItem(this.props.item)
            else app.actions.inventory.editItem({id:null, name:'new item', parent_id:this.props.parent_id, parent_x:this.props.parent_x, parent_y:this.props.parent_y})
        }
        
        getCellCoordinates() {
            return this.props.label
        }
        
        focus(active, navigate) {
            this.setState({isFocused:active})
        }
        
        
        render() {
                //if (this.state.isActive) console.log('rendering cell:',this.props.label)
                const width = this.props.width
                const fontSize = (this.props.width>15) ? 11 : 8
                const lineHeight = this.props.height-1
                const textAlign = (width>100) ? 'text-align:left;' : 'text-align:center;'
                const textOverflow = "overflow:hidden;white-space:nowrap;text-overflow:ellipsis;"
                
                const cellLabelStyle = "font-size:"+fontSize+"px;line-height:"+lineHeight+"px;pointer-events:none;text-overflow:ellipsis;overflow:hidden;white-space:nowrap;width:"+width+"px;"+textAlign
                const cellBackground = (this.props.occupied) ? '#ffffff' : '#a0a0a0'
                
                const fontWeight = 300
                const cellBorderWidth = 1
                var cellBackground2 = (this.state.isActive) ? '#00ffff' : cellBackground
                var backgroundColor = (this.state.isFocused) ? '#00ffff' : cellBackground2
                const colStyle = "border: "+cellBorderWidth+"px solid black; height:"+this.props.height+"px; max-height:"+this.props.height+"px;width:"+this.props.width+"px;margin:0px;padding:0;padding-right:1px;background-color:"+backgroundColor+";font-weight:"+fontWeight+";"+textAlign
                
                const cellName = (this.props.item) ? this.props.item.name : ''
                const CellLabel = function(props) {
                    if (width>100) return (<span style={cellLabelStyle+"margin-left:5px;"}>{props.name}</span>)
                    else if (width>20) return (<span style={cellLabelStyle}>{props.text}</span>)
                }
                                       
                return (
                    <div id={this.props.id} class="tile tooltip" data-tooltip={this.props.name} style={colStyle} ondblclick={this.onDoubleClickCell} onclick={this.onClickCell} >
                        <div style={"width:100%;"+textOverflow}>
                            <CellLabel text={this.props.label} name={cellName}/>
                        </div>
                    </div>
                )
        }
    }
}
