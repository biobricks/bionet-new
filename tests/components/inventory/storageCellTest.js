import {h, render, createElement} from 'preact'
import { mount } from 'enzyme';
import chai from 'chai';
import { expect } from 'chai';
import 'regenerator-runtime/runtime';
import assertJsx, { options } from 'preact-jsx-chai';
const componentTestUtils = new ComponentTestUtils()

describe('StorageCell', () => {

    const StorageCell = require('../../../src/js/components/inventory/storageCell')(global.Component);
    const itemData9x9Box = require('./data/itemData_9x9box.json')
    /*
        props for component StorageCell:
            label
            name
            childType
            width
            height
            occupied
            item
            parent_id
            parent_x
            parent_y
            active
            mode "edit" or undefined
            var storageCell = <StorageCell state={"cell_"+label+"_parent_"+thisModule.dbid} label={label} ref={ref} name={name} childType={childType} width={dx} height={dy} occupied={isOccupied} item={cell} parent_id={thisModule.dbid} parent_x={x} parent_y={y} active={isActive} mode={mode}/>
            <StorageCell state="cell_1" label="2,3" name="tb22" childType={null} width=100 height=110 occupied="false" item={itemData9x9Box} parent_id="p-parent" parent_x="2" parent_y="3" active="false" mode={null}/>
            
                const classNameActive = (this.state.active) ? 'is-active-cell' : ''
                const classNameOccupied = (this.state.occupied) ? 'is-occupied-cell' : ''
    */
    
    it('should render html', () => {
        const wrapper = mount(<StorageCell/>);
        componentTestUtils.hasHtml(wrapper)
    })
    it('should render 1 div.tooltip element', () => {
        const wrapper = mount(
            <StorageCell state="cell_1" label="2,3" name="tb22" childType={null} width="100" height="110" occupied={false} item={itemData9x9Box} parent_id="p-parent"  parent_x="2" parent_y="3" active={false} mode={null}/>
        );
        expect(wrapper.find('div.tooltip').length).to.equal(1);
    });
    it('should render empty unselected cell', () => {
        const wrapper = mount(
            <StorageCell state="cell_1" label="2,3" name="tb22" childType={null} width="100" height="110" occupied={false} item={itemData9x9Box} parent_id="p-parent"  parent_x="2" parent_y="3" active={false} mode={null}/>
        );
        expect(wrapper.find('div.is-empty-cell').length).to.equal(1);
        expect(wrapper.find('div.is-active-cell').length).to.equal(0);
        expect(wrapper.find('div.is-occupied-cell').length).to.equal(0);
    });
    it('should render selected cell', () => {
        const wrapper = mount(
            <StorageCell state="cell_1" label="2,3" name="tb22" childType={null} width="100" height="110" occupied={false} item={itemData9x9Box} parent_id="p-parent"  parent_x="2" parent_y="3" active={true} mode={null}/>
        );
        expect(wrapper.find('div.is-empty-cell').length).to.equal(0);
        expect(wrapper.find('div.is-active-cell').length).to.equal(1);
        expect(wrapper.find('div.is-occupied-cell').length).to.equal(0);
    });
    it('should render occupied unselected cell', () => {
        const wrapper = mount(
            <StorageCell state="cell_1" label="2,3" name="tb22" childType={null} width="100" height="110" occupied={true} item={itemData9x9Box} parent_id="p-parent"  parent_x="2" parent_y="3" active={false} mode={null}/>
        );
        expect(wrapper.find('div.is-empty-cell').length).to.equal(0);
        expect(wrapper.find('div.is-active-cell').length).to.equal(0);
        expect(wrapper.find('div.is-occupied-cell').length).to.equal(1);
    });
});
