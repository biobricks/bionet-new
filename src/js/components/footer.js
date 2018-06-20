
import {h} from 'preact';
import {Link} from 'react-router-dom';

module.exports = function(Component) {

  return class Footer extends Component {

	  render() {

      return (
        <div class="Footer has-text-light has-text-centered is-size-7">
          <a href="https://bionet.io/">The bionet</a> is a project of <a href="https://biobricks.org/">The BioBricks Foundation</a>.See here for <Link to="/attributions">source code, copyright and attributions</Link>
        </div>
      )
    }
  }
}


