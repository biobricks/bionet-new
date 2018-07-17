'use strict';
import {h} from 'preact';
import React, {
    Component, PureComponent
}
from 'react';
import EditContainerCss from './EditContainer.scss';
import Grid from './Grid';
import ContainerPropertiesForm from './ContainerPropertiesForm'
import ItemPropertiesForm from './ItemPropertiesForm'
import SliderControl from './SliderControl'
import PropTypes from 'prop-types';
import * as _ from 'lodash';
// import Perf from 'react-addons-perf';

export default class EditContainer extends Component {

    static defaultProps = {
        items: [],
        container:{},
        keyProp:'id'
    }

    static propTypes = {
        items: PropTypes.arrayOf(PropTypes.object),
        container:PropTypes.object
    }

    constructor(props, context) {

        super(props, context);
        
        this.gridWidth = 40
        this.gridHeight = 40
        this.selectedItem = null
        
        this.zoomLevel = []
        for (var zl = 0.25; zl <= 2.0; zl += 0.25) {
            this.zoomLevel.push(zl)
        }
        const items=(props.items) ? props.items : []
        this.state = {
            gridWidth:40,
            gridHeight:40,
            layoutTop:0,
            layoutLeft:0,
            layoutRight:0,
            layoutBottom:0,
            defaultName : '',
            defaultWidth : 1,
            defaultHeight : 1,
            defaultColor : 'aqua',
            defaultFontSize:'0.3',
            items:items,
            editItemMode:false,
            newItemMode:false
        };
        this.componentWillReceiveProps(props)
    }
    
    componentWillReceiveProps(props) {
        const container=props.container
        console.log('EditContainer props:',props, this.state)
        var zoomIndex = 1
        var zoom = 1.0
        if (props.zoom) {
            zoomIndex = this.initZoomIndex(props.zoom, this.zoomLevel)
            zoom = this.zoomLevel[zoomIndex]
        }
        
        if (props.newItem && props.onToggleNew) {
            this.toggleNewMode()
            //props.onToggleNew()
        }

        this.setState({
            containerId:container.id,
            units:container.units,
            majorGridLine:container.majorGridLine,
            layoutName:container.name,
            layoutWidthUnits:container.layoutWidthUnits,
            layoutHeightUnits:container.layoutHeightUnits,
            layoutWidth: this.gridWidth*container.layoutWidthUnits,
            layoutHeight: this.gridHeight*container.layoutHeightUnits,
            zoomIndex:zoomIndex,
            zoom:zoom
        })
    }

    initZoomIndex(zoom, zoomLevel) {
        var zoomIndex=1
        if (zoom) {
            for (zoomIndex=0; zoomIndex<zoomLevel.length; zoomIndex++) {
                if (zoomLevel[zoomIndex]>zoom) {
                    break;
                }
            }
        }
        return --zoomIndex
    }

    onFilter(event) {
        var search = new RegExp(event.target.value, 'i');
        const items = this.state.items.map(function (item) {
            const isMatched = !item.name.match(search);
            item.width = Math.trunc(Math.random() * 4.0)
            item.height = Math.trunc(Math.random() * 4.0)
            if (!item.filtered || isMatched !== item.filtered) {
                return Object.assign({
                    filtered: isMatched
                }, item)
            }
            return item;
        });
        console.log('onFilter:', search)
        this.onUpdateItems(items)
    };
    
    selectItem(item,_updatedItems) {
        const keyProp = this.props.keyProp
        const key = (item && item[keyProp]) ? item[keyProp] : null
        this.selectedItem = item
        const updatedItems = (_updatedItems) ? _updatedItems : this.state.items
        var items = updatedItems.map(function (_item) {
            _item.selected = _item[keyProp] === key
            return _item;
        });
        console.log('selectItem:',item,items,this.state.items)
        
        if (item) {
            this.setState({
                item:item,
                defaultName : item.name,
                defaultWidth : item.width / this.gridWidth,
                defaultHeight : item.height / this.gridHeight,
                defaultColor : item.color,
                defaultFontSize : (item.fontSize) ? item.fontSize : '0.3'
            })
        } else {
            this.setState({
                item:item,
                defaultName : '',
                defaultWidth : 1,
                defaultHeight : 1,
                defaultColor : '',
                defaultFontSize : ''
            })
        }
        this.onUpdateItems(items)
        if (this.props.onRecordLocation) this.props.onRecordLocation(item)
    }
    
    onDragEnd(source, xp, yp, isDrag, top, left) {
    //onDragEnd(source, cxp, cyp, isDrag, xp, yp) {
        // todo change to keyprop
        if (!this.container) return
        console.log('Edit container onDragEnd:',source)
        source = _.find(this.state.items, {
            id: source
        });
        const x1 = this.state.layoutLeft
        const x2 = this.state.layoutRight
        const y1 = this.state.layoutTop
        const y2 = this.state.layoutBottom
        const x = (xp+this.container.scrollLeft-this.state.layoutLeft)/this.state.zoom
        const y = (yp+this.container.scrollTop-this.state.layoutTop)/this.state.zoom
        const col = Math.trunc(x / this.gridWidth)
        const row = Math.trunc(y / this.gridHeight)
        const isOutsideGrid = xp < x1 || xp > x2 || yp < y1 || yp > y2 || col >= this.state.layoutWidthUnits || row >= this.state.layoutHeightUnits
        console.log('onDragEnd:', isDrag, xp, yp, x1,x2,y1,y2,col,row)
        if (isDrag) {
            this.selectedItem = null
            if (isOutsideGrid) {
                // gridtodo: delete physical api call
                //console.log('onDragEnd, deleting')
                //this.deleteItem(source)
                //this.selectItem(source,this.state.items)
            } else {
                var updatedItems=this.state.items
                if (!source.id.startsWith('_new_')) {
                    updatedItems=this.unselectNewItem(this.state.items)
                    app.actions.inventory.updateItem(source.id,function(err,item){
                        if (!err) {
                            item.parent_x = col+1
                            item.parent_y = row+1
                        }
                        console.log('inventoryPath: onDragEnd updateItem',item)
                        return item
                    })
                }
                source.row = row
                source.col = col
                console.log('inventoryPath: onDragEnd, moving', source)
                const items = updatedItems.map(function (item) {
                    if (item.id===source.id) return source
                    return item
                });
                //var updatedItems = this.unselectNewItems(items)
                //this.onUpdateItems(updatedItems)
                this.selectItem(source,updatedItems)
            }
        } else {
            const items = this.unselectNewItem(this.state.items)
            //const items=this.state.items
            //this.onUpdateItems(items)
            this.selectItem(source,items)
        }
    }
    
    deleteItem(item) {
        if (!item) return
        const id = item.id
        if (!id) return
        const name = item.name
        const parentId = item.parent_id
        console.log('deleting item 1:', id, name, parentId, item)
        app.actions.prompt.display('Do you wish to delete '+name+'?', null, function(accept) {
            if (accept) {
                app.actions.inventory.delPhysical(id, function(err,id2) {
                    if (err) {
                        app.actions.notify(err.message, 'error');
                        return
                    }
                    app.actions.notify(name+" deleted", 'notice', 2000);
                })
                item.filtered = true
                const items = this.state.items.map(function (itemAr) {
                    if (itemAr.id===item.id) return item
                    return itemAr
                });
                this.setState({
                    item:null,
                    defaultWidth:1,
                    defaultHeight:1,
                    defaultColor:'aqua',
                    defaultFontSize:0.3
                })
                this.onUpdateItems(items)
            }
        }.bind(this))
    }

    onResizeStop(source, width, height) {
        source = _.find(this.state.items, {
            id: source
        });
        const cols = Math.round(width/this.gridWidth/this.state.zoom)
        const rows = Math.round(height/this.gridHeight/this.state.zoom)
        source.width=cols*this.gridWidth;
        source.height=rows*this.gridHeight;
        console.log('onResizeStop toplev:',source,width,height)
        /*
        this.updateSelection({
            width:cols,
            height:rows
        })
        */
        const items = (this.state.items) ? this.state.items.slice() : []
        this.onUpdateItems(items)
        this.setState({
            defaultWidth:cols,
            defaultHeight:rows
        })
    }

    unselectNewItem(items) {
        var updatedItems=[]
        if (items) updatedItems = items.filter(function (item) {
            return !item.id.startsWith('_new_')
        });
        return updatedItems
    }

    onNewItem(item) {
        // search all items for click inside item bounds (row, row+height, col, col+width), abort add new item if inside existing
        console.log('EditContainer onNewItem',item)
        const x = item.col
        const y = item.row
        if (x<0 || x >= this.state.layoutWidthUnits || y<0 || y >= this.state.layoutHeightUnits) {
            this.selectItem()
            return
        }
        const items = (this.state.items) ? this.state.items : []
        for (var i = 0; i < items.length; i++) {
            var sampleItem = items[i]
            if (sampleItem.filtered) continue;
            var x1 = sampleItem.col
            var x2 = x1 + Math.trunc(sampleItem.width / this.gridWidth)
            var y1 = sampleItem.row
            var y2 = y1 + Math.trunc(sampleItem.height / this.gridHeight)
            if (x >= x1 && x < x2 && y >= y1 && y < y2) return
        }
        this.setState({newItemMode:true})

        // generate new item to add to grid
        const id='_new_'+items.length
        item.id = id
        item.key = id;
        item.sort = id;
        //item.name = this.state.defaultName
        item.name = 'New Item'
        item.width = this.gridWidth
        item.height = this.gridHeight
        item.color = 'rgba(255,0,0,0.2)'
        item.fontSize = this.state.defaultFontSize
        item.newItem=true
        item.xUnits=1
        item.yUnits=1
        item.majorGridLine=1
        item.newItem=true
        item.layoutWidthUnits=this.state.layoutWidthUnits
        item.layoutHeightUnits=this.state.layoutHeightUnits
        
        // filter out prior new items
        var updatedItems = this.unselectNewItem(this.state.items)
        updatedItems.push(item)
        //this.onUpdateItems(updatedItems)
        
        console.log('EditContainer onNewItem, adding',item,updatedItems)
        this.selectItem(item,updatedItems)
        

        /*
        const physical={
            name:item.name+'_'+items.length+1,
            parent_id:this.state.containerId,
            parent_x:x+1,
            parent_y:y+1,
            type:'container',
            width:item.width,
            height:item.height,
            color:item.color,
            layoutWidthUnits:this.state.layoutWidthUnits,
            layoutHeightUnits:this.state.layoutHeightUnits,
            units:this.state.units,
            majorGridLine:this.state.majorGridLine,
            fontSize:item.fontSize
        }
        console.log('onNewItem, adding:', physical)
        app.actions.inventory.saveToInventory(physical,null,null,function(err,id){
            console.log('saveToInventory:',err,id)
            item.id = id
            item.key = id;
            item.sort = item.key;
            const updatedItems = items.slice()
            updatedItems.push(item)
            this.onUpdateItems(updatedItems)
            this.selectItem(item)
        }.bind(this))
        */
        
    }

    onUpdateItems(items) {
        this.setState({items:items})
    }

    onMove(event) {
    }

    clearSelection(e) {
        e.stopPropagation()
        e.preventDefault()
        if(document.selection && document.selection.empty) {
            document.selection.empty();
        } else if(window.getSelection) {
            var sel = window.getSelection();
            sel.removeAllRanges();
        }
    }
    
    onResize = ()=> {
        console.log('grid onResize')
        if (window.requestAnimationFrame) {
            window.onclick = this.onToplevClick.bind(this)
            window.requestAnimationFrame(this.getDOMWidth);
        } else {
            setTimeout(this.getDOMWidth, 66);
        }
    }
    
    getDOMWidth = ()=> {
        var rect = this.container && this.container.getBoundingClientRect();
        console.log('getDOMWidth',this.container,rect)
        if (!rect) return
        this.setState({
            layoutTop:rect.top,
            layoutLeft:rect.left,
            layoutRight:rect.right,
            layoutBottom:rect.bottom
        })
    }
    
    componentDidMount() {
        this.onResize();
        console.log('EditContainer componentDidMount:',this.props,this.state)
        if (this.props.onMount) {
            //const editContainerId = (this.props.fullWidth) ? 'EditContainerDiv' : 'edit-container'
            const editContainerId = (this.props.fullWidth) ? 'EditContainerDiv' : 'map-panel-item'
            //const editContainerId = 'EditContainerDiv'
            const editContainer = document.getElementById(editContainerId)
            console.log('EditContainer componentDidMount:',editContainerId,editContainer)
            var containerWidth=600
            var containerHeight=450
            if (editContainer) {
                containerWidth=editContainer.offsetWidth-24
                containerHeight=editContainer.offsetHeight-16
            }
            this.props.onMount(containerWidth,containerHeight)
        }
    }

    onToplevClick(e) {
        var el = e.srcElement || e.target;
        //console.log('onClick, e:',el)
        if (el.id==='clearItems') {
            console.log('clearing item list')
            this.onUpdateItems({items:[{id:0,key:0,filtered:true,width:0,height:0,name:''}]})
            return
        }
        const isTouch = e.targetTouches && e.targetTouches.length === 1;
        const pageX = isTouch ? e.targetTouches[0].pageX : e.pageX;
        const pageY = isTouch ? e.targetTouches[0].pageY : e.pageY;
        var isOutside=false
        if (this.container) {
            const rect = this.container.getBoundingClientRect();
            isOutside = pageY>rect.bottom || pageX<rect.left || pageX>rect.right
            //console.log('onToplevClick:', pageX, pageY, rect)
        }
        console.log('EditContainer onToplevClick:',pageX,pageY,isOutside)
        //if (isOutside) this.selectItem()
    }
    
    onUpdateContainerProperties(props) {
        // gridtodo: save physical api call
        
        app.actions.inventory.updateItem(this.state.containerId,function(err,item){
            var updatedItem={}
            if (props.width) {
                const update = {
                    layoutWidthUnits:props.width,
                    layoutWidth: this.gridWidth*props.width
                }
                updatedItem = Object.assign(item,update)
            } else if (props.height) {
                const update = {
                    layoutHeightUnits:props.height,
                    layoutHeight: this.gridHeight*props.height
                }
                updatedItem = Object.assign(item,update)
            } else {
                updatedItem = Object.assign(item,props)
            }
            console.log('updateSelection:',updatedItem)
            return updatedItem
        }.bind(this))
        
        console.log('onUpdateContainerProperties:',props)
        if (props.name) {
            this.setState({
                layoutName: props.name
            })
        }
        if (props.width) {
            this.setState({
                layoutWidthUnits:props.width,
                layoutWidth: this.gridWidth*props.width
            })
        }
        if (props.height) {
            this.setState({
                layoutHeightUnits:props.height,
                layoutHeight: this.gridHeight*props.height
            })
        }
        if (props.majorGridLine) {
            this.setState({
                majorGridLine: props.majorGridLine
            })
        }
        if (props.units) {
            this.setState({
                units:props.units
            })
        }
    }
    updateSelection(update) {
        if (!this.selectedItem) return
        var selectedItem = this.selectedItem
        const keyProp = this.props.keyProp
        const key = selectedItem[keyProp]
        this.selectedItem = Object.assign(selectedItem, update)
        /*
        app.actions.inventory.updateItem(this.selectedItem.id,function(err,item){
            var updatedItem = Object.assign(item,update)
            console.log('updateSelection:',updatedItem)
            return updatedItem
        })
        */
        
        const items = this.state.items.map(function (item) {
            return (item[keyProp] === key) ? selectedItem : item
        });
        this.onUpdateItems(items)
    }
    onUpdateItemProperties(props) {
        console.log('onUpdateItemProperties:',props)
        if (props.name) {
            this.updateSelection({name:props.name})
            this.setState({
                defaultName:props.name
            })
        }
        if (props.width) {
            this.updateSelection({width:props.width*this.gridWidth})
            this.setState({
                defaultWidth:props.width
            })
        }
        if (props.height) {
            this.updateSelection({height:props.height*this.gridHeight})
            this.setState({
                defaultHeight:props.height
            })
        }
        if (props.color) {
            this.updateSelection({color:props.color})
            this.setState({
                defaultColor:props.color
            })
        }
        if (props.fontSize) {
            this.updateSelection({fontSize:props.fontSize})
            this.setState({
                defaultFontSize:props.fontSize
            })
        }
    }
    onZoom(zoom, index) {
        this.setState({
            zoomIndex:index,
            zoom:zoom
        })
    }

    toggleEditMode(){}
    toggleEditItemMode(){
        this.setState({
            editItemMode:!this.state.editItemMode,
            newItemMode:false
        })
    }
    toggleNewMode(){
        const item={}
        const id='_new_'+this.state.items.length
        item.id = id
        item.key = id;
        item.sort = id;
        item.name = 'New Item NM'
        item.width = this.gridWidth
        item.height = this.gridHeight
        item.color = 'rgba(255,0,0,0.2)'
        item.fontSize = this.state.defaultFontSize
        item.xUnits=1
        item.yUnits=1
        item.majorGridLine=1
        item.newItem=true
        this.setState({
            item:item,
            defaultName:'New Item',
            editItemMode:false,
            newItemMode:true
        })
        this.selectedItem=item
    }
    onDeleteItemClick(){
        const item = this.state.item
        console.log('onDeleteItemClick, deleting:',item)
        if (item) {
            this.deleteItem(item)
            this.selectItem(item,this.state.items)
        }
    }
    onSaveItemClick(){
        if (!this.selectedItem) return
        var selectedItem = this.selectedItem
        //const newMode = !selectedItem.id.startsWith('_new_') || this.props.newItem
        const newMode = selectedItem.newItem
        console.log('onSaveItemClick newMode:',newMode, selectedItem)

        if (newMode) {
            console.log('onSaveItemClick newMode:',selectedItem)
            const newItem=Object.assign(selectedItem,{})
            delete newItem.id
            delete newItem.selected
            delete newItem.newMode
            delete newItem.key
            delete newItem.sort
            //delete newItem.width
            //delete newItem.height
            const parentId = (this.props.container.id) ? this.props.container.id : null
            if (!parentId) {
                console.log('onSaveItemClick no parent')
                return
            }
            newItem.parent_id=parentId
            newItem.parent_x = selectedItem.col+1
            newItem.parent_y = selectedItem.row+1
            const items=this.state.items
            
            app.actions.inventory.saveToInventory(selectedItem,null,null,function(err,id){
                console.log('onSaveItemClick saveToInventory:',err,id)
                newItem.id = id
                newItem.key = id;
                newItem.sort = id;
                const updatedItems = items.slice()
                updatedItems.push(newItem)
                this.onUpdateItems(updatedItems)
                this.selectItem(newItem)
            }.bind(this))
        } else {
            app.actions.inventory.updateItem(this.selectedItem.id,function(err,item){
                var updatedItem = Object.assign(item,selectedItem)
                console.log('onSaveItemClick:',updatedItem)
                return updatedItem
            })
        }
    }

    render() {
        console.log('EditContainer render:',this.state,this.props)
        const containerStyle = {
            width:this.props.width+'px',
            height:this.props.height+'px',
        }
        const name=this.state.defaultName
        const isEditMode=true
        if (this.props.fullWidth) {
            //const isEditItemMode=this.state.editItemMode
            //const isNewItemMode=this.state.newItemMode
            const isEditItemMode=true
            var containerPropertiesForm=null
            var itemPropertiesForm = null
            containerPropertiesForm = (
                <div>
                    <ContainerPropertiesForm
                        name={this.state.layoutName}
                        width={this.state.layoutWidthUnits}
                        height={this.state.layoutHeightUnits}
                        majorGridLine={this.state.majorGridLine}
                        units={this.state.units}
                        onChange={this.onUpdateContainerProperties.bind(this)}
                    />
                    <div className="vertical-spacing"/>
                    <span className="pure-form">
                        <label>Zoom</label>
                        <SliderControl
                            index={this.state.zoomIndex}
                            values={this.zoomLevel}
                            name="zoomSlider"
                            onChange={this.onZoom.bind(this)}
                        />
                    </span>
                </div>
            )
            /*
                            name={this.state.defaultName}
                            width={this.state.defaultWidth}
                            height={this.state.defaultHeight}
                            color={this.state.defaultColor}
                            fontSize={this.state.defaultFontSize}
            */
            const item=this.state.item
            console.log('EditContainer render item:',item,this.state,this.props)
            if (item) {
                if (isEditItemMode || isNewItemMode) {
                    itemPropertiesForm=(
                        <div style={{height:'120px'}}>
                            <ItemPropertiesForm
                                name={this.state.defaultName}
                                width={this.state.defaultWidth}
                                height={this.state.defaultHeight}
                                color={item.color}
                                fontSize={item.fontSize}
                                onChange={this.onUpdateItemProperties.bind(this)}
                            />
                        </div>
                    )
            } else {
                itemPropertiesForm=(
                <div style={{height:'120px'}}>
                    <div className="pure-form">
                        <label>Name:</label><span>{this.state.defaultName}</span>
                        <br/>
                        <label>Width:</label><span>{this.state.defaultWidth}</span>
                        <br/>
                        <label>Height:</label><span>{this.state.defaultHeight}</span>
                        <br/>
                        <label>Color</label><span style={{backgroundColor:this.state.defaultColor}}>{this.state.defaultColor}</span>
                        <br/>
                        <label>Font Size:</label><span>{this.state.defaultFontSize}</span>
                    </div>
                </div>
                )
                }
            }
            /*
                                  <span 
                                    class="button is-small"
                                    onClick={this.toggleEditItemMode.bind(this)}
                                  >
                                    <i class="mdi mdi-arrow-left-bold"></i>
                                  </span>
            */
            var itemProperties=null
            if (itemPropertiesForm) {
                itemProperties = (
                  <div>
                  <div class="panel-heading">
                    <div class="is-block">
                      <div class="columns is-gapless">
                        <div class="column">
                          { (isEditItemMode||isNewItemMode) ? (
                            <div>
                              {name}
                              <div class="toolbox is-pulled-right">
                                <div class="buttons has-addons">
                                  <span 
                                    class="button is-small is-success"
                                    onClick={this.onSaveItemClick.bind(this)}
                                  >
                                    <i class="mdi mdi-content-save"></i>
                                  </span>
                                  <span 
                                    class="button is-small is-danger"
                                    onClick={this.onDeleteItemClick.bind(this)}
                                  >
                                  <i class="mdi mdi-delete-variant"></i>
                                 </span>
                                </div>
                              </div>                    
                            </div>
                          ) : (
                            <div>
                              {name}
                              <div class="toolbox is-pulled-right">
                                <div class="buttons has-addons">
                                  <span 
                                    class="button is-small is-link"
                                    onClick={this.toggleEditItemMode.bind(this)}
                                  >
                                    <i class="mdi mdi-pencil"></i>
                                  </span>
                                  <span 
                                    class="button is-small is-danger"
                                    onClick={this.onDeleteItemClick.bind(this)}
                                  >
                                  <i class="mdi mdi-delete-variant"></i>
                                 </span>
                                </div>
                              </div>                      
                            </div>
                          )}
                        </div>
                      </div>    
                    </div>
                  </div>
                  <div class="panel-block">
                      {itemPropertiesForm}
                  </div>
                  </div>
                )
            }
            return (
                <div class="columns is-12-desktop">
                    <div class="column is-3-desktop">
                        <div class="panel-block">
                            {containerPropertiesForm}
                        </div>
                        <div className="vertical-spacing"/>
                        {itemProperties}
                    </div>

                    <div id="EditContainerDiv" class="column is-9-desktop" style={{height:'100%'}}>
                        <div className="EditContainer" style={containerStyle} ref={node => this.container = node}>
                            <Grid
                                state="editGrid"
                                gridId="editGrid"
                                items={this.state.items}
                                onMove={this.onMove.bind(this)}
                                zoom={this.state.zoom}
                                dragEnabled={true}
                                onDragEnd={this.onDragEnd.bind(this)}
                                onResizeStop={this.onResizeStop.bind(this)}
                                onNewItem={this.onNewItem.bind(this)}
                                responsive={true}
                                majorGridLine={this.state.majorGridLine}
                                verticalMargin={-1}
                                gridWidth={this.gridWidth}
                                gridHeight={this.gridHeight}
                                layoutWidth={this.state.layoutWidth}
                                layoutHeight={this.state.layoutHeight}
                            />
                        </div>
                    </div>
                </div>
            )
        }
        
        return (
            <div id="EditContainerDiv" className="EditContainer" style={containerStyle} ref={node => this.container = node}>
                <Grid
                        state="editGrid"
                        gridId="editGrid"
                        items={this.state.items}
                        onMove={this.onMove.bind(this)}
                        zoom={this.state.zoom}
                        dragEnabled={true}
                        onDragEnd={this.onDragEnd.bind(this)}
                        onResizeStop={this.onResizeStop.bind(this)}
                        onNewItem={this.onNewItem.bind(this)}
                        responsive={true}
                        majorGridLine={this.state.majorGridLine}
                        verticalMargin={-1}
                        gridWidth={this.gridWidth}
                        gridHeight={this.gridHeight}
                        layoutWidth={this.state.layoutWidth}
                        layoutHeight={this.state.layoutHeight}
                />
            </div>
        )
    }
}
