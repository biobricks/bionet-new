import { configure } from 'enzyme';
var Adapter = require('./preact-adapter.js')
configure({ adapter: new Adapter() });

import React from 'react';
import ReactDOM from 'react-dom';
import { mount } from 'enzyme';
import { expect } from 'chai';

import {h, render, createElement, Component as PreactComponent} from 'preact'
import ashnazg from 'ashnazg'
import validator from '../src/js/validator.js'
const Component = validator(ashnazg.extend(PreactComponent))
var Favorites = require('../src/js/components/inventory/favorites')(Component);

import 'regenerator-runtime/runtime';
import chai from 'chai';
import assertJsx, { options } from 'preact-jsx-chai';

// when checking VDOM assertions, don't compare functions, just nodes and attributes:
options.functions = false;

// activate the JSX assertion extension:
chai.use(assertJsx);

global.sleep = ms => new Promise( resolve => setTimeout(resolve, ms) );

const favorites = 
[
  {
    "favorite": {
      "type": "_ref",
      "name": "_ref_697979a6-9801-4b04-a899-e17f74bda530",
      "parent_id": "p-e3d5fe69-65af-4499-9c37-8322f2b8ca24",
      "material_id": "p-154f1429-0dad-4a49-b88f-6199cd1f0c2b",
      "id": "p-6c2722bd-e755-4b1e-8d9d-5b5137ab3e4f",
      "created": {
        "user": "tsakach",
        "time": 1522104639
      },
      "updated": {
        "user": "tsakach",
        "time": 1522104639
      }
    },
    "material": {
      "name": "Rack 1.1",
      "parent_id": "p-c9c05149-8b62-49da-aab7-3eb27ae12e0c",
      "id": "p-154f1429-0dad-4a49-b88f-6199cd1f0c2b",
      "type": "freezer rack",
      "label": null,
      "created": {
        "user": "ccmeyer@stanford.edu",
        "time": 1496958878
      },
      "updated": {
        "user": "conarymeyer@gmail.com",
        "time": 1501869020
      },
      "parent_x": 1,
      "parent_y": 1
    }
  },
  {
    "favorite": {
      "type": "_ref",
      "name": "_ref_7b5d1e68-d7f5-4674-8953-281883eb8dc3",
      "parent_id": "p-e3d5fe69-65af-4499-9c37-8322f2b8ca24",
      "material_id": "p-8976478c-3532-4c51-820a-96b5a2411bfd",
      "id": "p-a11e3625-a6f2-459f-a753-32e5b24aee1e",
      "created": {
        "user": "tsakach",
        "time": 1522105695
      },
      "updated": {
        "user": "tsakach",
        "time": 1522105695
      }
    },
    "material": {
      "name": "KG_Test-Box",
      "parent_id": "p-154f1429-0dad-4a49-b88f-6199cd1f0c2b",
      "id": "p-8976478c-3532-4c51-820a-96b5a2411bfd",
      "type": "9 x 9 freezer box",
      "label": null,
      "created": {
        "user": "email@gmail.com",
        "time": 1498081465
      },
      "updated": {
        "user": "ccmeyer@stanford.edu",
        "time": 1498510296
      },
      "parent_x": 2,
      "parent_y": 2
    }
  },
  {
    "favorite": {
      "type": "_ref",
      "name": "_ref_aa359c33-bda9-49c1-864c-da383fd25419",
      "parent_id": "p-e3d5fe69-65af-4499-9c37-8322f2b8ca24",
      "material_id": "p-154f1429-0dad-4a49-b88f-6199cd1f0c2b",
      "id": "p-d0d234c0-eed6-4679-8892-206a2a478f79",
      "created": {
        "user": "tsakach",
        "time": 1522105676
      },
      "updated": {
        "user": "tsakach",
        "time": 1522105676
      }
    },
    "material": {
      "name": "Rack 1.1",
      "parent_id": "p-c9c05149-8b62-49da-aab7-3eb27ae12e0c",
      "id": "p-154f1429-0dad-4a49-b88f-6199cd1f0c2b",
      "type": "freezer rack",
      "label": null,
      "created": {
        "user": "ccmeyer@stanford.edu",
        "time": 1496958878
      },
      "updated": {
        "user": "conarymeyer@gmail.com",
        "time": 1501869020
      },
      "parent_x": 1,
      "parent_y": 1
    }
  },
  {
    "favorite": {
      "type": "_ref",
      "name": "_ref_c415ff66-43a7-4681-b6d1-994e6a79912e",
      "parent_id": "p-e3d5fe69-65af-4499-9c37-8322f2b8ca24",
      "material_id": "p-154f1429-0dad-4a49-b88f-6199cd1f0c2b",
      "id": "p-8e2cb8db-ecde-4daa-998e-28a5754ae4d1",
      "created": {
        "user": "tsakach",
        "time": 1522104919
      },
      "updated": {
        "user": "tsakach",
        "time": 1522104919
      }
    },
    "material": {
      "name": "Rack 1.1",
      "parent_id": "p-c9c05149-8b62-49da-aab7-3eb27ae12e0c",
      "id": "p-154f1429-0dad-4a49-b88f-6199cd1f0c2b",
      "type": "freezer rack",
      "label": null,
      "created": {
        "user": "ccmeyer@stanford.edu",
        "time": 1496958878
      },
      "updated": {
        "user": "conarymeyer@gmail.com",
        "time": 1501869020
      },
      "parent_x": 1,
      "parent_y": 1
    }
  },
  {
    "favorite": {
      "type": "_ref",
      "name": "_ref_e2c02f52-d668-4a81-bf02-ed61506bd6ff",
      "parent_id": "p-e3d5fe69-65af-4499-9c37-8322f2b8ca24",
      "material_id": "p-c9c05149-8b62-49da-aab7-3eb27ae12e0c",
      "id": "p-4e407430-14f2-4647-89dc-74f12a290731",
      "created": {
        "user": "tsakach",
        "time": 1522104975
      },
      "updated": {
        "user": "tsakach",
        "time": 1522104975
      }
    },
    "material": {
      "name": "Shelf 1 (Upper)",
      "parent_id": "p-1686a689-0f54-4044-9735-3c4e99ab7f0d",
      "id": "p-c9c05149-8b62-49da-aab7-3eb27ae12e0c",
      "type": "shelf",
      "label": null,
      "created": {
        "user": "ccmeyer@stanford.edu",
        "time": 1496958833
      },
      "updated": {
        "user": "endy@stanford.edu",
        "time": 1501870460
      },
      "parent_x": 1,
      "parent_y": 1,
      "labelImagePath": "/home/bionet/bionet/user_static/labels/p-c9c05149-8b62-49da-aab7-3eb27ae12e0c.png"
    }
  }
]

describe('Test', () => {
    describe('render', () => {
        const favorites={
            
        }
        it('should render', () => {
            const wrapper = mount(<Favorites favorites={favorites}/>);
            //console.log('*****html****'+wrapper.html())
            wrapper.debug()
            //process.stdout.write(wrapper.html())           
            expect(wrapper.find('nav')).to.have.length(1);
        });
        it('should render', () => {
            const wrapper = mount(<Favorites />);
            //expect(wrapper.find('.p.panel-heading')).to.have.length(1);
            expect(wrapper.find('p')).to.have.length(1);
        });
        it('should render type', () => {
            const wrapper = mount(<Favorites />);
            //wrapper.setProps({ 'favorites':favorites });
            expect(wrapper.find('a')).to.have.length(1);
        });
        it('should render type', () => {
            const wrapper = mount(<Favorites type="primary"/>);
            expect(wrapper.find('a.panel-block')).to.have.length(1);
        });
        it('should support event', () => {
            let test = false;
            const wrapper = mount(<Favorites onClick={() => test = true}/>);
            wrapper.simulate('click');
            expect(test).to.equal(true);
        })
    });
});