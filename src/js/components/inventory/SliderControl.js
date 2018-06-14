'use strict';

import {h} from 'preact'
import React, {
    Component, PureComponent
}
from 'react';
import SliderControlCss from './SliderControl.scss'
import PropTypes from 'prop-types'

export default class SliderControl extends Component {
    static propTypes = {
        values: PropTypes.arrayOf(PropTypes.number).isRequired,
        onChange: PropTypes.func.isRequired,
        name:PropTypes.string,
        index: PropTypes.number,
        width: PropTypes.string,
        height: PropTypes.string,
        enabled: PropTypes.bool
    }
    static defaultProps = {
        name:'slider',
        onChange:()=>{},
        values:[0,1],
        index:0,
        width:'100%',
        height:'100%',
        enabled:true
    }
    constructor(props, context) {
        super(props, context)
        this.state = {
            value:1.0,
            index:3
        }
    }
    updateValue(index) {
        const value = this.props.values[index];
        if (this.props.onChange) this.props.onChange(value)
        console.log('updateValue ', index, value)
        this.setState({
            index:index,
            value:value
        })
    }
    onValue(e) {
        var input = document.getElementById(this.props.name);
        this.updateValue(input.valueAsNumber)
    };
    onDecrementValue(e) {
        var input = document.getElementById(this.props.name);
        input.stepDown()
        this.updateValue(input.valueAsNumber)
    }
    onIncrementValue(e) {
        var input = document.getElementById(this.props.name);
        input.stepUp()
        this.updateValue(input.valueAsNumber)
    }
    render() {
        return(
            <span>
                <i className="fa fa-search-minus slider" onClick={this.onDecrementValue.bind(this)}></i>
                <input name={this.props.name} id={this.props.name} className="slider" list="tickmarks" onChange={this.onValue.bind(this)} type="range" min="0" max={this.props.values.length-1} step="1" value={this.state.index}>
                </input>
                <i className="fa fa-search-plus slider" onClick={this.onIncrementValue.bind(this)}></i>
                <span>{this.state.value*100}%</span>
            </span>
        )
    }
}
