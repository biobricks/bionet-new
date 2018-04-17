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
            this.dragStart = this.dragStart.bind(this)
            this.drop = this.drop.bind(this)
            this.dragOver = this.dragOver.bind(this)
            this.clickCount = 0
            this.state = {
                active:props.active,
                occupied:props.occupied
            }
            this.setState({active:props.active})
        }
        
        componentWillReceiveProps(nextProps) {
            
            if (nextProps.active !== this.state.active) {
                this.setState({
                    active:nextProps.active
                })
            }
            
            if (nextProps.occupied !== this.state.occupied) {
                this.setState({
                    occupied:nextProps.occupied
                })
            }
        }
        
        onClickCell(e) {
            e.preventDefault();
            //console.log('storageCell onClickCell', this.props)
            const id = (this.props.item) ? this.props.item.id : null
            const navigate = this.props.mode !== 'edit' && id
            app.actions.inventory.selectCell(id, this.props.parent_id, this.props.parent_x, this.props.parent_y, navigate, this.props.history)
        }

        onDoubleClickCell(e) {
            e.preventDefault();
            if (this.props.mode === 'edit') return
            //console.log('onDoubleClickCell',e)
            if (this.props.item && this.props.item.id) app.actions.inventory.editItem(this.props.item)
            else app.actions.inventory.editItem({id:null, name:'new item', parent_id:this.props.parent_id, parent_x:this.props.parent_x, parent_y:this.props.parent_y})
        }
        
        getCellCoordinates() {
            return this.props.label
        }
        
        focus(active, occupied) {
            //if (active) console.log('setting focus for cell: ', this.props.label)
            this.setState({
                active:active
            })
        }
        
        occupied(occ) {
            const occupied = this.props.occupied || occ
            this.setState({
                occupied:occupied
            })
        }
        
        dragStart(e) {
          if (!this.props.item) return
          e.dataTransfer.setData("text/plain", this.props.item.id);
          e.dataTransfer.dropEffect = "copy";
        }
        
        drop(e) {
            
            e.preventDefault()
            var data = e.dataTransfer.getData("text")
            console.log('cell drop:',data)
            if (!data || data.length <= 0) return
            
            app.actions.inventory.moveItemLocation(data,this.props.parent_id, this.props.parent_x,this.props.parent_y,function(err,item) {
            })
            
        }
        
        dragOver(e) {
            e.preventDefault();
            e.dataTransfer.dropEffect = "move"
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
            
                const colStyle = "border: "+cellBorderWidth+"px solid black; height:"+this.props.height+"px; max-height:"+this.props.height+"px;width:"+this.props.width+"px;margin:0px;padding:0;padding-right:0px;font-weight:"+fontWeight+";"+textAlign
                
                const cellName = (this.props.item) ? this.props.item.name : ''
                const CellLabel = function(props) {
                    if (width>100) return (<span style={cellLabelStyle+"margin-left:5px;"}>{props.name}</span>)
                    else if (width>20) return (<span style={cellLabelStyle}>{props.text}</span>)
                    return null
                }.bind(this)
                    
                //if (this.state.active ) console.log('rendering cell:',this.props.label, this.state.active, this.state.occupied, this.props.state)

                var className = 'is-empty-cell '
                if (this.state.active) className = 'is-active-cell '
                else if (this.state.occupied) className = 'is-occupied-cell '
                    
                return (
                    <div id={this.props.id} className="tile tooltip" data-tooltip={this.props.name} style={colStyle} ondblclick={this.onDoubleClickCell} onclick={this.onClickCell} ondragstart={this.dragStart} ondrop={this.drop} ondragover={this.dragOver}>
                        <div className={className} style={"width:100%;"+textOverflow} draggable="true" >
                            <CellLabel text={this.props.label} name={cellName}/>
                        </div>
                    </div>
                )
        }
    }
}
