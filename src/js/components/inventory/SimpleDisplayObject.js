'use strict';
import {h} from 'preact';
import React from 'react';
import SimpleDisplayObjectCss from './SimpleDisplayObject.scss'
//const ResizableBox = require('react-resizable').ResizableBox;
//import Resizable from 're-resizable';
//const ResizableBox = require('../ResizableBox');
//const Resizable = require('re-resizable').Resizable;

export default class SimpleContainer extends React.Component {
    // todo:
    // add default props, prop-types, constructor
    // add images for items backgroundImage: `url('${this.props.item.url}')`
    // support resizing with drag/drop
    render() {
        const itemHeight = this.props.item.height*this.props.zoom
        const itemWidth = this.props.item.width*this.props.zoom
        const itemStyle = {
            width:itemWidth+'px',
            height:itemHeight+'px',
            background:'linear-gradient('+this.props.item.color+','+this.props.item.color+')'
        };

        const fontSize = (this.props.item.fontSize) ? Number(this.props.item.fontSize)*this.props.gridHeight : 0.3*this.props.gridHeight
        const itemTextStyle = {
            lineHeight:itemHeight+'px',
            fontSize:fontSize+'px'
        }
        
        const selectedClass = (this.props.item.selected) ? 'selectedDisplayObject' : 'deselectedDisplayObject'
        
        //console.log('rendering Sample Display',this.props.item.height, itemHeight)
        return (
            <div style={itemStyle} className={"gridItem displayObject "+selectedClass} ref={node => this.props.setDragNode(node)}>
                <span className="itemTextStyle" style={itemTextStyle}>{this.props.item.name || this.props.item.key}</span>
            </div>
        )
    }
}
