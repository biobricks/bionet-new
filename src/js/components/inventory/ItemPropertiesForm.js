'use strict';
import { h } from 'preact';
import React, { Component, PureComponent } from 'react';
import PropTypes from 'prop-types'
import ItemPropertiesFormCSS from './ItemPropertiesForm.scss'
import ColorPicker from 'react-color-picker';

export default class ItemPropertiesForm extends Component {
    
  static propTypes = {
    name     : PropTypes.string,
    width    : PropTypes.number,
    height   : PropTypes.number,
    xUnits   : PropTypes.number,
    yUnits   : PropTypes.number,
    color    : PropTypes.string,
    fontSize : PropTypes.string,
    onChange : PropTypes.func.isRequired
  }

  static defaultProps = {
    name     : 'item',
    width    : 1,
    height   : 1,
    color    : 'aqua',
    fontSize : '0.3',
    yUnits   : 1,
    xUnits   : 1,
    onChange : () => {}
  }

  constructor(props, context) {
    super(props, context)
    this.state = {
      name        : props.name,
      description : props.description,
      width       : props.width,
      height      : props.height,
      color       : props.color,
      fontSize    : props.fontSize,
      yUnits      : props.yUnits,
      xUnits      : props.xUnits,
      enableColorPicker : false
    }
    this.onSetColor = this.onSetColor.bind(this);
    this.onFormInput = this.onFormInput.bind(this);
  }

  componentWillReceiveProps(props) {
    this.setState({
      name        : props.name,
      description : props.description,
      width       : props.width,
      height      : props.height,
      color       : props.color,
      yUnits      : props.yUnits,
      xUnits      : props.xUnits,
      fontSize    : props.fontSize
    });
  }

  update(newProps) {
    const newState = Object.assign(this.state, newProps);
    this.setState(newState);
    if (this.props.onChange) {
      this.props.onChange(newProps);
    }  
  }

  onFormInput(e) {
    const inputType = e.target.type;
    const inputName = e.target.name;
    let inputValue = inputType === 'number' ? Number(e.target.value) : e.target.value;
    let update = {};
    update[inputName] = inputValue;
    this.update(update);
  }

  onColor(e) {
    this.update({ color: e.target.value });
  }

  onSelectColor(e) {
    this.setState({ enableColorPicker: !this.state.enableColorPicker });
  }

  onSetColor(color, c) {
    this.update({ color: color });
    this.setState({ enableColorPicker: false });
  }

  onFontSize(e) {
    this.update({ fontSize: e.target.value });
  }

  /*
    <ColorPicker color={this.state.color} onChange={this.onSetColor.bind(this)}>
    <div>test</div>
    </ColorPicker>
  */

  render() {
    let colorPicker = null;
    if (this.state.enableColorPicker) {
      colorPicker = (
        <div style={{position:'relative',display:'inline-block',backgroundColor:'#ffffff',width:'200px',zIndex:'11000'}}>
          <ColorPicker
            value={this.state.color}
            onDrag={this.onSetColor.bind(this)}
            saturationWidth={150}
            saturationHeight={150}
            huewidth={150}
            hueHeight={150}
          />
        </div>
      );
    }
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
                placeholder="New Container Name"
                onInput={this.onFormInput}
              />
          </div>
        </div>

        <div class="field is-horizontal">
          <div class="field-label is-normal is-narrow">
            <label class="label">Color</label>
          </div>
          <div class="field-body">
            <span 
              onClick={this.onSelectColor.bind(this)} 
              style={{backgroundColor:this.state.color}}
            >
              {this.state.color}
              {colorPicker}
            </span>
          </div>
        </div>

        <div class="field is-horizontal">
          <div class="field-label is-normal is-narrow">
            <label class="label">Description</label>
          </div>
          <div class="field-body">
            <textarea 
              class="textarea"
              name="description"
              type="text" 
              value={this.state.description}
              placeholder="A short description of the Container."
              onInput={this.onFormInput}
              rows="2"
            >{this.state.description}</textarea>
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
                min="1"
                step="1"
                value={this.state.width}
                onInput={this.onFormInput}
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
                min="1"
                step="1"
                value={this.state.height}
                onInput={this.onFormInput}
              />
          </div>
        </div> 

        <div class="field is-horizontal">
          <div class="field-label is-normal is-narrow">
            <label class="label">Rows</label>
          </div>
          <div class="field-body">
              <input 
                class="input"
                type="number" 
                name="yUnits"
                min="1"
                step="1"
                value={this.state.yUnits}
                onInput={this.onFormInput}
              />
          </div>
        </div>
        
        <div class="field is-horizontal">
          <div class="field-label is-normal is-narrow">
            <label class="label">Columns</label>
          </div>
          <div class="field-body">
              <input 
                class="input"
                type="number" 
                name="xUnits"
                min="1"
                step="1"
                value={this.state.xUnits}
                onInput={this.onFormInput}
              />
          </div>
        </div>                        

        <div class="field is-horizontal">
          <div class="field-label is-normal is-narrow">
            <label class="label">Font Size</label>
          </div>
          <div class="field-body">
              <input 
                class="input"
                type="number" 
                min="0.1"
                step="0.1"
                name="fontSize"
                value={this.state.fontSize}
                placeholder="New Container Name"
                onInput={this.onFontSize.bind(this)}
              />
          </div>
        </div>

      </form>
    );
  }
}
