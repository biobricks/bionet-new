import {
    h
}
from 'preact'
import ashnazg from 'ashnazg'

module.exports = function (Component) {
    const StorageCell = require('./storageCell.js')(Component)
    return class StorageContainer extends Component {

        constructor(props) {
            super(props);
            //console.log('StorageContainer props:', JSON.stringify(props))
            this.cellRef = {}
        }
        
        initialize(nextProps) {
            //console.log('storageContainer initialize props:',nextProps)
            const xunits = (!nextProps.xunits || nextProps.xunits===0) ? 1: nextProps.xunits
            const yunits = (!nextProps.yunits || nextProps.yunits===0) ? 1: nextProps.yunits
            this.xunits = xunits
            this.yunits = yunits
            this.dbid = nextProps.dbid
            this.type = nextProps.type
            const tiles = this.subdivideContainer(nextProps.width, nextProps.height, xunits, yunits, nextProps.label, nextProps.childType, nextProps.selectedItem, nextProps.px, nextProps.py, nextProps.mode)
            if (nextProps.mode==='edit') {
                app.state.inventory.listener.editContainerListener = this.editContainerListener.bind(this)
                app.state.selectCellListener = this.selectCellListener.bind(this)
            }
            return tiles
        }
        
        componentDidMount() {
            if (this.props.mode==='edit') {
                //console.log('storage container componentDidMount:',this.props)
                app.actions.inventory.selectCell(null, this.props.dbid, this.props.px, this.props.py, false)
            }
        }

        subdivideContainer(pwidth, pheight, pxunits, pyunits, containerLabel, childType, selectedItemId, px, py, mode) {
            console.log('subdivideContainer', this.props)
            const subdivisions = this.props.item.subdivisions
            this.subdivisions = subdivisions
            if (!subdivisions || !subdivisions.length) return null
            if (this.props.items) {
                const item = this.props.item
                var cellMap = app.actions.inventory.generateCellMap(this.props.items, item.type, pxunits, pyunits)
                app.actions.inventory.mapOccupiedCellstoSubdivisions(subdivisions, cellMap, px, py)
            }
            const dy = pheight / pyunits
            const rows=[]
            const rowStyle = "width:"+pwidth+"px;max-height:"+dy+"px;margin:0;padding:0px;"
            const thisModule=this
            this.cellRef = {}
            
            for (var i = 0; i<subdivisions.length; i++) {
                var row = subdivisions[i]
                const cols=[]
                for (var j=0; j<row.length; j++) {
                    var col = row[j]
                    var ref = (item) => { if (item) thisModule.cellRef[item.props.label] = item; }
                    var storageCell = <StorageCell state={col.id} label={col.label} ref={ref} name={col.name} width={col.width} height={dy} occupied={col.isOccupied} item={col.item} parent_id={col.parent_id} parent_x={col.parent_x} parent_y={col.parent_y} active={col.isActive} mode={mode}/>
                    cols.push(storageCell)
                }
                rows.push(<div id="inventory_item" class="tile" style={rowStyle}>{cols}</div>)
            }
            const subdivisionStyle = "max-width:"+pwidth+"px;height:"+dy+"px;margin:0;padding:0px;"
            return (<div class="tile is-vertical" style={subdivisionStyle}>{rows}</div>)
        }
        
        getId() {
            return this.props.dbid
        }

        editContainerListener(occupied) {
            if (!occupied) return
            //console.log('editContainerListener ',occupied)
            for (var cellLabel in this.cellRef) {
                var ref = this.cellRef[cellLabel]
                if (ref) {
                    ref.occupied(occupied[cellLabel])
                }
            }
        }

        selectCellListener(cellLocation, edit) {
            //console.log('selectCellListener, storageContainer:',edit, this.dbid, cellLocation, this.props)
            if (!cellLocation) return
            const cellCoordinates = app.actions.inventory.generateLabel(cellLocation.x, cellLocation.y, this.xunits, this.yunits)
            for (var cellLabel in this.cellRef) {
                var ref = this.cellRef[cellLabel]
                //console.log('selectCell:',ref.props.label, cellCoordinates)
                if (ref) {
                    const focus = cellCoordinates === ref.props.label
                    ref.focus(focus)
                }
            }
        }

        render() {
            console.log('containerSubdivision render:',this.props)
            const tiles = this.initialize(this.props)
            if (!tiles) return
            
            const titleLabelStyle = "height:20px;width:"+this.props.width+"px;font-size:12px;line-height:20px;font-weight:800;overflow:hidden;white-space:nowrap"
            const TitleLabel = function(props) {
                return (<div style={titleLabelStyle}>{props.text}</div>)
            }
            const pathChild = "height:"+this.props.containerSize+"px;margin:0px;padding:0;width:"+(this.props.containerSize+20)+"px;"
            return (
                <div id={this.props.dbid} key={this.props.dbid} class="tile is-2" style={pathChild}>
                    <div id="inventory_tiles2" class="tile is-vertical" style={"padding:0;margin:0;max-width:"+this.props.width+"px;"}>
                        <TitleLabel text={this.props.title}/>
                        {tiles}
                    </div>
                </div>
            )
        }
    }
}
