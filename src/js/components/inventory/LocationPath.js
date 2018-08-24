'use strict';
import { h } from 'preact';
import React, { Component } from 'react';
import Grid from './Grid';
import PropTypes from 'prop-types';

export default class LocationPath extends Component {

  static defaultProps = {
    path: [],
    keyProp: 'id',
    gridEnabled: true,
    borderEnabled: false
  }

  static propTypes = {
    path: PropTypes.arrayOf(PropTypes.object).isRequired,
    keyProp: PropTypes.string,
    gridEnabled: PropTypes.bool,
    borderEnabled: PropTypes.bool
  }

  constructor(props, context) {
    super(props, context);
    this.gridWidth = 40;
    this.gridHeight = 40;
    this.selectedItem = null;
    const layoutWidthUnits = 1;
    const layoutHeightUnits = 1;
    this.state = {
      zoom: 1.0,
      units: 'm',
      gridWidth: 40,
      gridHeight: 40,
      majorGridLine: 5,
      layoutName: 'Lab',
      layoutWidthUnits: layoutWidthUnits,
      layoutHeightUnits: layoutHeightUnits,
      layoutTop: 0,
      layoutLeft: 0,
      layoutRight: 0,
      layoutBottom: 0,
      layoutWidth: this.gridWidth*layoutWidthUnits,
      layoutHeight: this.gridHeight*layoutHeightUnits,
      defaultName: '-80C',
      defaultWidth: 1,
      defaultHeight: 1,
      defaultColor: 'aqua',
      defaultFontSize: '0.3',
      locationPath: props.path
    };
  }
    
  onSelectItem(key) {
    console.log('Location Path: selectItem:', key);
    app.actions.inventory.refreshInventoryPath(key);
  }
    
  onMove(event) {}
    
  onResize = () => {
    if (window.requestAnimationFrame) {
      window.requestAnimationFrame(this.getDOMWidth);
    } else {
      setTimeout(this.getDOMWidth, 66);
    }
  }
    
  getDOMWidth = ()=> {
    let rect = this.container && this.container.getBoundingClientRect();
    if (!rect) {
      return;
    }  
    this.setState({
      layoutTop: rect.top,
      layoutLeft: rect.left,
      layoutRight: rect.right,
      layoutBottom: rect.bottom,
      layoutWidth: rect.width,
      layoutHeight: rect.height
    });
  }
    
  componentDidMount() {
    this.onResize();
    console.log('LocationPath componentDidMount:', this.props, this.state);
    if (this.props.onMount) {
      const mapContainerId = 'map-panel-item';
      const mapContainer = document.getElementById(mapContainerId);
      console.log('EditContainer componentDidMount:', mapContainerId, mapContainer);
      let containerWidth = 600;
      let containerHeight = 450;
      if (mapContainer) {
        containerWidth = mapContainer.offsetWidth - 24;
        containerHeight = mapContainer.offsetHeight - 16;
      }
      this.props.onMount(containerWidth, containerHeight);
    }
  }

  render() {
    const item = this.props.container;
    if (!item) {
      return;
    }  
    const containerStyle = {
      width: this.props.width + 'px'
    };
    const viewOrientation = (item.viewOrientation ==='side') ? 'side view' : 'top view';

    return (
      <div ref={node => this.container = node}>
        <div
          className="LocationPath"
          style={containerStyle}
        >
          { (viewOrientation) ? <h5 class="LocationTitle">{item.name}, {viewOrientation}</h5> : null }
          <Grid
            state="navigateGrid"
            gridId="navGrid"
            items={item.items}
            highlightedRecord={this.props.highlightedRecord}
            onMove={this.onMove.bind(this)}
            zoom={this.props.zoom}
            dragEnabled={false}
            gridEnabled={this.props.gridEnabled}
            borderEnabled={this.props.borderEnabled}
            responsive={true}
            majorGridLine={item.majorGridLine}
            verticalMargin={-1}
            onDragEnd={this.onSelectItem.bind(this)}
            gridWidth={this.gridWidth}
            gridHeight={this.gridHeight}
            layoutWidth={this.gridWidth * item.layoutWidthUnits}
            layoutHeight={this.gridHeight * item.layoutHeightUnits}
          />
        </div>
      </div>
    );
  }
}
