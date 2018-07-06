
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

      this.state = {
        requestID: this.props.match.params.id,
      };
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
            <div>
              <p style="font-weight:bold">Your request has been submitted.</p>

              <p>You can use <Link to={'/request-show/'+this.state.requestID}>this link</Link> to check the status of your request.</p>
          
            </div>
            <div style="float:left;clear:both"></div>
        </div>
      )
    }
  }
}


