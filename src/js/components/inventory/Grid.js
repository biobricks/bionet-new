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
            console.log('adding new item:', e)
            if (e.button === 0 || isTouch) {
                const rect = this.container.getBoundingClientRect();
                const layoutLeft = rect.left
                const layoutTop = rect.top
                const clientX = isTouch ? e.targetTouches[0].pageX : e.pageX;
                const clientY = isTouch ? e.targetTouches[0].pageY : e.pageY;
                const gridWidth = (this.props.gridWidth * this.props.zoom);
                const gridHeight = (this.props.gridHeight * this.props.zoom);
                //{'url': 'http://invisionapp.com/subsystems/do_ui_kit/assets/img/screens/original-1x/screen-1-1-login.jpg', 'name': 'login', 'sort': 1, 'key': 1},
                //const id = this.props.items.length
                const id=0
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

        getDOMWidth = ()=> {
            var width = this.container && this.container.clientWidth;
            width++;
            const height = this.container && this.container.clientHeight;

            if (this.state.layoutWidth !== width) {
                this.setState({
                    layoutWidth: width
                });
            }
            if (this.container) this.container.addEventListener('mousedown', this.onMouseDown.bind(this));
        }

        componentDidMount() {
            //If responsive, listen for resize
            if (this.props.responsive) {
                window.addEventListener('resize', this.onResize);
            }
            this.onResize();
        }

        componentWillUnmount() {
            console.log('grid componentWillUnmount')
            window.removeEventListener('resize', this.onResize);
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
                    this.props.keyProp);
                const itemsLength = this.props.items.length;
                gridItems = this.props.items.map(item => {
                    const key = item[this.props.keyProp];
                    const index = sortedIndex[key];
                    //console.log('item w,h:', item.width, item.height)
                          return (
                          <WrappedDisplayObject
                            item={item}
                            index={index}
                            key={key}
                            itemsLength={itemsLength}
                            animation={this.props.animation}
                            itemWidth={item.width}
                            itemHeight={item.height}
                            gridWidth={gridWidth}
                            gridHeight={gridHeight}
                            layoutTop={rect.top}
                            layoutLeft={rect.left}
                            layoutWidth={this.state.layoutWidth}
                            layoutHeight={this.state.layoutHeight}
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
            const layout = new LayoutManager(options, this.state.layoutWidth, this.state.layoutHeight);
            
            const gridMajorXAxis=gridWidth*this.props.majorGridLine
            const gridMajorYAxis=gridHeight*this.props.majorGridLine
            const gridMinorXAxis=gridWidth
            const gridMinorYAxis=gridHeight
            
            //console.log('grid size:',gridMajorXAxis,gridMinorXAxis)
            //const backgroundColor = '#269'
            //const gridColorMajorAxis = 'rgba(255,255,255,.25)'
            //const gridColorMinorAxis = 'rgba(255,255,255,.125)'
            const backgroundColor = '#fff'
            const gridColorMajorAxis = 'rgba(0,0,255,.25)'
            const gridColorMinorAxis = 'rgba(0,0,255,.125)'
            const backgroundImage="linear-gradient("+gridColorMajorAxis+" 1px, transparent 1px),linear-gradient(90deg, "+gridColorMajorAxis+" 1px, transparent 1px),linear-gradient("+gridColorMinorAxis+" 1px, transparent 1px),linear-gradient(90deg, "+gridColorMinorAxis+" 1px, transparent 1px)"
            
            //const backgroundImage="linear-gradient(transparent "+gridMajorXAxis-1+"px, "+gridColorMajorAxis+" " +gridMajorXAxis+"px)"
            //const backgroundImage="repeating-linear-gradient(transparent "+gridMajorXAxis-1+"px, "+gridColorMajorAxis+" " +gridMajorXAxis+"px),repeating-linear-gradient(90deg, "+gridColorMajorAxis+" 1px, transparent 1px),repeating-linear-gradient("+gridColorMinorAxis+" 1px, transparent 1px),repeating-linear-gradient(90deg, "+gridColorMinorAxis+" 1px, transparent 1px)"
            
            const backgroundSize=gridMajorXAxis+"px "+gridMajorYAxis+"px, "+gridMajorXAxis+"px "+gridMajorYAxis+"px, "+gridMinorXAxis+"px "+gridMinorYAxis+"px, "+gridMinorXAxis+"px "+gridMinorYAxis+"px"

            const gridStyle = {
                width: this.props.zoom*this.props.layoutWidth,
                height: this.props.zoom*this.props.layoutHeight,
                position: 'relative',
                display: 'block',
                backgroundColor:backgroundColor,
                backgroundImage: backgroundImage,
                backgroundSize: backgroundSize
            }
            return (
                <div
                    style={gridStyle}
                    className="grid tile is-2"
                    ref={node => this.container = node}
                >
                    {gridItems}
                </div>
            );
        }
}
