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
            this.clickCount = 0
            this.setState({active:props.active})
        }
        
        componentWillReceiveProps(nextProps) {
            if (nextProps.active !== this.state.active) this.setState({active:nextProps.active})
            //this.setState({active:nextProps.active})
        }
        
        onClickCell(e) {
            e.preventDefault();
            //console.log('storageCell onClickCell', this.props)
            const id = (this.props.item) ? this.props.item.id : null
            const navigate = this.props.mode !== 'edit'
            app.actions.inventory.selectCell(id, this.props.parent_id, this.props.parent_x, this.props.parent_y, navigate, this.props.history)
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
            if (active) console.log('setting focus for cell: ', this.props.label)
            this.setState({active:active})
        }
        
        render() {
                const width = this.props.width
                const fontSize = (this.props.width>15) ? 11 : 8
                const lineHeight = this.props.height-1
                const textAlign = (width>100) ? 'text-align:left;' : 'text-align:center;'
                const textOverflow = "overflow:hidden;white-space:nowrap;text-overflow:ellipsis;"
                
                const cellLabelStyle = "font-size:"+fontSize+"px;line-height:"+lineHeight+"px;pointer-events:none;text-overflow:ellipsis;overflow:hidden;white-space:nowrap;width:"+width+"px;"+textAlign
                
                const fontWeight = 300
                const cellBorderWidth = 1
                
                const cellBackground = (this.props.occupied) ? '#ffffff' : '#a0a0a0'
                var backgroundColor = (this.state.active) ? '#00ffff' : cellBackground
                if (this.state.active) console.log('rendering active cell:',this.props.label, backgroundColor)
                
                const colStyle = "border: "+cellBorderWidth+"px solid black; height:"+this.props.height+"px; max-height:"+this.props.height+"px;width:"+this.props.width+"px;margin:0px;padding:0;padding-right:1px;background-color:"+backgroundColor+";font-weight:"+fontWeight+";"+textAlign
                
                const cellName = (this.props.item) ? this.props.item.name : ''
                const CellLabel = function(props) {
                    if (width>100) return (<span style={cellLabelStyle+"margin-left:5px;"}>{props.name}</span>)
                    else if (width>20) return (<span style={cellLabelStyle}>{props.text}</span>)
                    return null
                }.bind(this)
                                       
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
