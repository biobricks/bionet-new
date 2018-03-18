
import {h} from 'preact';
import {Link} from 'react-router-dom';

module.exports = function(Component) {

  return class Footer extends Component {

    constructor(props) {
      super(props);

      this.state = {

      };
    }

	  render() {

      return (
        <div class="footer">
          <a href="https://bionet.io/">The bionet</a> is a project of <a href="https://biobricks.org/">The BioBricks Foundation</a>.See here for <Link to="/attributions">source code, copyright and attributions</Link>
        </div>
      )
    }
  }
}


