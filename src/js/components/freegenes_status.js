
import {h} from 'preact';
import {Link} from 'react-router-dom';

import util from '../util.js';

const status = [
  'received',
  'synthesizing',
  'sequencing',
  'cloning',
  'shipping'
];

module.exports = function(Component) {

  return class FreegenesStatus extends Component {

    

    constructor(props) {
      super(props);

      this.state = {
        status: 0
      };
    }

    componentWillReceiveProps(nextProps) {

    }

    componentDidMount() {

    }

	  render() {

      return (
        <div>
          
        </div>
      )
    }
  }
}


