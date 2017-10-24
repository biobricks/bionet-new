import {h, render, createElement, Component as PreactComponent} from 'preact'
import ashnazg from 'ashnazg'

var app = {};
window.app = app;
app.actions = require('./actions/index');

const Component = ashnazg(PreactComponent)
var App = require('./components/app.js')(Component)
var rpc = require('./rpc.js');

function renderAll() {
  var container = document.getElementById('container');

  render(<App/>, container);
}

function bulmaInit() {
 // Get all "navbar-burger" elements
  var $navbarBurgers = Array.prototype.slice.call(document.querySelectorAll('.navbar-burger'), 0);

  // Check if there are any navbar burgers
  if ($navbarBurgers.length > 0) {

    // Add a click event on each of them
    $navbarBurgers.forEach(function ($el) {
      $el.addEventListener('click', function () {

        // Get the target from the "data-target" attribute
        var target = $el.dataset.target;
        var $target = document.getElementById(target);

        // Toggle the class on both the "navbar-burger" and the "navbar-menu"
        $el.classList.toggle('is-active');
        $target.classList.toggle('is-active');

      });
    });
  }
}


function init() {

  renderAll();
  bulmaInit();

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



