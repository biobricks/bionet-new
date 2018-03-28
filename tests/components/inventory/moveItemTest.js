import {h, render, createElement} from 'preact'
import { mount } from 'enzyme';
import chai from 'chai';
import { expect } from 'chai';
import 'regenerator-runtime/runtime';
import assertJsx, { options } from 'preact-jsx-chai';
import ComponentTestUtils from '../componentTestUtils'
const componentTestUtils = new ComponentTestUtils()

describe('MoveItem', () => {

    const MoveItem = require('../../../src/js/components/inventory/moveItem')(global.Component);
    const itemData9x9Box = require('./data/itemData_9x9box.json')
    
    /*
        props for component MoveItem:
            item
    */
    
    it('should not render html', () => {
        const wrapper = mount(<MoveItem/>);
        componentTestUtils.noHtml(wrapper)
    })
    it('should render html', () => {
        const wrapper = mount(<MoveItem item={itemData9x9Box}/>);
        componentTestUtils.hasHtml(wrapper)
    })
    it('should render 1 a.navbar-item element', () => {
        const wrapper = mount(
            <MoveItem item={itemData9x9Box} />
        );
        expect(wrapper.find('a.navbar-item').length).to.equal(1);
    });
});
