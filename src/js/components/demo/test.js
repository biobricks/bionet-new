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
        urlParams: {
          id: ''
        },
        inventoryPath: [],
        selectedRecord: {}
      };
      ashnazg.listen('global.user', this.loggedInUser.bind(this));
    }

    loggedInUser(loggedInUser) {
      console.log('logged in inventory: user', loggedInUser, app.remote, this.initialized)
      if (!loggedInUser) { return }
      this.initialized = true;
      app.actions.inventory.getInventoryTypes();
      app.actions.inventory.getFavorites();
      app.actions.inventory.getWorkbenchContainer();
      const id = (this.props.match) ? this.props.match.params.id : null;
      this.getInventoryPath(id);
    }

    getInventoryPath(id, callback) {
      if (id) {
        console.log('getInventoryPath: Has ID - Getting Inventory Path');
        app.actions.inventory.getInventoryPath(id, (error, inventoryPath) => {
          if(error !== null){ 
            callback(error, null); 
          } else {
            callback(null, inventoryPath);
          }
        });
      } else {
        console.log('getInventoryPath: Has No ID - Getting Root ID...');
        app.actions.inventory.getRootItem((error, rootId) => {
          if(error) { 
            console.log(error);
          } else {
            console.log(`getInventoryPath: Root ID is ${rootId} - Getting Inventory Path`);
            app.actions.inventory.getInventoryPath(rootId, (error, inventoryPath) => {
              if(error !== null){ 
                callback(error, null); 
              } else {
                callback(null, inventoryPath);
              }
            });
          }
        });        
      }
    }

    componentWillReceiveProps(props) {
      console.log('componentWillReceiveProps fired');
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

    componentDidUpdate() {
      //console.log('componentDidUpdate fired');
      //console.log(this.state);
      const idParam = this.props.match.params.id ? this.props.match.params.id : null;       
      if(idParam && idParam !== this.state.selectedRecord.id){
        this.getInventoryPath(idParam, (error, inventoryPath) => {
          let selectedRecord = this.state.selectedRecord;
          if(error){ 
            console.log(error);
          } else {
            selectedRecord = inventoryPath[inventoryPath.length - 1];
            console.group();
            console.log('Selected Record:');
            console.log(selectedRecord);
            console.groupEnd();
            this.setState({
              inventoryPath,
              selectedRecord
            });
          }
        });
      } else if (!idParam && this.state.inventoryPath.length === 0) {
        this.getInventoryPath(idParam, (error, inventoryPath) => {
          let selectedRecord = this.state.selectedRecord;
          if(error){ 
            console.log(error);
          } else {
            selectedRecord = inventoryPath[inventoryPath.length - 1];
            console.group();
            console.log('Selected Record:');
            console.log(selectedRecord);
            console.groupEnd();
            this.setState({
              inventoryPath,
              selectedRecord
            });
          }
        });        
      }
    }  

    componentDidMount() {
      console.log('componentDidMount fired');
    }

    render() {
      const currentUser = app.state.global.user ? app.state.global.user.userData : null;
      const selectedObject = this.state.inventoryPath ? this.state.inventoryPath[0] : null;
      return (
        <div class="Test">
          <div class="columns">
            <div class="column">
              {JSON.stringify(this.state.inventoryPath)}
            </div>
          </div>
        </div>
      )
    }

  }
}