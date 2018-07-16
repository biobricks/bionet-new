import { h } from 'preact';
import ashnazg from 'ashnazg';
import { Link } from 'react-router-dom';

module.exports = function(Component) {

  return class Test extends Component {
    
    constructor(props) {
      super(props);
      this.initialized = false;
      app.actions.inventory.initialize();
      this.state = {
        types: {},
        inventoryPath: null
      };
      ashnazg.listen('global.user', this.loggedInUser.bind(this));
    }

    loggedInUser(loggedInUser) {
      //console.log('logged in inventory: user', loggedInUser, app.remote, this.initialized)
      if (!loggedInUser) { return }
      this.initialized = true;
      app.actions.inventory.getInventoryTypes();
      app.actions.inventory.getFavorites();
      app.actions.inventory.getWorkbenchContainer();
      const id = (this.props.match) ? this.props.match.params.id : null;
      this.getInventoryPath(id);
    }

    getInventoryPath(id) {
      if (id) {
        app.actions.inventory.getInventoryPath(id, (err, inventoryPath) => {
          //console.log('getInventoryPath2, id:',id)
          if (err) {
            this.setState({
              id: id,
              inventoryPath: err
            });
            return
          }
          this.setState({
            id: id,
            inventoryPath: inventoryPath
          });
        });
      } else {
        app.actions.inventory.getRootItem((err, rootId) => {
          if (err) {
            console.log('getRootItem, error:',err);
            this.setState({
              id: rootId,
              inventoryPath: err
            });
            return
          } else {
            //console.log('inventory.actions.getInventoryPath root, id:',id)
            app.actions.inventory.getInventoryPath(rootId, (err, inventoryPath) => {
              if (err) {
                app.actions.notify(err.message, 'error');
                this.setState({
                  id: rootId,
                  inventoryPath: err
                });
                return
              }
              //console.log('getInventoryPath3, rootid:',rootId, thisModule.state, thisModule.props, inventoryPath)
              this.setState({
                id: rootId,
                inventoryPath: inventoryPath
              });
            });
          }
        });
      }
    }

    componentWillReceiveProps(props) {
      if (!props.inventoryPath) return
      //if (!props.inventoryPath || props.id===this.state.id) return
      const currentItem = app.actions.inventory.getItemFromInventoryPath(props.id)
      //if (this.state.newMode===NEW_MODE_PHYSICAL_STEP2) this.toggleEditMode()
      this.setState({
          id: props.id,
          currentItem:currentItem,
          inventoryPath: props.inventoryPath
      });
  }

    render() {
      const currentUser = app.state.global.user ? app.state.global.user.userData : null;
      const selectedObject = this.state.inventoryPath ? this.state.inventoryPath[0] : null;
      return (
        <div class="Test">
          <div class="columns">
            <div class="column">
              <div class="stringify">
                <h3>State</h3>
                <pre class="mt-1">
                  {JSON.stringify(this.state, null, 2)}
                </pre>
              </div>
            </div>
            <div class="column">
            <div class="stringify">
                <h3>Selected Object</h3>
                <pre class="mt-1">
                  {selectedObject && (
                    <div>{JSON.stringify(selectedObject, null, 2)}</div>
                  )}  
                </pre>
              </div>
              <div class="stringify">
                <h3>Current User</h3>
                <pre class="mt-1">
                  {currentUser && (
                    <div>{JSON.stringify(app.state.global.user.userData, null, 2)}</div>
                  )}  
                </pre>
              </div>
              <div class="stringify mt-2">
                <h3>Props</h3>
                <pre class="mt-1">
                  {JSON.stringify(this.props, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        </div>
      )
    }

  }
}