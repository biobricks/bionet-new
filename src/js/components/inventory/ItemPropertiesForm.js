'use strict';

import {h} from 'preact'
import React, {
    Component, PureComponent
}
from 'react';
import PropTypes from 'prop-types'

export default class ItemPropertiesForm extends Component {
    static propTypes = {
        name:PropTypes.string,
        width: PropTypes.number,
        height: PropTypes.number,
        color: PropTypes.string,
        fontSize: PropTypes.string,
        onChange: PropTypes.func.isRequired
    }
    static defaultProps = {
        name:'item',
        width:1,
        height:1,
        color:'aqua',
        fontSize:'0.3',
        onChange:()=>{}
    }
    constructor(props, context) {
        super(props, context)
        
        this.state = {
            name:props.name,
            width:props.width,
            height:props.height,
            color:props.color,
            fontSize:props.fontSize
        }
    }
    componentWillReceiveProps(props) {
        this.setState({
            name:props.name,
            width:props.width,
            height:props.height,
            color:props.color,
            fontSize:props.fontSize
        })
    }
    update(newProps) {
        const newState = Object.assign(this.state, newProps)
        this.setState(newState)
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
    onColor(e) {
        this.update({color:e.target.value})
    }
    onFontSize(e) {
        this.update({fontSize:e.target.value})
    }
    render() {
        return(
            <form className="pure-form" style={{textAlign:'left'}}>
                <label>Name</label><input onChange={this.onName.bind(this)} type='text' value={this.state.name} style={{width:160}}/>
                <label>Width</label><input onChange={this.onWidth.bind(this)} type='text' value={this.state.width} style={{width:80}}/>
                <label>Height</label><input onChange={this.onHeight.bind(this)} type='text' value={this.state.height} style={{width:80}}/>
                <label>Color</label><input onChange={this.onColor.bind(this)} type='text' value={this.state.color} style={{width:120}}/>
                <label>Font Size</label><input onChange={this.onFontSize.bind(this)} type='text' value={this.state.fontSize} style={{width:80}}/>
            </form>
        )
    }
}