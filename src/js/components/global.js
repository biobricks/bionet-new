
import {h} from 'preact';
//import {Redirect} from 'react-router';
import {withRouter} from 'react-router';
import merge from 'deepmerge';

function clone(obj) {
  return merge({}, obj);
}

module.exports = function(Component) {
  
  // withRouter causes this.props.history to exist for this component
  return withRouter(class Global extends Component {
    
	  render() {

      // react-router is insane and doesn't expose a global route() function
      // and this is the shitty workaround
      if(this.state.route) {
        var route = this.state.route;
        this.changeState({route: undefined});
        this.props.history.push(route);
      };
      
      return <div>
        {this.props.children}
      </div>;
	  }
  })
}
