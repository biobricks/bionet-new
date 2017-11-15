
// NOTE: This is shared between client and server so no ES6 allowed

var emailValidator = require("email-validator");
var zxcvbn = require('zxcvbn');

function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

/*
  Setting a validation to a string means error
  Setting a validation to false means it passed
  Setting to an an array means passed with a notice of the stated severity, e.g:
    ["Password is not very strong but ok", 'warning']
  Severities are the bulma colors, e.g:
   'is-danger', 'is-warning', 'is-success', 'is-info'
*/

module.exports = {
  signup: function(o, lostFocus, opts) {
    var opts = opts || {};
    var validation = {};

    // username
    if(o.username) {
      if(o.username.length < 2) {
        validation.username = "Your username must be at least two characters long";
      } else if(o.username.trim().match(/\s+/)) {
        validation.username = "Your username must not contain any spaces";
      } else if(o.username.match('@')) {
        validation.username = "Your username must not contain a @ symbol";
      } else {
        validation.username = false; // no validation issues
      }
    } else {
      if(lostFocus) {
        validation.username = "Username is required";
      }
    }

    // email
    if(o.email) {
      if(!emailValidator.validate(o.email)) {
        validation.email = "This is not a valid email address";
      } else {
        validation.email = false; // no validation issues
      }
    } else {
      if(lostFocus) {
        validation.email = "Email address is required";
      }
    }

    // password
    if(o.password) {
      var score = zxcvbn(o.password).score;
      if(score < 2) {
        validation.password = "Your password isn't quite strong enough. Try adding numbers, upper-case letters or other symbols.";
      } else if(score < 3) {
        validation.password = ["Your password is a bit weak but acceptable", 'warning'];
      } else if(score >= 4) {
        validation.password = ["Your password is very strong", 'success'];
      } else {
        validation.password = false; // no validation issues
      }
    } else {
      if(lostFocus) {
        validation.password = "Password is required";
      }
    }
     // master password
    if(o.masterPassword) {
      validation.masterPassword = false; // do not validate
    } else {
      if(lostFocus) {
        validation.masterPassword = "Master password is required";
      }
    }

    o.validation = validation;
    return o;
  },

  serverCheck(o, f, humanReadable) {    
    f(o, true, {server: true});

    var errors = {};
    var v = o.validation;
    var key;
    for(key in v) {
      if(v[key] && !(v[key] instanceof Array)) {
        errors[key] = v[key];
      }
    }
    if(Object.keys(errors).length) {
      if(!humanReadable) return errors;
      var human = [];
      for(key in errors) {
        // human.push(capitalize(key) + ': ' + capitalize(errors[key]));
        human.push(capitalize(errors[key]));
      }
      return human.join("\n");
    }
    return false;
  }
}
