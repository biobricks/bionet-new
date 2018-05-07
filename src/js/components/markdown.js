import {
    h
}
from 'preact'
import SimpleMDE from 'simplemde'

module.exports = function (Component) {

    return class Markdown extends Component {
        constructor(props) {
            super(props);
        }
        
        componentWillReceiveProps(nextProps) {
            if (this.simplemde) {
                if(!this.simplemde.value().trim()) {
                  this.simplemde.value(nextProps.content);
                }
                this.changeContent()
            }
            this.setState({
                rows:this.props.rows || 3
            })
        }
        
        changeContent() {
            this.setState({
                changed: true,
                content: this.simplemde.value()
            });
        }
        
        checkRestored() {
        }
        
        cancel(e) {
            this.simplemde.clearAutosavedValue();
        }
        
        componentDidMount() {
            if(!this.simplemde) {
                var opts = {
                    element: document.getElementById(this.props.id),
                    autoDownloadFontAwesome: false,
                    autosave: {
                        enabled: true,
                        uniqueId: 'virtual_editor_'+this.props.id,
                        delay: 10000
                    },
                    spellChecker: false,
                    hideIcons: ['image'],
                    indentWithTabs: false
                };

                if(this.props.hideToolbar) {
                    opts.toolbar = false;
                }
                this.simplemde = new SimpleMDE(opts);
                this.checkRestored();
                this.simplemde.codemirror.on('change', this.changeContent.bind(this));
            }
        }

        resizeTextarea(e) {
        }
        
        render() {
            return (
                <div class="editor-container">
                    <textarea id={this.props.id} class="input description" rows={this.state.rows} onChange={this.resizeTextarea.bind(this)} value={this.state.content}></textarea>
                </div>
            )
        }
    }
}