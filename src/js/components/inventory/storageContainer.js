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
            this.cellMap = {}
            this.cellRef = {}
            this.initialize(props)
        }
        
        initialize(nextProps) {
            //console.log('storageContainer initialize props:',nextProps)
            const xunits = (nextProps.xunits) ? nextProps.xunits : 1
            const yunits = (nextProps.yunits) ? nextProps.yunits : 1
            this.xunits = xunits
            this.yunits = yunits
            this.dbid = nextProps.dbid
            this.type = nextProps.type
            this.populateContainer(nextProps.items, xunits, yunits)
            const tiles = this.subdivideContainer(nextProps.width, nextProps.height, xunits, yunits, nextProps.label, nextProps.childType, nextProps.selectedItem, nextProps.px, nextProps.py, nextProps.mode)
            if (nextProps.mode==='edit') app.state.inventory.listener.editContainerListener = this.selectCellListener.bind(this)
            return tiles
        }

        generateLabel(parent_x, parent_y, xunits, yunits) {
            const x = parent_x
            const y = parent_y
            if (xunits>1 && yunits>1) return x+','+y
            if (xunits>1) return x
            if (yunits>1) return y
            return ''
        }

        subdivideContainer(pwidth, pheight, pxunits, pyunits, containerLabel, childType, selectedItemId, px1, py1, mode) {
            //console.log('subdivideContainer', pxunits, pyunits, pwidth, selectedItemId, px, py)
            const xunits = (pxunits===0) ? 1 : pxunits
            const yunits = (pyunits===0) ? 1 : pyunits
            const width = pwidth
            const height = pheight
            const dx = width / xunits
            const dy = height / yunits
            var px = px1
            var py = py1
            console.log('subdivideContainer', xunits, yunits, width, height, px, py)
            const thisModule = this
            const generateCols =function(row) {
                const cols=[]
                const y = row+1
                for (var col=0; col<xunits; col++) {
                    var x = col+1
                    var label = thisModule.generateLabel(x, y, xunits, yunits)
                    var cell = thisModule.cellMap[label]
                    var name = label
                    var isOccupied = false
                    var isActive = (y === py && x === px)
                    if (cell) {
                        isOccupied = true
                        if (cell.name) name=cell.name
                    }
                    //if (isActive) console.log('generating active cell:',label)
                    var ref = (cell) => { if (cell) thisModule.cellRef[cell.props.label] = cell; }
                    var storageCell = <StorageCell state={"cell_"+label+"_parent_"+thisModule.dbid} label={label} ref={ref} name={name} childType={childType} width={dx} height={dy} occupied={isOccupied} item={cell} parent_id={thisModule.dbid} parent_x={x} parent_y={y} active={isActive} mode={mode}/>
                    cols.push(storageCell)
                }
                return cols
            }
                              
            const rowStyle = "width:"+width+"px;max-height:"+dy+"px;margin:0;padding:0px;"
            const generateRows = function() {
                thisModule.tiles=[]
                const rows=[]
                for (var y=0; y<yunits; y++) {
                    rows.push (
                        <div id="inventory_item" class="tile" style={rowStyle}>
                        {generateCols(y)}
                        </div>
                    )
                }
                return rows
            }
                
            const tileStyle = "max-width:"+width+"px;height:"+dy+"px;margin:0;padding:0px;"
            const tiles = (
                    <div class="tile is-vertical" style={tileStyle}>
                        {generateRows()}
                    </div>
            )
            return tiles
        }
        
        populateContainer(items, xunits, yunits) {
            //console.log('populateContainer:', items)
            this.cellMap={}
            this.cellRef = {}
            if (!items) return
            for (var i=0; i<items.length; i++) {
                var item = items[i]
                var px=0
                var py=0
                if (this.type && this.type.toLowerCase()==='lab') {
                    px = 0
                    py = i
                    item.parent_x = px
                    item.parent_y = py
                } else {
                    px = item.parent_x-1
                    py = item.parent_y-1
                }
                var cellId = this.generateLabel(px+1, py+1, xunits, yunits)
                this.cellMap[cellId]=item
            }
        }

        getId() {
            return this.props.dbid
        }

        selectCellListener(cellLocation, edit) {
            //console.log('selectCellListener:',edit, this.dbid, cellLocation, this.props)
            //if (!cellLocation || this.dbid!==cellLocation.parentId) return
            if (!cellLocation) return
            const xunits = (this.xunits) ? this.xunits : 1
            const yunits = (this.yunits) ? this.yunits : 1
            const cellCoordinates = this.generateLabel(cellLocation.x, cellLocation.y, xunits, yunits)
            for (var cellLabel in this.cellRef) {
                var ref = this.cellRef[cellLabel]
                console.log('selectCell:',ref.props.label, cellCoordinates)
                if (ref) {
                    //const focus = cellLocation.navigate && cellCoordinates === ref.props.label
                    const focus = cellCoordinates === ref.props.label
                    ref.focus(focus, cellLocation.navigate)
                }
            }
        }

        render() {
            //console.log('containerSubdivision render:',this.props)
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
