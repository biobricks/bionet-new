import { h } from 'preact';
import ashnazg from 'ashnazg';
import { Redirect } from 'react-router-dom';

module.exports = function(Component) {

  const DataPanel = require('./DataPanel.js')(Component);
  const MapPanel = require('./MapPanel.js')(Component);

  return class LabInventory extends Component {
    
    constructor(props) {
      super(props);
      this.initialized = false;
      app.actions.inventory.initialize();
      this.state = {
        inventoryPath: [],
        selectedRecord: {},
        editMode: false,
        newMode: false,
        formType: "",
        hoveredRecord: {}
      };
      //console.log(app.actions.inventory);
      //ashnazg.listen('global.user', this.loggedInUser.bind(this));
      this.toggleEditMode = this.toggleEditMode.bind(this);
      this.toggleNewMode = this.toggleNewMode.bind(this);
      this.getInventoryPath = this.getInventoryPath.bind(this);
      this.setFormType = this.setFormType.bind(this);
      this.setHoveredRecord = this.setHoveredRecord.bind(this);
      this.getSelectedRecord = this.getSelectedRecord.bind(this);
    }

    toggleEditMode() {
      //console.log('toggle edit mode fired');
      this.setState({
        editMode: !this.state.editMode
      });
      //console.log(this.state);
    }

    toggleNewMode() {
      //console.log('toggle new mode fired');
      this.setState({
        editMode: false,
        newMode: !this.state.newMode
      });
      //console.log(this.state);
    }    

    getInventoryPath(id, callback) {
          /* 
            There is a short lag between the componentDidMount() lifecycle method and
            the initialization of app.actions.
            A 10ms delay in script execution makes calls to app.actions available. 
          */ 
      setTimeout(() => {      
        if (id) {
          //console.log('getInventoryPath: Has ID - Getting Inventory Path');
          app.actions.inventory.getInventoryPath(id, (error, inventoryPath) => {
            if(error !== null){ 
              callback(error, null); 
            } else {
              callback(null, inventoryPath);
            }
          });
        } else {
          //console.log('getInventoryPath: Has No ID - Getting Root ID...');
          app.actions.inventory.getRootItem((error, rootId) => {
            if(error) { 
              console.log(error);
            } else {
              //console.log(`getInventoryPath: Root ID is ${rootId} - Getting Inventory Path`);
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
      }, 10);
    }

    setFormType(e) {
      let formType = e.target.value;
      console.log(`Form type switched to ${formType}`);
      this.setState({
        formType
      });
    }

    setHoveredRecord(hoveredRecordId) {
      //console.log(`setHoveredRecord fired for id: ${hoveredRecordId}`);
      if(hoveredRecordId !== null){
        this.getInventoryPath(hoveredRecordId, (error, inventoryPath) => {
          if(error){ 
            console.log(error);
          } else {
            let hoveredRecord = inventoryPath[inventoryPath.length - 1];
            //console.log(hoveredRecord);
            this.setState({ hoveredRecord });
          }
        });
      } else {
        this.setState({
          hoveredRecord: null
        });
      }
    }

    getSelectedRecord(){
      const idParam = this.props.match.params.id ? this.props.match.params.id : null;       
      if(idParam && idParam !== this.state.selectedRecord.id){
        //console.log('getSelectedRecord fired');
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
              selectedRecord,
              hoveredRecord: null
            });
          }
        });
      } else if (!idParam && Object.keys(this.state.selectedRecord).length === 0 && this.state.inventoryPath.length === 0) {
        //console.log('getSelectedRecord fired');
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
              selectedRecord,
              hoveredRecord: null
            });
          }
        });        
      }       
    }
    
    componentDidUpdate() {
      //console.log('componentDidUpdate fired');
      this.getSelectedRecord();
 
    }

    componentDidMount() {
      //console.log('componentDidMount fired');
      this.getSelectedRecord();
    }

    render() {
      return (
        <div class="Inventory">
          <div class="columns is-desktop">
            <div class="column is-7-desktop">
              <DataPanel
                {...this.state}
                selectedRecord={this.state.selectedRecord}
                inventoryPath={this.state.inventoryPath}
                onClickLink={this.onClickLink}
                toggleNewMode={this.toggleNewMode}
                toggleEditMode={this.toggleEditMode}
                setFormType={this.setFormType}
                setHoveredRecord={this.setHoveredRecord}
              />
            </div>
            <div class="column is-5-desktop">
              <MapPanel
                {...this.state}
                selectedRecord={this.state.selectedRecord}
                setHoveredRecord={this.setHoveredRecord}
              />
            </div>
          </div>  
        </div>
      );
    }

  }

}