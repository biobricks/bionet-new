
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
        id: this.props.match.params.id,
        virtual: undefined,
        name: undefined,
        notice: undefined,
        changed: false,
        error: null
      };

      util.whenConnected(function() {
        if(!this.state.id) return;

        this.getVirtual(this.state.id);
      }.bind(this));
    }

    changeName(e) {
      if(!e || !e.target) return;
      this.setState({
        name: e.target.value
      });
    }

    changeDesc() {
      this.setState({
        changed: true,
        description: this.simplemde.value()
      });
    }
    
    checkRestored() {
      var editorDesc = this.simplemde.value() || '';
      var dataDesc = (this.state.virtual) ? (this.state.virtual.Description || '') : '';
      
      if(this.state.virtual && editorDesc && editorDesc.trim() !== dataDesc.trim()) {
                    
        this.setState({
          changed: true,
          notice: "Restored unsaved local changes. Click cancel to discard."
        });
      } else {
        this.setState({
          changed: false,
          notice: undefined
        });
      }
    }
    
    getVirtual(id, force, cb) {

      app.remote.get(id, function(err, data) {

        if(err || !data) {
          this.setState({
            error: "Virtual item not found"
          });
          console.error(err);
          if(cb) cb(err);
          return;
        }

        var o = {
          virtual: data,
          name: data.name,
          description: data.Description
        };

        if(!this.simplemde.value().trim() || force) {
          this.simplemde.value(data.Description);
        }

        this.setState(o);
        this.checkRestored();

        if(cb) cb(null, data);
      }.bind(this));
    }

    save(e) {
      e.preventDefault();

      if(!this.state.virtual) {
        app.actions.notify("Nothing to save.", 'error');
        return;
      }
      var o = xtend(this.state.virtual, {
        name: this.state.name,
        Description: this.state.description
      });

      app.remote.saveVirtual(o, function(err) {
        if(err) {
          app.actions.notify("Error: Could not save", 'error');
          console.error(err);
          return;
        }
        app.actions.notify("Save complete!");
        this.setState({
          notice: undefined,
          changed: false
        });
      }.bind(this));
    }

    cancel(e) {
      e.preventDefault();
      if(!this.state.changed) return;

      var choice = confirm("You have unsaved changes. Really throw these away?");
      if(!choice) return;
      

      this.simplemde.clearAutosavedValue();

      this.getVirtual(this.state.id, true, function(err, data) {
        if(err) return;

        this.simplemde.value(data.Description || '');
        this.setState({
          notice: undefined,
          changed: false
        })
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
            uniqueId: 'virtual_editor_'+this.state.id,
            delay: 10000
          },
          spellChecker: false,
          hideIcons: ['image'],
          indentWithTabs: false
        });

        this.checkRestored();

        this.simplemde.codemirror.on('change', this.changeDesc.bind(this));

//        this.listen('virtual.Description', function(newDesc) {
//          this.simplemde.value(newDesc);
//        }.bind(this));
      }
    }

	  render() {

      return (
        <div>
          <form onSubmit={this.save.bind(this)}>
            <div class="field">
              <label class="label">Name</label>
              <div class="control">
                <input class='input' type="text" onInput={this.changeName.bind(this)} value={this.state.name} />
              </div>
            </div>
            <div class="editor-container field">
              <label class="label">Description</label>
              <p class="help is-danger">{this.state.notice}</p>
              <textarea id="editor"></textarea>
            </div>
            <div class="field is-grouped">
              <div class="control">
                <input type="submit" class="button is-link" value="Save" disabled={!this.state.changed} />
              </div>
              <div class="control">
                <button class="button is-text" onClick={this.cancel.bind(this)} disabled={!this.state.changed}>Cancel</button>
                </div>
            </div>
          </form>

        </div>
      )
    }
  }
}


