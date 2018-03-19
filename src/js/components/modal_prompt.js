import {
    h
}
from 'preact'
import linkState from 'linkstate';

module.exports = function (Component) {
    return class ModalPrompt extends Component {
        constructor(props) {
            super(props);
            app.actions.prompt.reset()
        }
        
        close(e)
        {
            e.preventDefault();
            if (this.state.callback) this.state.callback(false)
            app.actions.prompt.reset()
        }
        
        accept(e) {
            e.preventDefault();
            if (this.state.callback) this.state.callback(true)
            app.actions.prompt.reset()
        }
        
        render() {
            if (!this.state.active) return
            var controls = null
            if (this.state.showControls) {
                controls=(
                    <div class="control" style="margin-left:20px; margin-bottom:20px;">
                        <input type="button" class="button is-link" value="Ok" onclick={this.accept.bind(this)}/>
                        <span style="margin-right:20px;">&nbsp;</span>
                        <input type="submit" class="button is-link" value="Cancel" />
                    </div>
                )
            }
            console.log('modal prompt render, props:',this.props, this.state)
            const active = (this.state.active) ? 'is-active' : ''
            return(
            <div class={"modal "+active}>
              <div class="modal-background" onsubmit={this.close.bind(this)}></div>
                  <div class="modal-content" style="background-color:#ffffff;width:calc(100vw - 5%);">
                    <form onsubmit={this.close.bind(this)}>
                        <section class="hero is-info ">
                          <div class="hero-body">
                            <div class="container">
                              <h1 class="title">{this.state.message}</h1>
                            </div>
                          </div>
                        </section>
                        <div class=" post-hero-area">
                            <div style="padding:20px;">
                                {this.state.component}
                            </div>
                            {controls}
                        </div>
                    </form>
                <button class="modal-close" aria-label="close" onclick={this.close.bind(this)}></button>
                 </div>
            </div>
            )
        }
    }
}
