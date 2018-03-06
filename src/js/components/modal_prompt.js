import {
    h
}
from 'preact'
import linkState from 'linkstate';

module.exports = function (Component) {
    return class ModalPrompt extends Component {
        constructor(props) {
            super(props);
            this.state = {
                active:false,
                message:''
            };
            this.display = this.display.bind(this)
        }
        
        display(state) {
            this.setState({active:state})
        }
        
        close(e)
        {
            e.preventDefault();
            this.display(false)
            app.actions.prompt.reset()
            if (this.cb) this.cb(false)
        }
        
        accept(e) {
            e.preventDefault();
            this.display(false)
            app.actions.prompt.reset()
            app.actions.prompt.callback(e)
            if (this.cb) this.cb(true)
        }
        
        componentWillReceiveProps(nextProps) {
            //console.log('prompt:',nextProps)
            if (!nextProps.prompt) return
            this.state.message = nextProps.prompt.message
            this.cb = nextProps.prompt.cb
            this.display(true)
        }
        
        render() {
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
                                {app.actions.prompt.render()}
                            </div>
                            <div class="control" style="margin-left:20px; margin-bottom:20px;">
                                <input type="button" class="button is-link" value="Ok" onclick={this.accept.bind(this)}/>
                                <span style="margin-right:20px;">&nbsp;</span>
                                <input type="submit" class="button is-link" value="Cancel" />
                            </div>
                        </div>
                    </form>
                <button class="modal-close" aria-label="close" onclick={this.close.bind(this)}></button>
                 </div>
            </div>
            )
        }
    }
}
