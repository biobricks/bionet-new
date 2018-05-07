import {h} from 'preact';
import {Redirect} from 'react-router';
import util from '../util.js';


module.exports = function(Component) {

  return class Help extends Component {
   
    constructor(props) {
      super(props);

      this.state = {
        error: undefined,
        url: undefined
      };
      this.doRedirect(props.match.params.humanID);
    };

    componentWillReceiveProps(nextProps) {
      
      this.doRedirect(nextProps.match.params.humanID);
    }

    error(err) {
      this.setState({
        error: err.message
      });
    }

    doRedirect(humanID) {
      var self = this;
      if(!parseInt(humanID)) {
        self.error(new Error("Missing material ID"));
        return;
      }

      util.whenConnected(function() {
        console.log("humanID:", humanID);

        app.actions.material.getByHumanID(humanID, function(err, m) {
          if(err) return self.error(new Error("Material not found"));

          self.setState({
            url: '/inventory/'+m.id
          });
        });
      });
    }
    
	  render() {
      if(this.state.error) {
        return (
            <h1>{this.state.error}</h1>
        );
      }

      if(this.state.url) {
        return (
          <Redirect to={this.state.url}/>
        );
      }

      return '';
    }
  }
}
