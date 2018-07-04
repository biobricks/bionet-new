'use strict';

import {h} from 'preact';
import React, {
    Component, PureComponent
}
from 'react';
import DisplayObject from './SimpleDisplayObject';
import LayoutManager from './LayoutManager';
import PropTypes from 'prop-types';


export default class BaseDisplayObject extends Component {

        static propTypes = {
            item: PropTypes.object,
            style: PropTypes.object,
            index: PropTypes.number,
            dragEnabled: PropTypes.bool,
            dragManager: PropTypes.object,
            itemsLength: PropTypes.number
        }

        state = {}

        updateDrag(x, y) {
            let pauseAnimation = false;
            if (!this.props.dragManager.dragItem) {
                pauseAnimation = true;
                setTimeout(() => {
                    this.setState({
                        pauseAnimation: false
                    });
                }, 20);
            }
            this.setState({
                dragX: x,
                dragY: y,
                pauseAnimation: pauseAnimation
            });
        }
        
        onResizeStop(e,data) {
            this.props.onResizeStop(this.props.item.id, data.size.width, data.size.height)
        }

        onDrag = (e) => {
            if (this.props.dragManager && this.props.dragEnabled) {
                this.props.dragManager.startDrag(e, this.domNode, this.props.item, this.updateDrag.bind(this));
            } else {
                if (this.props.dragManager) this.props.dragManager.endDrag(this.props.item)
            }
        }

        getStyle() {
            var itemWidth = this.props.itemWidth
            var itemHeight = this.props.itemHeight
            const options = {
                itemWidth: itemWidth,
                itemHeight: itemHeight,
                verticalMargin: this.props.verticalMargin,
                zoom: this.props.zoom
            };
            const gridWidth = this.props.gridWidth
            const gridHeight = this.props.gridHeight
            const layout = new LayoutManager(options, this.props.layoutWidth, this.props.layoutHeight, gridWidth, gridHeight);
            const col = this.props.item.col
            const row = this.props.item.row

            const style = layout.getStyle(this.props.index, row, col,
                this.props.animation,
                this.props.item[this.props.filterProp]);

            if (this.props.dragManager && this.props.dragManager.dragItem &&
                this.props.dragManager.dragItem[this.props.keyProp] === this.props.item[this.props.keyProp]) {
                const dragStyle = this.props.dragManager.getStyle(this.state.dragX, this.state.dragY);
                return Object.assign(style, dragStyle);
            } else if (this.state && this.state.pauseAnimation) {
                const pauseAnimationStyle = Object.assign({}, style)
                pauseAnimationStyle.WebkitTransition = 'none';
                pauseAnimationStyle.MozTransition = 'none';
                pauseAnimationStyle.msTransition = 'none';
                pauseAnimationStyle.transition = 'none';
                return pauseAnimationStyle;
            }
            return style;
        }

        setDragNode(node) {
            if (!node) return
            this.domNode = node
            this.domNode.addEventListener('mousedown', this.onDrag);
            this.domNode.addEventListener('touchstart', this.onDrag);
            this.domNode.setAttribute('data-key', this.props.item[this.props.keyProp]);
        }

        componentWillUnmount() {
            if (this.domNode) {
                this.domNode.removeEventListener('mousedown', this.onDrag);
                this.domNode.removeEventListener('touchstart', this.onDrag);
            }
        }

        render() {
            //console.log('rendering Base Display Object:',this.props)
            return (
                <div style={this.getStyle()}>
                    <DisplayObject
                        item={this.props.item}
                        index={this.props.index}
                        itemsLength={this.props.itemsLength}
                        gridWidth={this.props.gridWidth}
                        gridHeight={this.props.gridHeight}
                        onResizeStop={this.onResizeStop.bind(this)}
                        zoom={this.props.zoom}
                        setDragNode={this.setDragNode.bind(this)}
                    />
                </div>
                );
        }
    //}
}
