
import {h} from 'preact';
import linkState from 'linkstate';
import merge from 'deepmerge';
import {Link} from 'react-router-dom';

module.exports = function(Component) {

  return class HelpIndex extends Component {
   
    constructor(props) {
      super(props);
      this.state = {
        stage: 1
      };
      this.onIncrementStage = this.onIncrementStage.bind(this);
      this.onDecrementStage = this.onDecrementStage.bind(this);
    };
  
    onIncrementStage(e) {
      this.setState({
        stage: this.state.stage + 1
      });
    }

    onDecrementStage(e) {
      this.setState({
        stage: this.state.stage - 1
      });
    }

    render() {
      const stage = this.state.stage;
      return (
        <div class="Introduction">

          {(stage === 1) ? (
            <div class="columns is-desktop is-centered">
              <div class="column is-12 is-7-desktop">
                <div class="panel">
                  <div class="panel-heading has-text-centered">
                    <h3 class="mb-0">Welcome To The BioNet!</h3>
                  </div>
                  <div class="panel-block is-block has-text-centered pb-2">
                    <h2 class="mt-1">A Free Biological Inventory Management System And Browser</h2>
                    <p>
                      Keep track of your stuff, find what you need, and share as you like. The bionet supports true asynchronous, peer-peer inventory management and sharing — all your inventory information is controlled locally by you. You decide if others can see what you wish to share. All BioNet software and associated materials are free to use.
                    </p>
                    <h2 class="mt-1">How Does It Work?</h2>
                    <iframe width="100%" height="400" src="https://www.youtube.com/embed/t29-RGggSU8?ecver=1" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
                    <div class="buttons mt-1 is-centered">
                      <span class="button is-link">Exit Introduction</span>
                      <span 
                        class="button is-success"
                        onClick={this.onIncrementStage}
                      >Next</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : null }
    
          {(stage === 2) ? (
            <div class="columns is-desktop is-centered">
              <div class="column is-12 is-7-desktop">
                <div class="panel">
                  <div class="panel-heading">
                    <h3 class="mb-0">Step 1. New Lab Setup</h3>
                  </div>
                  <div class="panel-block is-block pb-2">
                    <h2 class="mt-1">Lab Dimensions</h2>
                    <p>
                      Everything on your new BioNet node is stored inside of a parent <span class="has-text-primary">Container</span> representing your <span class="has-text-link">Lab</span>. 
                    </p>
                    <div class="buttons mt-1 is-centered">
                    <span 
                        class="button is-secondary"
                        onClick={this.onDecrementStage}
                      >Previous</span>
                      <span class="button is-link">Exit Introduction</span>
                      <span 
                        class="button is-success"
                        onClick={this.onIncrementStage}
                      >Next</span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="column is-12 is-5-desktop">

              </div>
            </div>
          ) : null }

        </div>
      )
    }
  }
}
