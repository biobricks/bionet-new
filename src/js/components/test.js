import {h} from 'preact';
import {Link} from 'react-router-dom';

module.exports = function(Component) {

  return class Test extends Component {
	  render() {
      return (
        <div>
          Test
        </div>
      )
    }
  }
}
