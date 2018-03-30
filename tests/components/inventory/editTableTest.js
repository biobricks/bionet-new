import {h, render, createElement} from 'preact'
import { mount } from 'enzyme';
import chai from 'chai';
import { expect } from 'chai';
import 'regenerator-runtime/runtime';
import assertJsx, { options } from 'preact-jsx-chai';
import ComponentTestUtils from '../componentTestUtils'
import InventoryUtils from './inventoryUtils'
const componentTestUtils = new ComponentTestUtils()

describe('EditTable', () => {

    const EditTable = require('../../../src/js/components/inventory/editTable')(global.Component);
    const itemData_5x4rack = require('./data/itemData_5x4rack.json')
    
    const inventoryUtils = new InventoryUtils()
    inventoryUtils.initialize()
    
    /*
        props for component EditTable:
            item
            items
            height
            <EditTable item={currentItem} items={childItems} height={tableHeight} />
    */
    
    it('should render html', () => {
        const wrapper = mount(<EditTable item={itemData_5x4rack}/>);
        componentTestUtils.hasHtml(wrapper)
    })
    it('should render 1 div.empty-table element', () => {
        const wrapper = mount(<EditTable item={itemData_5x4rack}/>);
        expect(wrapper.find('div.empty-table').length).to.equal(1);
    })
    it('should render 2 div.tabular-row elements', () => {
        const wrapper = mount(<EditTable item={itemData_5x4rack} items={itemData_5x4rack.children}/>);
        expect(wrapper.find('div.tabular-row').length).to.equal(2);
    });
    it('should render 1 input value="tb31_a" element', () => {
        const wrapper = mount(<EditTable item={itemData_5x4rack} items={itemData_5x4rack.children}/>);
        expect(wrapper.find('input[value="tb31_a"]').length).to.equal(1);
        expect(wrapper.find('div[value="tb31_a"]').length).to.equal(0);
    });
    it('should render 1 input value="tb45" element', () => {
        const wrapper = mount(<EditTable item={itemData_5x4rack} items={itemData_5x4rack.children}/>);
        expect(wrapper.find('input[value="tb45"]').length).to.equal(1);
        expect(wrapper.find('div[value="tb45"]').length).to.equal(0);
    });
});
