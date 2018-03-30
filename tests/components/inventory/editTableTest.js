import {h, render, createElement} from 'preact'
import { mount } from 'enzyme';
import chai from 'chai';
import { expect } from 'chai';
import 'regenerator-runtime/runtime';
import assertJsx, { options } from 'preact-jsx-chai';
import ComponentTestUtils from '../componentTestUtils'
import InventoryUtils from './inventoryUtils'
const componentTestUtils = new ComponentTestUtils()
import sinon from 'sinon'

describe('EditTable', () => {

    const EditTable = require('../../../src/js/components/inventory/editTable')(Component);
    const EditPhysical = require('../../../src/js/components/inventory/editPhysical')(Component);
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
    /*
    it('should render 2 id=name elements', () => {
        const wrapper = mount(<EditTable item={itemData_5x4rack} items={itemData_5x4rack.children}/>);
        expect(wrapper.find('#name').length).to.equal(2);
        //const html = wrapper.html()
        // todo: investigate why the following returns 0 results
        //expect(wrapper.find('div.tabular-row').length,html).to.equal(2);
        //expect(wrapper.find('form').length).to.equal(2);
    });
    */
    it('should render 1 input value="tb31_a" element', () => {
        const wrapper = mount(<EditTable item={itemData_5x4rack} items={itemData_5x4rack.children}/>);
        expect(wrapper.find('input[value="tb31_a"]').length).to.equal(1);
        expect(wrapper.find('div[value="tb31_a"]').length).to.equal(0);
    });
    it('should render 1 tb45_a_name id and 1 tb45_name id', () => {
        const wrapper = mount(<EditTable item={itemData_5x4rack} items={itemData_5x4rack.children}/>);
        expect(wrapper.find('#tb31_a_name').length).to.equal(1);
        expect(wrapper.find('#tb45_name').length).to.equal(1);
    });
    it('should call componentWillMount once', () => {
        sinon.spy(EditTable.prototype, 'componentWillMount');    
        const wrapper = mount(<EditTable item={itemData_5x4rack} items={itemData_5x4rack.children}/>);
        expect(EditTable.prototype.componentWillMount.callCount,'window.editPhysical:'+window.editPhysical).to.equal(1);
    });
    it('should contain input element with id tb31_a_name and is able to set focus', () => {
        const wrapper = mount(<EditTable item={itemData_5x4rack} items={itemData_5x4rack.children}/>);
        const html = wrapper.html()
        const testContainer = document.getElementById('test_container');
        testContainer.innerHTML = html
        const nameInput = document.getElementById('tb31_a_name');
        const result = (nameInput && nameInput.focus) ? 1 : -1
        expect(result,'input element not found focus input item:'+nameInput+' window.editPhysical:'+window.editPhysical).to.equal(1);
        nameInput.focus()
        const isFocused = (nameInput === document.activeElement) ? 1 : -1
        expect(isFocused,' input element is not focused'+window.editPhysical).to.equal(1);
    });
});
