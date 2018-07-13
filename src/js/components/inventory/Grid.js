'use strict';
import {h} from 'preact';

import React, {
    Component, PureComponent
}
from 'react';
import {
    debounce, sortBy
}
from 'lodash';

import WrappedDisplayObject from './BaseDisplayObject';
import DragManager from './DragManager';
import LayoutManager from './LayoutManager';
import PropTypes from 'prop-types';
import GridCss from './Grid.scss'

export default class Grid extends Component {
        // todo:
        // add images for items backgroundImage: `url('${this.props.item.url}')`
        // overlay grid onto background image
        // enable/disable grid display
        //animation: 'transform 300ms ease',

        static defaultProps = {
            items: [],
            keyProp: 'id',
            filterProp: 'filtered',
            sortProp: 'sort',
            gridWidth: 40,
            gridHeight: 40,
            majorGridLine:5,
            verticalMargin: -1,
            responsive: false,
            dragEnabled: false,
            gridEnabled: true,
            borderEnabled: false,
            zoom: 1,
            onMove: () => {},
            onDragStart: () => {},
            onDragMove: () => {},
            onDragEnd: () => {}
        }

        static propTypes = {
            items: PropTypes.arrayOf(PropTypes.object),
            gridWidth: PropTypes.number,
            gridHeight: PropTypes.number,
            verticalMargin: PropTypes.number,
            zoom: PropTypes.number,
            majorGridLine:PropTypes.number,
            responsive: PropTypes.bool,
            dragEnabled: PropTypes.bool,
            gridEnabled: PropTypes.bool,
            borderEnabled: PropTypes.bool,
            keyProp: PropTypes.string,
            sortProp: PropTypes.string,
            filterProp: PropTypes.string,
            animation: PropTypes.string,
            onMove: PropTypes.func,
            onDragStart: PropTypes.func,
            onDragMove: PropTypes.func,
            onDragEnd: PropTypes.func
        }

        constructor(props, context) {
            super(props, context);
            this.onResize = debounce(this.onResize, 150);
            this.state = {
                layoutWidth: this.props.layoutWidth,
                layoutHeight: this.props.layoutHeight
            };
        }


        onMouseDown(e) {
            if (!this.container) return
            const isTouch = e.targetTouches && e.targetTouches.length === 1;
            console.log('grid on mouse down:', e)
            
            if (e.button === 0 || isTouch) {
                const rect = this.container.getBoundingClientRect();
                const layoutLeft = rect.left
                const layoutTop = rect.top
                const clientX = isTouch ? e.targetTouches[0].pageX : e.pageX;
                const clientY = isTouch ? e.targetTouches[0].pageY : e.pageY;
                const gridWidth = (this.props.gridWidth * this.props.zoom);
                const gridHeight = (this.props.gridHeight * this.props.zoom);
                const id=0
                    //row: Math.trunc((clientY - layoutTop) / gridHeight)
                const item = {
                    url: 'test',
                    name: 'test',
                    width: 40,
                    height: 40,
                    id: id,
                    sort: id,
                    key: id,
                    col: Math.trunc((clientX - layoutLeft) / gridWidth),
                    row: Math.trunc((clientY - layoutTop) / gridHeight)
                }
                if (this.props.onNewItem) this.props.onNewItem(item)
            }
        }
    
        onResize = ()=> {
            if (window.requestAnimationFrame) {
                window.requestAnimationFrame(this.getDOMWidth);
            } else {
                setTimeout(this.getDOMWidth, 66);
            }
        }
        
        getContainer() {
            return this.container
        }

        getDOMWidth = ()=> {
            var width = this.container && this.container.clientWidth;
            width++;
            const height = this.container && this.container.clientHeight;

            if (this.state.layoutWidth !== width) {
                this.setState({
                    layoutWidth: width,
                    layoutHeight: height
                });
            }
            if (this.container) this.container.addEventListener('mousedown', this.onMouseDown.bind(this));
        }

        componentDidMount() {
            if (this.props.responsive) {
                window.addEventListener('resize', this.onResize);
            }
            this.onResize();
        }

        componentWillUnmount() {
            window.removeEventListener('resize', this.onResize);
            if (this.container) this.container.removeEventListener('mousedown', this.onMouseDown.bind(this));
        }

        render() {
            //console.log('rendering Grid:',this.props)
            if (!this.state.layoutWidth) {
                return <div ref={node => this.container = node}></div>;
            }
            let filteredIndex = 0;
            let sortedIndex = {};

            var rect = (this.container) ? this.container.getBoundingClientRect() : {}
            //console.log('grid render, rect:', rect)

            const gridWidth = (this.props.gridWidth * this.props.zoom);
            const gridHeight = (this.props.gridHeight * this.props.zoom);
            var gridItems = null
            if (this.props.items) {
                
                const dragManager = new DragManager(
                    this.props.onMove,
                    this.props.onDragStart,
                    this.props.onDragEnd,
                    this.props.onDragMove,
                    this.props.keyProp,
                    this.props.gridId);
                
                var keyCounter=0;
                
                gridItems = this.props.items.map(item => {
                    const id = item[this.props.keyProp];
                    const key = keyCounter++
                    const index = sortedIndex[id];
                    const highlighted = (item.id===this.props.highlightedRecord) ? true : false
                    return (
                          <WrappedDisplayObject
                            item={item}
                            index={index}
                            key={key}
                            highlighted={highlighted}
                            itemsLength={this.props.items.length}
                            animation={this.props.animation}
                            itemWidth={item.width}
                            itemHeight={item.height}
                            gridWidth={gridWidth}
                            gridHeight={gridHeight}
                            layoutTop={rect.top}
                            layoutLeft={rect.left}
                            layoutWidth={this.props.layoutWidth}
                            layoutHeight={this.props.layoutHeight}
                            verticalMargin={this.props.verticalMargin}
                            zoom={this.props.zoom}
                            keyProp={this.props.keyProp}
                            filterProp={this.props.filterProp}
                            dragEnabled={this.props.dragEnabled}
                            dragManager={dragManager}
                            onResizeStop={this.props.onResizeStop}
                          />
                    );
                });
                
            }

            const options = {
                gridWidth: gridWidth,
                gridHeight: gridHeight,
                verticalMargin: this.props.verticalMargin,
                zoom: this.props.zoom
            };
            const layout = new LayoutManager(options, this.props.layoutWidth, this.props.layoutHeight);
            
            // todo: add background color to props
            const backgroundColor = '#fff'
            var gridStyle = {
                width: this.props.zoom*this.props.layoutWidth,
                height: this.props.zoom*this.props.layoutHeight,
                backgroundColor:backgroundColor,
            }
            if (this.props.borderEnabled) {
                gridStyle.border = '1px solid black'
            }
            if (this.props.gridEnabled) {
                const gridMajorXAxis=gridWidth*this.props.majorGridLine
                const gridMajorYAxis=gridHeight*this.props.majorGridLine
                const gridMinorXAxis=gridWidth
                const gridMinorYAxis=gridHeight

                // todo: add grid line color to props
                const gridColorMajorAxis = 'rgba(0,0,255,.25)'
                const gridColorMinorAxis = 'rgba(0,0,255,.125)'
                const backgroundImage="linear-gradient("+gridColorMajorAxis+" 1px, transparent 1px),linear-gradient(90deg, "+gridColorMajorAxis+" 1px, transparent 1px),linear-gradient("+gridColorMinorAxis+" 1px, transparent 1px),linear-gradient(90deg, "+gridColorMinorAxis+" 1px, transparent 1px)"

                const backgroundSize=gridMajorXAxis+"px "+gridMajorYAxis+"px, "+gridMajorXAxis+"px "+gridMajorYAxis+"px, "+gridMinorXAxis+"px "+gridMinorYAxis+"px, "+gridMinorXAxis+"px "+gridMinorYAxis+"px"
                
                gridStyle.backgroundImage = backgroundImage
                gridStyle.backgroundSize = backgroundSize
            }
            
            return (
                <div
                    style={gridStyle}
                    className="grid"
                    ref={node => this.container = node}
                >
                    {gridItems}
                </div>
            );
        }
}
