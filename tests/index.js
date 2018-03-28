import {h, render, createElement, Component as PreactComponent} from 'preact'
import ashnazg from 'ashnazg'
import validator from '../src/js/validator.js'
import { mount, configure } from 'enzyme';
import { expect } from 'chai';
import 'regenerator-runtime/runtime';
import chai from 'chai';
import assertJsx, { options } from 'preact-jsx-chai';

var Adapter = require('./preact-adapter.js')
configure({ adapter: new Adapter() });
chai.use(assertJsx);
global.sleep = ms => new Promise( resolve => setTimeout(resolve, ms) );
global.Component = validator(ashnazg.extend(PreactComponent))

require('./components')
