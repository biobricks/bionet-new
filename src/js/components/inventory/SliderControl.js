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
            value:props.values[props.index],
            index:props.index
        }
    }
    componentWillReceiveProps(props) {
        //console.log('sliderControl componentWillReceiveProps ', props.index, props.values)
        this.setState({
            value:props.values[props.index],
            index:props.index
        })
    }
    updateValue(index) {
        const value = this.props.values[index];
        if (this.props.onChange) this.props.onChange(value, index)
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
            <span style={{display:'inline-block'}}>
                <i className="fa fa-search-minus slider" onClick={this.onDecrementValue.bind(this)}></i>
                <input name={this.props.name} id={this.props.name} className="slider" list="tickmarks" onChange={this.onValue.bind(this)} type="range" min="0" max={this.props.values.length-1} step="1" value={this.state.index}>
                </input>
                <i className="fa fa-search-plus slider" onClick={this.onIncrementValue.bind(this)}></i>
                <span>{this.state.value*100}%</span>
            </span>
        )
    }
}
