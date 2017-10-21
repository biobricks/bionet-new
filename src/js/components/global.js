
import {h} from 'preact'

module.exports = function(Component) {

  return class Global extends Component {

	  render() {
      return <div>
        {this.props.children}
      </div>
	  }
  }
}
