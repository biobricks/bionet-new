
import {h} from 'preact';
import linkState from 'linkstate';
import {Link} from 'react-router-dom';
import xtend from 'xtend';
import strftime from 'strftime';

import util from '../util.js';


module.exports = function(Component) {

  return class Virtual extends Component {

    constructor(props) {
      super(props);

    }

	  render() {

      return (
        <div class="request-material">
            <section class="hero is-info ">
              <div class="hero-body">
                <div class="container">
                  <h1 class="title">
                    Request sent!
                  </h1>
                </div>
              </div>
            </section>
            <div class="description">
              <p>Your request has been successfully sent to the individuals responsible for request-fulfillment for the <span>{app.settings.lab}</span> bionet node.</p>
            </div>
        </div>
      )
    }
  }
}


