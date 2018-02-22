
import {h} from 'preact';
import linkState from 'linkstate';
import {Link} from 'react-router-dom';
import xtend from 'xtend';
import util from '../util.js';
import SimpleMDE from 'simplemde'

/*
  ToDo:

  * list associated physicals (and link to them with /inventory/:id)
  * make a "request biomaterial" button
*/

module.exports = function(Component) {

  return class Virtual extends Component {

    constructor(props) {
      super(props);

      this.queryID = 0;

      this.state = {
        id: undefined,
        virtual: undefined,
        error: null
      };
    }

    getVirtual(id) {

      app.remote.get(function(err, data) {
        if(err) {
          this.setState({
            error: "Virtual item not found"
          });
          return;
        }
        
        this.setState({
          virtual: data.value
        });
        
      }.bind(this));
    }

    componentWillReceiveProps(nextProps) {

      this.setState({
        id: nextProps.match.params.id,
        error: null
      });

      util.whenConnected(function() {
        this.getVirtual(this.state.id);
      }.bind(this));
    }


    componentDidMount() {
      if(!this.simplemde) {
        this.simplemde = new SimpleMDE({ 
          element: document.getElementById('editor'),
          autoDownloadFontAwesome: false,
          autosave: {
            enabled: true,
            uniqueid: 'virtual_editor'
          },
          spellChecker: false,
          hideIcons: ['image'],
          indentWithTabs: false
        });
      }
    }

	  render() {

/*
      if(this.state.error) {
        return (
          <div>
            {this.state.error}
          </div>
        )
      }
*/
      return (
        <div>
          Virtual: 
          <pre>{JSON.stringify(this.state.virtual, null, 2)}</pre>
          <textarea id="editor"></textarea>
        </div>
      )
    }
  }
}


