

import {h, render, Component, createElement} from 'preact'
import Clock from './clock.js'
import app from './app.js'


function renderAll() {
  var container = document.getElementById('container');
  var replace;
  if(container.children.length) {
    replace = container.children[0];
  }
  app.state.lol = 'wut'


//  render(<Clock state />, container, replace);

  render(<Clock state="myclock" />, container, replace);

  render(<Clock state="foo[]" />, container, replace);
  render(<Clock state="foo[]" />, container, replace);
  render(<Clock state="foo[]" />, container, replace);
  render(<Clock state="[]" />, container, replace);
  render(<Clock state="[]" />, container, replace);
  render(<Clock state="[]" />, container, replace);

}


// hot module reloading
if(module.hot) {
  module.hot.accept();
}

renderAll();



