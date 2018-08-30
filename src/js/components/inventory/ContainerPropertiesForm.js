'use strict';

import { h } from 'preact';
import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class ContainerPropertiesForm extends Component {
    
  static propTypes = {
    name: PropTypes.string,
    width: PropTypes.number,
    height: PropTypes.number,
    units: PropTypes.string,
    majorGridLine: PropTypes.number,
    onChange: PropTypes.func.isRequired
  }

  static defaultProps = {
    name: 'slider',
    width: '20',
    height: '20',
    units: 'm',
    majorGridLine: '5',
    onChange: () => {}
  }

  constructor(props, context) {
    super(props, context);
    this.zoomLevel = [];
    for (let zl = 0.25; zl <= 2.0; zl += 0.25) {
      this.zoomLevel.push(zl);
    }
    const zoomIndex = Math.trunc(this.zoomLevel.length / 2);
    this.state = {
      name: props.name,
      width: props.width,
      height: props.height,
      units: props.units,
      zoomIndex: zoomIndex,
      zoom: this.zoomLevel[zoomIndex],
      majorGridLine: props.majorGridLine
    };
  }

  update(newProps) {
    const newState = Object.assign(this.state, newProps);
    this.setState(newState);
    app.state.ContainerEditForm = newState;
    app.state.ContainerNewForm = newState;
    if (this.props.onChange) {
      this.props.onChange(newProps);
    }  
  }

  onName(e) {
    this.update({
      name: e.target.value
    });
  }

  onWidth(e) {
    this.update({
      width: Number(e.target.value)
    });
  }

  onHeight(e) {
    this.update({
      height: Number(e.target.value)
    });
  }

  onMajorGridLine(e) {
    this.update({
      majorGridLine: Number(e.target.value)
    });
  }

  onUnits(e) {
    this.update({
      units: e.target.value
    });
  }

  onZoom(zoom) {
    this.update({
      zoom: zoom
    });
  }

  render() {
    return (
      <form className="pure-form">
        
        <div class="field is-horizontal">
          <div class="field-label is-normal is-narrow">
            <label class="label">Name</label>
          </div>
          <div class="field-body">
              <input 
                class="input"
                type="text" 
                name="name"
                value={this.state.name}
                placeholder="Name"
                onInput={this.onName.bind(this)}
              />
          </div>
        </div>

        <div class="field is-horizontal">
          <div class="field-label is-normal is-narrow">
            <label class="label">Width</label>
          </div>
          <div class="field-body">
              <input 
                class="input"
                type="number" 
                name="width"
                min='1'
                step='1'                 
                value={this.state.width}
                onInput={this.onWidth.bind(this)}
              />
          </div>
        </div>

        <div class="field is-horizontal">
          <div class="field-label is-normal is-narrow">
            <label class="label">Height</label>
          </div>
          <div class="field-body">
              <input 
                class="input"
                type="number" 
                name="height"
                min='1'
                step='1'                 
                value={this.state.height}
                onInput={this.onHeight.bind(this)}
              />
          </div>
        </div>

        <div class="field is-horizontal">
          <div class="field-label is-normal is-narrow">
            <label class="label">Units</label>
          </div>
          <div class="field-body">
            <div class="select">  
              <select 
                value={this.state.units} 
                name="units"
                onInput={this.onUnits.bind(this)}
              >
                <option value="m">m</option>
                <option value="cm">cm</option>
                <option value="mm">mm</option>
                <option value="ft">ft</option>
                <option value="in">in</option>
              </select>
            </div>  
          </div>
        </div>

        <div class="field is-horizontal">
          <div class="field-label is-normal is-narrow">
            <label class="label">Grid Line</label>
          </div>
          <div class="field-body">
              <input 
                class="input"
                type="number" 
                name="majorGridLine"
                min='1'
                step='1'                 
                value={this.state.majorGridLine}
                onInput={this.onMajorGridLine.bind(this)}
              />
          </div>
        </div>

      </form>
    )
  }
}
