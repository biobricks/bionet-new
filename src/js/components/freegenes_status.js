
import {h} from 'preact';
import {Link} from 'react-router-dom';

import util from '../util.js';

/*

 * received
 * optimized but waiting for user verification
 * synthesizing
 * synthesis complete but not cloning yet (ready to clone) <- merge with cloning
 * cloning
 * sequencing
 * ready_to_ship

 staged to be built but not cloning: 

 they will add 
 click it to get a sorted by date-time event log
 add attempts label "attempt 2"
 it can fail during: synthesis, cloning and sequencing
 swap cloning and sequencing
 clarify who it's shipping to

*/

const status = [
  'received',
  'optimizing',
  'synthesizing',
  'cloning',
  'sequencing',
  'shipping'
];

const statusDesc = [
  "The DNA synthesis request has been received by the FreeGenes project",
  "The submitted DNA sequence is being optimized for synthesis and cloning",
  "The DNA is currently being synthesized",
  "The synthesized and sequence-verified DNA is being cloned into a plasmid",
  "The synthesized DNA is currently being sequenced",
  "The synthesized DNA is currently being shipped",
  "The DNA synthesis or cloning failed after multiple attempts. Contact the FreeGenes project for more info."
];


function getStatusIndex(val) {
  var i;
  if(typeof val === 'object') {

    for(i=0; i < status.length; i++) {
      if(status[i] === val.status) {
        return {
          status: i,
          error: val.error
        }
      }
    }
    return 0;
  }


  for(i=0; i < status.length; i++) {
    if(status[i] === val) return {
      status: i
    }
  }
  return 0;
}

module.exports = function(Component) {

  return class FreegenesStatus extends Component {

    constructor(props) {
      super(props);

      var s = getStatusIndex(props.status);

      this.state = {
        status: s.status,
        error: s.error
      };
    }

    componentWillReceiveProps(nextProps) {

      var s = getStatusIndex(nextProps.status);

      this.setState({
        status: s.status,
        error: s.error
      });     
 
    }

    componentDidMount() {

    }

/*
    getLabel(iconNumber) {
      var txt = status[iconNumber];
      return txt.slice[0, 1].toUpperCase() + txt.slice(1);
    }
*/

    getClass(iconNumber) {
      var state = "icon ";

      state += status[iconNumber];

      if(this.state.status > iconNumber) {
        state += " doing";
      } else if(this.state.status == iconNumber) {
        if(this.state.error) {
          state += " error";
        } else {
          state += " done";
        }
      }
      if(iconNumber >= status.length - 1) {
        state += " last";
      }
      return state;
    }

    getLabelClass(iconNumber) {
      if(this.state.status == iconNumber) {
        return "label current";
      }
      return "label";
    }

    getStatusDesc() {
      if(this.state.error) return this.state.error;
      return statusDesc[this.state.status];
    }

	  render() {

      return (
        <div class="status-symbol">

          <div>
            <div class={this.getClass(1)}></div>
            <div class={this.getLabelClass(1)}>Optimizing</div>
          </div>
          <div>
            <div class={this.getClass(2)}></div>
            <div class={this.getLabelClass(2)}>Synthesizing</div>
          </div>
          <div>
            <div class={this.getClass(3)}></div>
            <div class={this.getLabelClass(3)}>Cloning</div>
          </div>
          <div>
            <div class={this.getClass(4)}></div>
            <div class={this.getLabelClass(4)}>Sequencing</div>
          </div>
          <div>
            <div class={this.getClass(5)}></div>
            <div class={this.getLabelClass(5)}>Ready</div>
          </div>

          <div>
          
            <p>This biomaterial was submitted to the FreeGenes project for synthesis. {this.getStatusDesc()}.</p>
          </div>
        </div>
      )
    }
  }
}


