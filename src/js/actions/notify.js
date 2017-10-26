
var Noty = require('noty');

/*
possible types are:
alert, success, warning, error, info/information
possible themes are: relax, mint, metroui

css classes are e.g: .noty_theme__mint.noty_type__warning 

TODO make a theme using bulma $colors
and in this js remap types to same types are used in bulma $colors
*/

module.exports = function(msg, type, timeout) {
  if(typeof timeout !== 'number') timeout = 5000;
  new Noty({
    text: msg,
    theme: 'mint',
    type: type || 'warning', 
    timeout: timeout
  }).show();
}
