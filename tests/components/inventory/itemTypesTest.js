import {h, render, createElement} from 'preact'
import { mount } from 'enzyme';
import chai from 'chai';
import { expect } from 'chai';
import 'regenerator-runtime/runtime';
import assertJsx, { options } from 'preact-jsx-chai';
import ComponentTestUtils from '../componentTestUtils'
const componentTestUtils = new ComponentTestUtils()

const bioTypes = [
  {
    "name": "organism",
    "title": "Organism",
    "virtual": true,
    "fields": {
      "Description": "text",
      "Provenance": "text",
      "Terms": "text",
      "Genotype": "text",
      "Sequence": "text"
    },
    "url": "/create-virtual/organism"
  },
  {
    "name": "vector",
    "title": "Vector",
    "virtual": true,
    "fields": {
      "Description": "text",
      "Provenance": "text",
      "Terms": "text",
      "Sequence": "text"
    },
    "url": "/create-virtual/vector"
  },
  {
    "name": "oligo",
    "title": "Oligo",
    "virtual": true,
    "fields": {
      "Description": "text",
      "Provenance": "text",
      "Terms": "text",
      "Sequence": "text"
    },
    "url": "/create-virtual/oligo"
  },
  {
    "name": "double-stranded",
    "title": "Double-Stranded",
    "virtual": true,
    "fields": {
      "Description": "text",
      "Provenance": "text",
      "Terms": "text",
      "Sequence": "text"
    },
    "url": "/create-virtual/double-stranded"
  },
  {
    "name": "chemical stock",
    "title": "Chemical Stock",
    "virtual": true,
    "fields": {
      "Description": "text"
    },
    "url": "/create-virtual/chemical%20stock"
  }
]
const physicalTypes = [
  {
    "name": "lab",
    "title": "Lab",
    "xUnits": 1,
    "yUnits": 6,
    "fields": {
      "Description": "text"
    },
    "url": "/create-physical/lab"
  },
  {
    "name": "benches",
    "title": "Benches",
    "xUnits": 8,
    "yUnits": 8,
    "fields": {
      "Description": "text"
    },
    "url": "/create-physical/benches"
  },
  {
    "name": "bench",
    "title": "Bench",
    "xUnits": 8,
    "yUnits": 8,
    "fields": {
      "Description": "text"
    },
    "url": "/create-physical/bench"
  },
  {
    "name": "-80 freezer",
    "title": "-80 Freezer",
    "xUnits": 1,
    "yUnits": 5,
    "fields": {
      "Description": "text"
    },
    "url": "/create-physical/-80%20freezer"
  },
  {
    "name": "-20 freezer",
    "title": "-20 Freezer",
    "xUnits": 1,
    "yUnits": 5,
    "fields": {
      "Description": "text"
    },
    "url": "/create-physical/-20%20freezer"
  },
  {
    "name": "-4 fridge",
    "title": "4 Fridge",
    "xUnits": 1,
    "yUnits": 5,
    "fields": {
      "Description": "text"
    },
    "url": "/create-physical/-4%20fridge"
  },
  {
    "name": "freezer rack",
    "title": "Rack",
    "xUnits": 5,
    "yUnits": 4,
    "fields": {
      "Description": "text"
    },
    "url": "/create-physical/freezer%20rack"
  },
  {
    "name": "8 x 12 freezer box",
    "title": "8x12 Box",
    "xUnits": 12,
    "yUnits": 8,
    "fields": {
      "Description": "text"
    },
    "url": "/create-physical/8%20x%2012%20freezer%20box"
  },
  {
    "name": "9 x 9 freezer box",
    "title": "9x9 Box",
    "xUnits": 9,
    "yUnits": 9,
    "fields": {
      "Description": "text"
    },
    "url": "/create-physical/9%20x%209%20freezer%20box"
  },
  {
    "name": "freezer box",
    "title": "Box",
    "fields": {
      "Description": "text"
    },
    "url": "/create-physical/freezer%20box"
  },
  {
    "name": "shelving unit",
    "title": "Shelving Unit",
    "xUnits": 1,
    "yUnits": 5,
    "fields": {
      "Description": "text"
    },
    "url": "/create-physical/shelving%20unit"
  },
  {
    "name": "shelf",
    "title": "Shelf",
    "xUnits": 4,
    "yUnits": 1,
    "fields": {
      "Description": "text"
    },
    "url": "/create-physical/shelf"
  },
  {
    "name": "cabinet",
    "title": "Cabinet",
    "xUnits": 1,
    "yUnits": 5,
    "fields": {
      "Description": "text"
    },
    "url": "/create-physical/cabinet"
  },
  {
    "name": "drawer",
    "title": "Drawer",
    "fields": {
      "Description": "text"
    },
    "url": "/create-physical/drawer"
  },
  {
    "name": "bin",
    "title": "Bin",
    "fields": {
      "Description": "text"
    },
    "url": "/create-physical/bin"
  }
]

describe('ItemTypes', () => {

    var ItemTypes = require('../../../src/js/components/inventory/itemTypes')(global.Component);
    
    /*
        props for component ItemTypes:
            type - current selected type
            types - array of possible types
            fid - unique html id
            setType - callback function when type is set
            classProps - css classes
    */
    
    it('should not render html', () => {
        const wrapper = mount(<ItemTypes/>);
        componentTestUtils.noHtml(wrapper)
    })
    it('should render html', () => {
        const wrapper = mount(<ItemTypes types={physicalTypes}/>);
        componentTestUtils.hasHtml(wrapper)
    })
    it('should render 1 div.dropdown element', () => {
        const wrapper = mount(<ItemTypes types={physicalTypes}/>);
        expect(wrapper.find('div.dropdown').length).to.equal(1);
    });
    it('should render 15 div.dropdown-item elements', () => {
        const wrapper = mount(<ItemTypes fid="physicalTypes" type="box" types={physicalTypes}/>);
        //const html=wrapper.html()
        //console.log(html)
        expect(wrapper.find('div.dropdown-item').length).to.equal(15);
    });
    it('should render 5 div.dropdown-item elements', () => {
        const wrapper = mount(<ItemTypes fid="physicalTypes" type="box" types={bioTypes}/>);
        expect(wrapper.find('div.dropdown-item').length).to.equal(5);
    });
    it('should have selected item = box', () => {
        const wrapper = mount(<ItemTypes fid="physicalTypes" type="freezer box" types={physicalTypes}/>);
        expect(wrapper.find('div.is-active')).to.have.length(1);
    });
});
