
//var clone = require('clone');
import {diff} from 'deep-object-diff'

var app = {};
var state = {};

Object.defineProperty(app, 'state', {
  get: function() {
    
  },
  set: function() {
    
  },
  enumerable: true,
  configurable: true
});



function setState(newState) {
  if(!newState) return;

  var d = diff(state, newState);

  
  
}


function changeState(newState) {
  if(newState) {
    state = newState;
  }
  
}



function subscribe() {

}

module.exports = {
  state: state,
  setState: setState
};

/*
var state = {};
var subscribers

function setState(newState) {
  if(newState) {
    state = newState;
  }

  // TODO how to set state 
}

module.exports = {
  state: state,
  setState: setState
};

*/
