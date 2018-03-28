import {h, render, createElement} from 'preact'
import { mount } from 'enzyme';
import chai from 'chai';
import { expect } from 'chai';
import 'regenerator-runtime/runtime';
import assertJsx, { options } from 'preact-jsx-chai';


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
        "user": "user1",
        "time": 1522104639
      },
      "updated": {
        "user": "user1",
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
        "user": "user2",
        "time": 1496958878
      },
      "updated": {
        "user": "user2",
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
        "user": "user1",
        "time": 1522105695
      },
      "updated": {
        "user": "user1",
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
        "user": "user2",
        "time": 1498081465
      },
      "updated": {
        "user": "user2",
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
        "user": "user1",
        "time": 1522105676
      },
      "updated": {
        "user": "user1",
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
        "user": "user2",
        "time": 1496958878
      },
      "updated": {
        "user": "user2",
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
        "user": "user1",
        "time": 1522104919
      },
      "updated": {
        "user": "user1",
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
        "user": "user2",
        "time": 1496958878
      },
      "updated": {
        "user": "user2",
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
        "user": "user1",
        "time": 1522104975
      },
      "updated": {
        "user": "user1",
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
        "user": "user2",
        "time": 1496958833
      },
      "updated": {
        "user": "user2",
        "time": 1501870460
      },
      "parent_x": 1,
      "parent_y": 1,
      "labelImagePath": "/home/bionet/bionet/user_static/labels/p-c9c05149-8b62-49da-aab7-3eb27ae12e0c.png"
    }
  }
]

describe('Favorites', () => {
    var Favorites = require('../../../src/js/components/inventory/favorites')(global.Component);
    it('should render html', () => {
        const wrapper = mount(<Favorites/>);
        const html=wrapper.html()
        //console.log(html)
        expect(html.length).to.be.above(0)
    })
    it('should render 1 nav.panel element', () => {
        const wrapper = mount(<Favorites/>);
        expect(wrapper.find('nav.panel')).to.have.length(1);
    });
    it('should render 1 p.panel-heading element', () => {
        const wrapper = mount(<Favorites type="primary"/>);
        expect(wrapper.find('p.panel-heading').length).to.equal(1);
    });
    it('should render 6 a.panel-block elements', () => {
        const wrapper = mount(<Favorites favorites={favorites}/>);
        expect(wrapper.find('a.panel-block')).to.have.length(6);
    });
    /*
    it('should support event onClick', () => {
        let test = false;
        const wrapper = mount(<Favorites onClick={() => test = true}/>);
        wrapper.simulate('click');
        expect(test).to.equal(true);
    })
    */
});
