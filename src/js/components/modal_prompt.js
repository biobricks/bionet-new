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
            //                  <div class="modal-content" style="background-color:#ffffff;padding:10px;width:calc(100vw - 50%);">

            const active = (this.state.active) ? 'is-active' : ''
            return(
            <div class={"modal "+active}>
              <div class="modal-background" onclick={this.close.bind(this)}></div>
                  <div class="modal-content" style="background-color:#ffffff;">
                    <form onsubmit={this.close.bind(this)}>
                        <section class="hero is-info ">
                          <div class="hero-body">
                            <div class="container">
                              <h1 class="title">{this.state.message}</h1>
                                <input type="button" class="button is-link" value="Ok" onclick={this.accept.bind(this)}/>
                                <span style="width:60px;">&nbsp;</span>
                                <input type="submit" class="button is-link" value="Cancel" />
                            </div>
                          </div>
                        </section>
                    </form>
                <button class="modal-close" aria-label="close" onclick={this.close.bind(this)}></button>
                 </div>
            </div>
            )
        }
    }
}
