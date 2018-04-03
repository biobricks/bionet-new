import {h, render, createElement, Component as PreactComponent} from 'preact'
import { mount, configure } from 'enzyme';
import { expect } from 'chai';
import 'regenerator-runtime/runtime';
import chai from 'chai';
import assertJsx, { options } from 'preact-jsx-chai';
import sinon from 'sinon';

var Adapter = require('./preact-adapter.js')
configure({ adapter: new Adapter() });
chai.use(assertJsx);
global.sleep = ms => new Promise( resolve => setTimeout(resolve, ms) );

import validator from '../src/js/validator.js'
import ashnazg from 'ashnazg'
global.Component = validator(ashnazg.extend(PreactComponent))

global.app = {}
app.actions = require('../src/js/actions/index');
app.rpc = require('../src/js/rpc.js');
app.settings = require('../settings.client.js');
app.state={}
//var App = require('../src/js/components/app.js')(Component)

require('./components')
