
import {h} from 'preact';

module.exports = function(Component) {

  return class Loading extends Component {


	  render() {
      return (
          <h3>Loading...</h3>
      )
    }           


  }
}
