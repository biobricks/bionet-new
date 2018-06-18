import {h} from 'preact';
import linkState from 'linkstate';
import merge from 'deepmerge';
import {Link} from 'react-router-dom';


module.exports = function(Component) {

  return class Test extends Component {
	  render() {
      return (
        <div class="help">
          This is a test
        </div>
      )
    }
  }
}
