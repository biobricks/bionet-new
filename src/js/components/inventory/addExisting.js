import {h} from 'preact'
import linkState from 'linkstate';
import ashnazg from 'ashnazg'



module.exports = function (Component) {
    
  // component for adding an instance of an existing virtual
  return class AddExisting extends Component {
    constructor(props) {
      super(props);
      
      this.state = {
        results: [],
        result: undefined,
        instances: undefined
      };
    }
    
    componentWillReceiveProps(nextProps) {

      
    }

    AutoComplete(props) {
          return (
            <li onClick={function(){this.selectResult(props.index)}.bind(this)}>
              <article class="media">
                <figure class="media-left">
                  <p class="image is-64x64"></p>
                </figure>
                <p>
                  <strong>{props.title}</strong>
                  <br />
                  {props.description}
                </p>
              </article>
            </li>
          );
        }
    
    selectResult(i) {
      var result = this.state.results[i]
      this.setState({
        query: result.name,
        result: result,
        results: []
      });
      document.getElementById('autocomplete').focus();
    }

    submit(e) {
      e.preventDefault();
      if(!this.state.result || !this.state.result.id) {
        app.actions.notify("No or invalid virtual selected", "error");
        return;
      }

      const virtual= this.state.result;

      // TODO this is basically a copy-paste from editVirtual.js
      //      we should share this code
      const subdivisions = this.props.parent.subdivisions;
      const emptyCellArray = app.actions.inventory.getEmptyCellArray(subdivisions);

      var self = this;
      app.actions.inventory.generatePhysicals(virtual.id, virtual.name, this.state.instances, this.props.parent.id, emptyCellArray, function(err, physicals) {
        if(err) {
          app.actions.notify(err.message, 'error');
          return
        }
        
        app.actions.inventory.forceRefresh(self.props.parent.id)

        app.changeState({
          prompt: {
            component: undefined,
            active: false
          }
        });
/*
        const children = self.props.parent.children
        const mergedPhysicals = (children && children.length && children.length > 0) ? physicals.concat(children) : physicals

        self.setState({
          mergedPhysicals: mergedPhysicals,
          physicals: physicals,
          assignCells: true
        })
*/
      })
    }

    cancel(e) {
      app.changeState({
        prompt: {
          component: undefined,
          active: false
        }
      });
    }

    changeInstances(e) {
      e.preventDefault();

      this.setState({
        instances: parseInt(e.target.value) || undefined
      });
    }

    autocomplete(e) {
      e.preventDefault();
      var q = e.target.value.trim();
      this.setState({
        query: q,
        results: [],
        result: undefined
      });
      if(!q) {
        return;
      }
      const s = app.actions.search.exact(q, 1, 5);
      s.on('data', function(data) {
        this.setState({
          results: this.state.results.concat([data.value])
        });
      }.bind(this));
    }
      
    render() {

      var choices = [];
      var i, cur;
      for(i=0; i < this.state.results.length; i++) {
        cur = this.state.results[i];
        choices.push(this.AutoComplete({
          index: i,
          title: cur.name,
          description: cur.description}));
      }
          return (
            <div class="autocomplete-container">
              <form onSubmit={this.submit.bind(this)}>
              <label class="label">Virtual</label>
              <div class="autocomplete-input">
                <div class="control has-icons-right">
                  <input id="autocomplete" class="input" placeholder="Find the virtual you want to instantiate" onInput={this.autocomplete.bind(this)} value={this.state.query} autofocus />
                  <span class="icon is-small is-right">
                    <i class="fa fa-angle-down"></i>
                  </span>
                </div>
                <ul class="autocomplete-list">
                  {choices}
                </ul>
              </div>
              <div class="field">
                <label class="label">Number of instances</label>
                <div class="control">
                  <input class="input" type="text" placeholder="How many instances to create, e.g: 3" onInput={this.changeInstances.bind(this)} value={this.state.instances || 0} />
                </div>
              </div>
              <div class="field is-grouped">
                <div class="control">
                  <input type="submit" class="button is-link" value="Create" disabled={!(this.state.result && this.state.instances)} />
                </div>
                <div class="control">
                  <button class="button is-text" onclick={this.cancel.bind(this)}>Cancel</button>
                </div>
              </div>
              </form>
            </div>
          );
        }
  }
}
