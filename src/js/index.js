import {h, render, createElement, Component as PreactComponent} from 'preact'
import ashnazg from 'ashnazg'

var app = {};
window.app = app;
app.actions = require('./actions/index');

const Component = ashnazg(PreactComponent)
var Count = require('./count.js')(Component)
var rpc = require('./rpc.js');

function renderAll() {
  var container = document.getElementById('container');

  render(<Count state="bob.myclock" />, container);
  render(<Count state="yourclock" />, container);
  render(<Count state="foo[]" />, container);
  render(<Count state="foo[]" />, container);
  render(<Count state="foo[]" />, container);
  render(<Count state="[]" />, container);
  render(<Count state="[]" />, container);
  render(<Count state="[]" />, container);

}

window.saveState = function() {
  var btn = document.getElementById('save-button');
  btn.style.backgroundColor = '';  

  var newState;
  try {
    newState = JSON.parse(document.getElementById('app-state').value);
    app.setState(newState);
    document.getElementById('app-state').value = JSON.stringify(app.state, 2);
  } catch(e) {
    console.error(e);
    btn.style.backgroundColor = 'red';
  }
  
}

window.changeState = function() {
  var btn = document.getElementById('change-button');
  btn.style.backgroundColor = '';  

  var stateChange;
  try {
    stateChange = JSON.parse(document.getElementById('app-state-change').value);
    app.changeState(stateChange);
    document.getElementById('app-state').value = JSON.stringify(app.state, 2);
  } catch(e) {
    console.error(e);
    btn.style.backgroundColor = 'red';
  }
  
}


function init() {

  renderAll();

  // connect to the server and attempt to log in
  console.log("CONNECTING TO RPC");

  rpc.connect(function(err, remote, user) {
    if(err) {
      console.error("Connection attempt failed. Will continue trying.");
      return;
    }
    
    app.remote = remote;

    if(user) {
      console.log("Logged in as: ", user);
    } else {
      console.log("Not logged in");
    }

  });
}

// hot module reloading
if(module.hot) {
  module.hot.accept();
}

init();



