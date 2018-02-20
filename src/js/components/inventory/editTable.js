import { h } from 'preact'
import ashnazg from 'ashnazg'

module.exports = function (Component) {
    
    const EditPhysical = require('./editPhysical')(Component)
    
    return class EditTable extends Component {
        constructor(props) {
            super(props);
            this.rowRef={}
            this.deselectRows.bind(this)
        }
        
        tabularHeader() {
            return(
                <div class="tile is-parent is-11"  style="padding:0; margin:0;font-weight:800">
                    <div class="tile is-child is-3" style="padding-left: calc(0.625em - 1px);">Name</div>
                    <div class="tile is-child is-1" style="padding-left: calc(0.625em - 1px);">Loc</div>
                    <div class="tile is-child is-3" style="padding-left: calc(0.625em - 1px);">Type</div>
                </div>
            )
        }
        
        updateTabularData() {
            const selectedItem = this.props.item
            const items = this.props.items
            this.rowRef={}
            const thisModule = this
            if (!selectedItem || !items) return
            
            if (items.length===0) {
                return (<div style="padding-left: calc(0.625em - 1px)">{selectedItem.name} is empty.</div>)
            }
            const tabularData=[]
            const ref=(row) => { if (row) thisModule.rowRef[row.props.id] = row; }
            for (var i=0; i<items.length; i++) {
                var item = items[i]
                tabularData.push(<EditPhysical state="EditPhysicalTable" ref={ref} active="true" tabular="true" item={item} id={item.id} onFocus={thisModule.deselectRows.bind(thisModule)}/>)
            }
            return tabularData
        }
                                 
        deselectRows(selectedId) {
            //console.log('deselectRows:',this.rowRef, selectedId)
            for(var id in this.rowRef){
                var ref = this.rowRef[id]
                //console.log('rowref:',ref)
                if (ref) {
                    ref.focus(selectedId === ref.props.id, false)
                }
            }
        }

        render() {
            //console.log(this.state.inventoryPath)
            const tabularHeader = this.tabularHeader()
            const tabularData = this.updateTabularData()
            const tableStyle = "margin:0;padding:0;max-height:"+this.props.height+"px;overflow-y:auto;border:1px solid black;box-sizing:initial;"
            
            return (
                <div id="inventory_table" class="tile is-parent" style="margin:0;padding:0;box-sizing:initial">
                    <div id="i1" class="" style={tableStyle}>
                        {tabularHeader}
                        {tabularData}
                    </div>
                </div>
            )
        }
    }
}
