
import {h} from 'preact';
import {Link} from 'react-router-dom';

import util from '../util.js';

const status = [
  'received',
  'optimizing',
  'synthesizing',
  'sequencing',
  'cloning',
  'shipping',
  'failed'
];

const statusDesc = [
  "The DNA synthesis request has been received by the FreeGenes project",
  "The submitted DNA sequence is being optimized for synthesis and cloning",
  "The DNA is currently being synthesized",
  "The synthesized DNA is currently being sequenced",
  "The synthesized and sequence-verified DNA is being cloned into a plasmid",
  "The synthesized DNA is currently being shipped",
  "The DNA synthesis or cloning failed after multiple attempts. Contact the FreeGenes project for more info."
];

module.exports = function(Component) {

  return class FreegenesStatus extends Component {

    constructor(props) {
      super(props);

      this.state = {
        status: 3
      };
    }

    componentWillReceiveProps(nextProps) {

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
        state += " done";
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
            <div class={this.getLabelClass(3)}>Sequencing</div>
          </div>
          <div>
            <div class={this.getClass(4)}></div>
            <div class={this.getLabelClass(4)}>Cloning</div>
          </div>
          <div>
            <div class={this.getClass(5)}></div>
            <div class={this.getLabelClass(5)}>Shipping</div>
          </div>

          <div>
          
            <p>This biomaterial was submitted to the FreeGenes project for synthesis. {statusDesc[this.state.status]}.</p>
          </div>
        </div>
      )
    }
  }
}


