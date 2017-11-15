
import {h} from 'preact';
import {Redirect} from 'react-router';
import merge from 'deepmerge';

function clone(obj) {
  return merge({}, obj);
}

module.exports = function(Component) {
  
  return class Global extends Component {

    // TODO have ashnazg add this to the Component class
    changeState(stateChange) {
      var newState = merge(this.state, stateChange, {clone: true});
      this.setState(newState);
    }
    
	  render() {

      // react-router is insane and doesn't expose a global route() function
      // and this is the shitty workaround
      if(this.state.route) {
        var route = this.state.route;
        this.changeState({route: undefined});
        return <Redirect to={route} push={true} />;
      };
      
      return <div>
        {this.props.children}
      </div>;
	  }
  }
}
