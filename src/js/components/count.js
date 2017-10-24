
import {h} from 'preact'

module.exports = function(Component) {

  return class Count extends Component {

    constructor(props) {
      super(props);

      this.setState({
        number: 1000
      });
    }
    
    increment() {
      this.setState({
        number: this.state.number + 1
      });
    }

	  render() {
    return <div>
        <span> Count: { this.state.number }</span>
        <div>
        <button onclick={this.increment.bind(this)}>Increment</button>
        </div>
        </div>
	  }
  }
}
