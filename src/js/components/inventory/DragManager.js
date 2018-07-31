'use strict';

export default class DragManager {

    dragItem;
    initialMouseX;
    initialMouseY;
    initialEventX;
    initialEventY;
    dragX;
    dragY;
    keyProp;

    constructor(moveFn, dragStartFn, dragEndFn, dragMoveFn, keyProp, gridId) {
        this.dragMove = this.dragMove.bind(this);
        this.endDrag = this.endDrag.bind(this);
        this.moveFn = moveFn;
        this.dragStartFn = dragStartFn;
        this.dragEndFn = dragEndFn;
        this.dragMoveFn = dragMoveFn;
        this.keyProp = keyProp;
        this.isDrag=false
        this.gridId=gridId
    }

    dragMove(e) {
        const tolerance = 3;
        const isTouch = e.touches && e.touches.length;
        const pageX = isTouch ? e.touches[0].pageX : e.pageX;
        const pageY = isTouch ? e.touches[0].pageY : e.pageY;

        const xMovement = Math.abs(this.initialEventX - pageX);
        const yMovement = Math.abs(this.initialEventY - pageY);

        if (xMovement > tolerance || yMovement > tolerance) {
            this.isDrag=true
            const clientX = isTouch ? e.touches[0].clientX : e.clientX;
            const clientY = isTouch ? e.touches[0].clientY : e.clientY;

            this.dragX = clientX - this.initialMouseX;
            this.dragY = clientY - this.initialMouseY;
            this.clientX = this.dragX
            this.clientY = this.dragY
            this.update(this.dragX, this.dragY);

            let targetKey;
            let targetElement = document.elementFromPoint(clientX, clientY);
            while (targetElement.parentNode) {
                if (targetElement.getAttribute('data-key')) {
                    targetKey = targetElement.getAttribute('data-key');
                    break;
                }
                targetElement = targetElement.parentNode;
            }

            if (targetKey && targetKey !== this.dragItem[this.keyProp]) {
                this.moveFn(this.dragItem[this.keyProp], targetKey, this.dragX, this.dragY);
            }

            e.stopPropagation();
            e.preventDefault();
        }

        this.dragMoveFn(e);
    }

    //endDrag(item) {
    endDrag(item) {
        const dragItem=(this.dragItem) ? this.dragItem : item
        var selectedDomElementAr = document.getElementsByClassName('selectedDisplayObject');
        var selectedDomElement = selectedDomElementAr[0]
        console.log('Drag Manager, endDrag:',dragItem, selectedDomElement)
        if (dragItem) {
            var top = this.clientX
            var left = this.clientY
            if (selectedDomElement) {
                var rect = selectedDomElement.getBoundingClientRect();
                top = rect.top
                left = rect.left
            }
            this.dragEndFn(dragItem[this.keyProp], this.clientX, this.clientY, this.isDrag, top, left)
        }
        this.dragItem = null;
        this.isDrag=false
        if (this.update && typeof this.update === 'function') {
            this.update(null, null);
        }
        this.update = null;
        document.removeEventListener('mousemove', this.dragMove);
        document.removeEventListener('mouseup', this.endDrag);
        document.removeEventListener('touchmove', this.dragMove);
        document.removeEventListener('touchend', this.endDrag);
        document.removeEventListener('touchcancel', this.endDrag);
    }

    startDrag(e, domNode, item, fnUpdate) {
        const isTouch = e.targetTouches && e.targetTouches.length === 1;
        if (e.button === 0 || isTouch) {
            const rect = domNode.getBoundingClientRect();

            this.update = fnUpdate;
            this.dragItem = item;
            const id = item[this.keyProp]
            console.log('workbench startDrag:',id)
            this.dragStartFn(e,id);
            const pageX = isTouch ? e.targetTouches[0].pageX : e.pageX;
            const pageY = isTouch ? e.targetTouches[0].pageY : e.pageY;

            this.initialMouseX = Math.trunc(pageX - (rect.left + window.pageXOffset));
            this.initialMouseY = Math.trunc(pageY - (rect.top + window.pageYOffset));
            this.initialEventX = pageX;
            this.initialEventY = pageY;
            
            document.addEventListener('mousemove', this.dragMove);
            document.addEventListener('mouseup', this.endDrag);
            document.addEventListener('touchmove', this.dragMove);
            document.addEventListener('touchend', this.endDrag);
            document.addEventListener('touchcancel', this.endDrag);

            //This is needed to stop text selection in most browsers
            e.preventDefault();
        }

    }

    getStyle(x, y) {
        const dragStyle = {};
        const transform = `translate3d(${x}px, ${y}px, 0)`;
        //Makes positioning simpler if we're fixed
        dragStyle.position = 'fixed';
        dragStyle.zIndex = 1000;
        //Required for Fixed positioning
        dragStyle.left = 0;
        dragStyle.top = 0;
        dragStyle.WebkitTransform = transform;
        dragStyle.MozTransform = transform;
        dragStyle.msTransform = transform;
        dragStyle.transform = transform;

        //Turn off animations for this item
        dragStyle.WebkitTransition = 'none';
        dragStyle.MozTransition = 'none';
        dragStyle.msTransition = 'none';
        dragStyle.transition = 'none';

        //Allows mouseover to work
        dragStyle.pointerEvents = 'none';

        return dragStyle;
    }
}
