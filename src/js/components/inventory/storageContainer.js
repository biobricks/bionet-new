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
            this.deselectChildren = this.deselectChildren.bind(this)
            this.state = {
                tiles:[]
            }
            const xunits = (this.props.xunits) ? this.props.xunits : 1
            const yunits = (this.props.yunits) ? this.props.yunits : 1
            //this.populateContainer(this.props.items, xunits, yunits)
            //this.subdivideContainer(this.props.width, this.props.height, xunits, yunits, this.props.label, this.props.childType)
            this.cellMap = {}
            this.cellRef = {}
            ashnazg.listen('global.inventoryCellLocation', this.selectCell.bind(this));
        }

        generateLabel(parent_x, parent_y, xunits, yunits) {
            const x = parent_x
            const y = parent_y
            if (xunits>1 && yunits>1) return x+','+y
            if (xunits>1) return x
            if (yunits>1) return y
            return ''
        }

        subdivideContainer(pwidth, pheight, pxunits, pyunits, containerLabel, childType, selectedItemId, px, py, mode) {
            //console.log('subdivideContainer', pxunits, pyunits, pwidth, selectedItemId, px, py)
            const xunits = (pxunits===0) ? 1 : pxunits
            const yunits = (pyunits===0) ? 1 : pyunits
            const width = pwidth
            const height = pheight
            const dx = width / xunits
            const dy = height / yunits
            const thisModule = this
            
            const generateCols =function(row) {
                const cols=[]
                for (var x=0; x<xunits; x++) {
                    var label = thisModule.generateLabel(x+1, row+1, xunits, yunits)
                    var cell = thisModule.cellMap[label]
                    var name = label
                    var isOccupied = false
                    var isActive = false
                    if (cell) {
                        isOccupied = true
                        if (cell.name) name=cell.name
                        isActive = cell.id === selectedItemId
                    } else {
                        isActive = row+1 === py && x+1 === px
                    }
                    var ref=(cell) => { if (cell) thisModule.cellRef[cell.props.label] = cell; }
                    var storageCell = <StorageCell state="inventorySelection" label={label} ref={ref} name={name} childType={childType} width={dx} height={dy} occupied={isOccupied} item={cell} parent_id={thisModule.props.dbid} parent_x={x+1} parent_y={row+1} active={isActive} mode={mode} onSelectCell={thisModule.deselectChildren}/>
                    cols.push(storageCell)
                }
                return cols
            }
                              
            const rowStyle = "width:"+width+"px;height:"+dy+"px;margin:0;padding:0px;"
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
                if (this.props.type && this.props.type.toLowerCase()==='lab') {
                    px = 0
                    py = i
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

        selectCell(cellLocation) {
            if (this.props.dbid!==cellLocation.parentId) return
            console.log('selectCell:',cellLocation)
            const xunits = (this.props.xunits) ? this.props.xunits : 1
            const yunits = (this.props.yunits) ? this.props.yunits : 1
            const cellCoordinates = this.generateLabel(cellLocation.x, cellLocation.y, xunits, yunits)
            this.deselectChildren(cellCoordinates, false)
        }

        deselectChildren(cellCoordinates, navigate) {
            console.log('deselectChildren:',this.cellRef, cellCoordinates)
            for(var cellLabel in this.cellRef){
                var ref = this.cellRef[cellLabel]
                //console.log('ref:',ref)
                if (ref) {
                    ref.focus(cellCoordinates === ref.props.label, navigate)
                }
            }
        }
        
        render() {
            //console.log('containerSubdivision render:',this.props)
            const xunits = (this.props.xunits) ? this.props.xunits : 1
            const yunits = (this.props.yunits) ? this.props.yunits : 1
            this.populateContainer(this.props.items, xunits, yunits)
            const tiles = this.subdivideContainer(this.props.width, this.props.height, xunits, yunits, this.props.label, this.props.childType, this.props.selectedItem, this.props.px, this.props.py, this.props.mode)
            
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
