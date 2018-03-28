import chai from 'chai';
import { expect } from 'chai';
import 'regenerator-runtime/runtime';
import assertJsx, { options } from 'preact-jsx-chai';

module.exports = class ComponentTestUtils  {
    noHtml(wrapper) {
        const html=wrapper.html()
        const length = (!html || html.length===0) ? 0 : html.length
        expect(length).to.equal(0)
    }
    hasHtml(wrapper) {
        const html=wrapper.html()
        expect(html.length).to.be.above(0)
    }
}
