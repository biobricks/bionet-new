'use strict';

export default class LayoutManager {

    columns;
    horizontalMargin;
    verticalMargin;
    layoutWidth;
    itemHeight;
    itemWidth;
    rowHeight;

    constructor(options, width, height, gridWidth, gridHeight) {
        this.update(options, width, height, gridWidth, gridHeight);
    }

    update(options, width, height, gridWidth, gridHeight) {
        //Calculates layout
        this.layoutWidth = width;
        this.layoutHeight = height;
        //console.log('layout manager update:',width,height)
        this.zoom = options.zoom;
        this.itemWidth = Math.round(options.itemWidth * this.zoom);
        this.itemHeight = Math.round(options.itemHeight * this.zoom);
        this.gridWidth = gridWidth;
        this.gridHeight = gridHeight;
        this.columns = Math.floor(this.layoutWidth / this.itemWidth);
        //this.horizontalMargin = (this.columns === 1) ? 0 : Math.round(this.layoutWidth - (this.columns * this.itemWidth)) / (this.columns - 1);
        this.horizontalMargin = 0
        this.verticalMargin = (options.verticalMargin === -1) ? this.horizontalMargin : options.verticalMargin;
        this.rowHeight = this.itemHeight + this.verticalMargin;
    }

    getTotalHeight(filteredTotal) {
        return (Math.ceil(filteredTotal / this.columns) * this.rowHeight) - this.verticalMargin;
    }

    getRow(index) {
        return Math.floor(index / this.columns);
    }

    getColumn(index) {
        return index - (this.getRow(index) * this.columns);
    }

    getPosition(index, row, col) {
        const margin = this.horizontalMargin;
        const width = this.itemWidth;
        return {
            x: Math.round((col * this.gridWidth) + (col * margin)),
            y: Math.round((this.gridHeight + this.verticalMargin) * row)
        };
    }

    getTransform(index, row, col) {
        const position = this.getPosition(index, row, col);
        return 'translate3d(' + position.x + 'px, ' + position.y + 'px, 0)';
    }

    getStyle(index, row, col, animation, isFiltered) {

        const transform = this.getTransform(index, row, col);
        const style = {
            width: this.itemWidth + 'px',
            height: this.itemHeight + 'px',
            WebkitTransform: transform,
            MozTransform: transform,
            msTransform: transform,
            transform: transform,
            position: 'absolute',
            boxSizing: 'border-box',
            display: isFiltered ? 'none' : 'block'
        };

        if (animation) {
            style.WebkitTransition = '-webkit-' + animation;
            style.MozTransition = '-moz-' + animation;
            style.msTransition = 'ms-' + animation;
            style.transition = animation;
        }

        return style;
    }
}
