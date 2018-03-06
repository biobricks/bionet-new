
import {h} from 'preact';
import merge from 'deepmerge';

function clone(obj) {
  return merge({}, obj);
}

export default function(ClassToExtend) {
  if(!ClassToExtend) throw new Error("Missing or invalid arguments");
  
  return class Component extends ClassToExtend {

    constructor(props) {
      super(props);
      this.setState({
        validation: {}
      });
    }
    
    validateInputClass(propName) {
      if(!this.state.validation) return '';
      
      if(typeof this.state.validation[propName] !== 'undefined') {
        if(this.state.validation[propName] instanceof Array) {
          return 'is-'+this.state.validation[propName][1];
        }
        if(this.state.validation[propName] === false) return 'is-success';
        return 'is-danger';
      } else {
        return '';
      }
      
    }
    
    validateInputIcon(propName) {
      if(!this.state.validation) return '';
      if(typeof this.state.validation[propName] !== 'undefined') {
        if(this.state.validation[propName] === false) return 'fa-check';
        if(this.state.validation[propName] instanceof Array) {
          console.log("AAAAAAAAAAA", this.state.validation[propName][1]);
          if(this.state.validation[propName][1] === 'success') return 'fa-check';
          if(this.state.validation[propName][1] === 'warning') return '';
        }
        return 'fa-warning';
      } else {
        return '';
      }
    }

    validateInputNotice(propName, notice) {
      if(!this.state.validation) return '';
      if(typeof this.state.validation[propName] !== 'undefined') {
        if(this.state.validation[propName] === false)  return (
            <p class="help is-success">{notice || ''}</p>
        );;
//        console.log("AAA", propName, this.state.validation[propName]);
        var msg = this.state.validation[propName];
        var severity = 'danger';
        if(this.state.validation[propName] instanceof Array) {
          msg = this.state.validation[propName][0];
          severity = this.state.validation[propName][1];
        }
        var className = 'help is-'+severity;
        return (
            <p class={className}>{msg}</p>
        );
      } else {
        return (
            <p class="help">&#160;</p>
        )
      }
      
    }
    
    validator(stateProp, lostFocus) {
      lostFocus = (lostFocus) ? true : false;
      return function(e) {
        if(typeof this.validate !== 'function') return;
        var o = {};
        o[stateProp] = e.target.value;
        var newState = merge(this.state, o, {clone: true});
        this.setState(this.validate(newState, lostFocus));
      }.bind(this);
    }

    isValid() {
      if(typeof this.validate !== 'function') return;
      
      this.setState(this.validate(this.state, true));
      var v = this.state.validation;
      var key;
      for(key in v) {
        if(v[key] && !(v[key] instanceof Array)) {
          return false;
        }
      }
      return true;
    }
    
  }
}


