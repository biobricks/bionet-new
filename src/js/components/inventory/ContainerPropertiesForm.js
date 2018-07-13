'use strict';

import {h} from 'preact'
import React, {
    Component, PureComponent
}
from 'react';
import SliderControl from './SliderControl'
import PropTypes from 'prop-types'
import ContainerPropertiesCSS from './ContainerPropertiesForm.scss'

export default class ContainerPropertiesForm extends Component {
    static propTypes = {
        name:PropTypes.string,
        width: PropTypes.number,
        height: PropTypes.number,
        units: PropTypes.string,
        majorGridLine: PropTypes.number,
        onChange: PropTypes.func.isRequired,
    }
    static defaultProps = {
        name:'slider',
        width:'20',
        height:'20',
        units:'m',
        majorGridLine:'5',
        onChange:()=>{},
    }
    constructor(props, context) {
        super(props, context)
        
        this.zoomLevel = []
        for (var zl = 0.25; zl <= 2.0; zl += 0.25) {
            this.zoomLevel.push(zl)
        }
        const zoomIndex = Math.trunc(this.zoomLevel.length/2)
        
        this.state = {
            name:props.name,
            width:props.width,
            height:props.height,
            units:props.units,
            zoomIndex:zoomIndex,
            zoom:this.zoomLevel[zoomIndex],
            majorGridLine:props.majorGridLine
        }
    }
    update(newProps) {
        const newState = Object.assign(this.state, newProps)
        this.setState(newState)
        app.state.ContainerEditForm = newState
        app.state.ContainerNewForm = newState
        if (this.props.onChange) this.props.onChange(newProps)
    }
    onName(e) {
        this.update({name:e.target.value})
    }
    onWidth(e) {
        this.update({width:Number(e.target.value)})
    }
    onHeight(e) {
        this.update({height:Number(e.target.value)})
    }
    onMajorGridLine(e) {
        this.update({majorGridLine:Number(e.target.value)})
    }
    onUnits(e) {
        this.update({units:e.target.value})
    }
    onZoom(zoom) {
        this.update({zoom:zoom})
    }
    render() {
        return(
            <form className="pure-form">
                <label>Name</label><input onChange={this.onName.bind(this)} type='text' value={this.state.name} style={{width:160}}/>
                <label>Width</label><input onChange={this.onWidth.bind(this)} type='text' value={this.state.width} style={{width:80}}/>
                <label>Height</label><input onChange={this.onHeight.bind(this)} type='text' value={this.state.height} style={{width:80}}/>   <label>Units</label>
                <select value={this.state.units} onChange={this.onUnits.bind(this)} style={{paddingTop:'4px'}}>
                    <option value="m">m</option>
                    <option value="cm">cm</option>
                    <option value="mm">mm</option>
                    <option value="ft">ft</option>
                    <option value="in">in</option>
                </select>
                <label>Grid Line</label><input onChange={this.onMajorGridLine.bind(this)} type='text' value={this.state.majorGridLine} style={{width:80}}/>
            </form>
        )
    }
}
