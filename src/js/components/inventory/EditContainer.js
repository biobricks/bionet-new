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
        const zoomIndex = this.initZoomIndex(props.zoom, this.zoomLevel)
        
        this.state = {
            gridWidth:40,
            gridHeight:40,
            layoutTop:0,
            layoutLeft:0,
            layoutRight:0,
            layoutBottom:0,
            defaultName : '-80C',
            defaultWidth : 1,
            defaultHeight : 1,
            defaultColor : 'aqua',
            defaultFontSize:'0.3',
            zoomIndex:zoomIndex,
            zoom:this.zoomLevel[zoomIndex],
            items:props.items
        };
        this.componentWillReceiveProps(props)
    }
    
    componentWillReceiveProps(props) {
        const container=props.container
        console.log('EditContainer props:',props, this.state)
        var zoomIndex = this.state.zoomIndex
        //            items:props.items,

        var zoom = this.state.zoom
        if (props.width) {
            zoomIndex = this.initZoomIndex(props.zoom, this.zoomLevel)
            zoom = this.zoomLevel[zoomIndex]
        }
        this.setState({
            containerId:container.id,
            units:container.units,
            majorGridLine:container.majorGridLine,
            layoutName:container.name,
            layoutWidthUnits:container.layoutWidthUnits,
            layoutHeightUnits:container.layoutHeightUnits,
            layoutWidth: this.gridWidth*container.layoutWidthUnits,
            layoutHeight: this.gridHeight*container.layoutHeightUnits+1,
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
    
    selectItem(item) {
        console.log('selectItem:',item)
        const keyProp = this.props.keyProp
        const key = (item && item[keyProp]) ? item[keyProp] : null
        this.selectedItem = item
        const items = this.state.items.map(function (_item) {
            _item.selected = _item[keyProp] === key
            return _item;
        });
        if (item) {
            this.setState({
                defaultName : item.name,
                defaultWidth : item.width / this.gridWidth,
                defaultHeight : item.height / this.gridHeight,
                defaultColor : item.color,
                defaultFontSize : (item.fontSize) ? item.fontSize : '0.3'
            })
        }
        this.onUpdateItems(items)
    }
    
    onDragEnd(source, xp, yp, isDrag) {
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
        const col = Math.round(x / this.gridWidth)
        const row = Math.round(y / this.gridHeight)
        const isOutsideGrid = xp < x1 || xp > x2 || yp < y1 || yp > y2 || col >= this.state.layoutWidthUnits || row >= this.state.layoutHeightUnits
        console.log('onDragEnd:', isDrag, xp, yp, x1,x2,y1,y2,col,row)
        if (isDrag) {
            this.selectedItem = null
            if (isOutsideGrid) {
                // gridtodo: delete physical api call
                console.log('onDragEnd, deleting')
                this.deleteItem(source)
            } else {
                app.actions.inventory.updateItem(source.id,function(err,item){
                    if (!err) {
                        item.parent_x = col+1
                        item.parent_y = row+1
                    }
                    console.log('onDragEnd updateItem',item)
                    return item
                })
                source.row = row
                source.col = col
                console.log('onDragEnd, moving', source)
                const items = this.state.items.map(function (item) {
                    if (item.id===source.id) return source
                    return item
                });
                this.onUpdateItems(items)
            }
        }
        if (!isOutsideGrid) this.selectItem(source)
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

    onNewItem(item) {
        // search all items for click inside item bounds (row, row+height, col, col+width), abort add new item if inside existing
        const x = item.col
        const y = item.row
        if (x<0 || x >= this.state.layoutWidthUnits || y<0 || y >= this.state.layoutHeightUnits) {
            this.selectItem(null)
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

        // gridtodo: save new physical api call
        item.name = this.state.defaultName
        item.width = this.state.defaultWidth * this.gridWidth
        item.height = this.state.defaultHeight * this.gridHeight
        item.color = this.state.defaultColor
        item.fontSize = this.state.defaultFontSize

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
        console.log('container mousedown:',pageX,pageY,isOutside)
        if (isOutside) this.selectItem(null)
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
        
        app.actions.inventory.updateItem(this.selectedItem.id,function(err,item){
            var updatedItem = Object.assign(item,update)
            console.log('updateSelection:',updatedItem)
            return updatedItem
        })
        
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
    
    render() {
        const containerStyle = {
            padding:0,
            margin:0,
            width:this.props.width+'px',
            height:this.props.height+'px',
            overflow:'auto'
        }
        /*
                <div style={{marginTop:'20px'}}/>
                <button id="clearItems" style={{position:'relative',left:35}}>Clear</button>
        */
        //                <hr style={{margin:'10px 0px 10px 0px',width:'1200px'}}/>

        //console.log('rendering Grid Container:',this.props)
        /*
                <ContainerPropertiesForm
                    name={this.state.layoutName}
                    width={this.state.layoutWidthUnits}
                    height={this.state.layoutHeightUnits}
                    majorGridLine={this.state.majorGridLine}
                    units={this.state.units}
                    onChange={this.onUpdateContainerProperties.bind(this)}
                />
                <ItemPropertiesForm
                    name={this.state.defaultName}
                    width={this.state.defaultWidth}
                    height={this.state.defaultHeight}
                    color={this.state.defaultColor}
                    fontSize={this.state.defaultFontSize}
                    onChange={this.onUpdateItemProperties.bind(this)}
                />
                <div style={{marginTop:'20px'}}/>
                <div style={{marginTop:'20px'}}/>
        */
        var containerPropertiesForm=null
        if (this.props.fullWidth) {
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
                    <hr/>
                </div>
            )
        }
        return (
            <div>
                <ItemPropertiesForm
                    name={this.state.defaultName}
                    width={this.state.defaultWidth}
                    height={this.state.defaultHeight}
                    color={this.state.defaultColor}
                    fontSize={this.state.defaultFontSize}
                    onChange={this.onUpdateItemProperties.bind(this)}
                />
                <div style={{marginTop:'20px'}}/>
                <span className="pure-form" style={{display:'block',float:'right'}}><label>Zoom</label><SliderControl index={this.state.zoomIndex} values={this.zoomLevel} name="zoomSlider" onChange={this.onZoom.bind(this)}/></span>
                <div style={containerStyle} ref={node => this.container = node}>
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
        )
    }
}
