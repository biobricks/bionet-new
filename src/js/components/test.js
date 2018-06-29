import { h } from 'preact';
import { Link } from 'react-router-dom';
import fakeLabData from '../fake_lab';

module.exports = function(Component) {

  return class Test extends Component {
	  render() {
      return (
        <nav class="breadcrumb is-capitalized" aria-label="breadcrumbs">
          <ul>
            <li>
              <Link to="/ui/lab">
                Lab
              </Link>
            </li>            
          </ul>  
        </nav>
      )
    }
  }
}
