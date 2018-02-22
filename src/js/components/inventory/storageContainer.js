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
            this.deselectChildren = this.deselectChildren.bind(this)
            ashnazg.listen('global.inventorySelection', this.selectCellListener.bind(this));
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
            //this.setState({tiles:tiles})
            if (nextProps.mode==='edit') {
                //console.log('storageContainer initialize props:',nextProps,app.state.global.inventoryCellLocation)
                //console.log('selectCell edit:',app.state.global.inventoryCellLocation)
                //this.selectCell(app.state.global.inventoryCellLocation)
            }
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
                    var storageCell = <StorageCell state="inventorySelection" label={label} ref={ref} name={name} childType={childType} width={dx} height={dy} occupied={isOccupied} item={cell} parent_id={thisModule.dbid} parent_x={x+1} parent_y={row+1} active={isActive} mode={mode}/>
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
                if (this.type && this.type.toLowerCase()==='lab') {
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

        selectCellListener(cellLocation) {
            if (this.dbid!==cellLocation.parentId) return
            console.log('selectCellListener:',this.dbid, cellLocation)
            const xunits = (this.xunits) ? this.xunits : 1
            const yunits = (this.yunits) ? this.yunits : 1
            const cellCoordinates = this.generateLabel(cellLocation.x, cellLocation.y, xunits, yunits)
            
            for(var cellLabel in this.cellRef){
                var ref = this.cellRef[cellLabel]
                if (ref) {
                    ref.focus(cellCoordinates === ref.props.label, cellLocation.navigate)
                }
            }
            const selectedCell = this.cellRef[cellCoordinates]
            if (!this.props.item || !selectedCell) return
            const selectedItem = (selectedCell.props.item) ? selectedCell.props.item.id : this.props.item.id
            if (cellLocation.navigate) app.actions.inventory.getInventoryPath(selectedItem)
        }

        deselectChildren(cellCoordinates, navigate) {
            //console.log('deselectChildren:',this.cellRef, cellCoordinates)
            for(var cellLabel in this.cellRef){
                var ref = this.cellRef[cellLabel]
                if (ref) {
                    ref.focus(cellCoordinates === ref.props.label, navigate)
                }
            }
            const selectedCell = this.cellRef[cellCoordinates]
            //console.log('setting focus to:',selectedCell, this.props)
            if (!this.props.item || !selectedCell) return
            const selectedItem = (selectedCell.props.item) ? selectedCell.props.item.id : this.props.item.id
            app.actions.inventory.getInventoryPath(selectedItem)
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
