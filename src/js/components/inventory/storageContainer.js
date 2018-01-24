import {
    h
}
from 'preact'

module.exports = function (Component) {
    const StorageCell = require('./storageCell.js')(Component)
    return class StorageContainer extends Component {

        constructor(props) {
            super(props);
            //console.log('StorageContainer props:', JSON.stringify(props))
            this.state = {
                tiles:[]
            }
            this.cellMap = {}
        }

        componentWillReceiveProps(nextProps) {
            this.populateContainer(nextProps.items, nextProps.xunits, nextProps.yunits)
            this.subdivideContainer(nextProps.width, nextProps.height, nextProps.xunits, nextProps.yunits, nextProps.label, nextProps.childType)
        }

        generateLabel(parent_x, parent_y, xunits, yunits) {
            const x = parent_x+1
            const y = parent_y+1
            if (xunits>1 && yunits>1) return x+','+y
            if (xunits>1) return x
            if (yunits>1) return y
            return ''
        }

        subdivideContainer(width, height, xunits, yunits, containerLabel, childType) {
            
            const dx = width / xunits
            const dy = height / yunits
            const thisModule = this
            
            const generateCols =function(row) {
                const cols=[]
                for (var x=0; x<xunits; x++) {
                    var label = thisModule.generateLabel(x, row, xunits, yunits)
                    var cell = thisModule.cellMap[label]
                    var isOccupied = false
                    if (cell) {
                        isOccupied = true
                    } else {
                    }
                    var storageCell = <StorageCell id={"cell_"+label} label={label} childType={childType} width={dx} height={dy} occupied={isOccupied}/>
                    cols.push(storageCell)
                }
                return cols
            }
                              
            const rowStyle = "width:"+width+"px;height:"+dy+"px;margin:0;padding:0;"
            const generateRows = function() {
                const rows=[]
                for (var y=0; y<yunits; y++) {
                    rows.push (
                        <div id="inventory_item" class="tile is-parent" style={rowStyle}>
                        {generateCols(y)}
                        </div>
                    )
                }
                return rows
            }
                
            const tileStyle = "width:"+width+"px;height:"+dy+"px;margin:0;padding:0;"
            const tiles = (
                    <div class="tile is-vertical" style={tileStyle}>
                        {generateRows()}
                    </div>
            )
            this.setState({tiles:tiles})
        }
        
        populateContainer(items, xunits, yunits) {
            this.cellMap={}
            if (!items) return
            for (var i=0; i<items.length; i++) {
                var item = items[i]
                var cellId = this.generateLabel(item.parent_x,item.parent_y, xunits, yunits)
                this.cellMap[cellId]=item
            }
        }
        
        render() {
            
            //console.log('containerSubdivision render:',this.props)
            const titleLabelStyle = "height:20px;width:"+this.props.width+"px;font-size:12px;line-height:20px;font-weight:800;"
            const TitleLabel = function(props) {
                return (<div style={titleLabelStyle}>{props.text}</div>)
            }
            return (
                <div id="inventory_tiles" class="tile is-parent is-vertical" style={"padding:0;margin:0;width:"+this.props.width}>
                    <TitleLabel text={this.props.title}/>
                    {this.state.tiles}
                </div>
            )
        }
    }
}
