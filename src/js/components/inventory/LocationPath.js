'use strict';
import {h} from 'preact';
import React, {
    Component, PureComponent
}
from 'react';
import Grid from './Grid';
import PropTypes from 'prop-types';
import * as _ from 'lodash';
// import Perf from 'react-addons-perf';

export default class LocationPath extends Component {

    static defaultProps = {
        path: [],
        keyProp:'id'
    }

    static propTypes = {
        path: PropTypes.arrayOf(PropTypes.object).isRequired,
        keyProp: PropTypes.string
    }

    constructor(props, context) {

        super(props, context);
        
        this.gridWidth = 40
        this.gridHeight = 40
        this.selectedItem = null
        const layoutWidthUnits=35
        const layoutHeightUnits=15
        this.state = {
            zoom:1.0,
            units:'m',
            gridWidth:40,
            gridHeight:40,
            majorGridLine:5,
            layoutName:'Lab',
            layoutWidthUnits:layoutWidthUnits,
            layoutHeightUnits:layoutHeightUnits,
            layoutTop:0,
            layoutLeft:0,
            layoutRight:0,
            layoutBottom:0,
            layoutWidth: this.gridWidth*layoutWidthUnits,
            layoutHeight: this.gridHeight*layoutHeightUnits,
            defaultName : '-80C',
            defaultWidth : 1,
            defaultHeight : 1,
            defaultColor : 'aqua',
            defaultFontSize:'0.3',
            locationPath:props.path
        };
    }
    
    componentWillReceiveProps(props) {
        console.log('LocationPath:',props.path)
        this.setState({locationPath:props.path})
    }

    onSelectItem(key) {
        console.log('Location Path: selectItem:',key)
        app.actions.inventory.refreshInventoryPath(key)
        return
        
        const keyProp = this.props.keyProp
        const items = this.state.locationPath[0].items.map(function (item) {
            item.selected = item[keyProp] === key
            return item;
        });
        const locationPath = this.state.locationPath.slice()
        this.setState({
            locationPath:locationPath
        })
    }
    
    onMove(event) {
    }
    
    onResize = ()=> {
        //console.log('grid onResize')
        if (window.requestAnimationFrame) {
            window.requestAnimationFrame(this.getDOMWidth);
        } else {
            setTimeout(this.getDOMWidth, 66);
        }
    }
    
    getDOMWidth = ()=> {
        var rect = this.container && this.container.getBoundingClientRect();
        //console.log('getDOMWidth',this.container,rect)
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

    render() {
        const item = this.state.locationPath[this.state.locationPath.length-1]
        //const item = this.state.locationPath[0]
        if (!item) return
        const containerStyle = {
            padding:0,
            margin:0,
            width:this.props.width+'px',
            height:this.props.height+'px',
            overflow:'auto'
        }
        const locationPath = (
            <div className="tile is-vertical" style={containerStyle}>
                <Grid
                        state="navigateGrid"
                        gridId="navGrid"
                        items={item.items}
                        onMove={this.onMove.bind(this)}
                        zoom={this.props.zoom}
                        dragEnabled={false}
                        responsive={true}
                        majorGridLine={item.majorGridLine}
                        verticalMargin={-1}
                        onDragEnd={this.onSelectItem.bind(this)}
                        gridWidth={item.gridWidth}
                        gridHeight={item.gridHeight}
                        layoutWidth={item.gridWidth*item.layoutWidthUnits}
                        layoutHeight={item.gridHeight*item.layoutHeightUnits}
                />
            </div>
        )
        return (
            <div ref={node => this.container = node}>
                <div className="tile">
                    {locationPath}
                </div>
            </div>
        )
    }
}
