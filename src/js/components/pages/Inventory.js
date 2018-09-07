import { h } from 'preact';
import ashnazg from 'ashnazg';
import { Redirect } from 'react-router-dom';
import util from '../../util.js';

module.exports = function (Component) {
  
  const LabPanel = require('../LabPanel')(Component);
  const ContainerPanel = require('../ContainerPanel')(Component);
  const PhysicalPanel = require('../PhysicalPanel')(Component);
  const VirtualPanel = require('../VirtualPanel')(Component);
  const MapPanel = require('../MapPanel')(Component);

  return class InventoryPage extends Component {

    constructor(props) {
      super(props);
      app.actions.inventory.initialize();
      this.state = {
        mapFullScreen: false,
        dataFullScreen: false,
        mode: 'view',
        error: {},
        alert: {
          type: '',
          message: ''
        },
        inventoryPath: [],
        selectedRecord: {},
        parentRecord: {},       
        hoveredRecordId: '',
        hoveredRecord: {},
        user: {},
        newItemName: '',
        newItemX: 0,
        newItemY: 0
      };
      ashnazg.listen('global.user', this.loggedInUser.bind(this));
      // Bindings
      this.loggedInUser = this.loggedInUser.bind(this);
      this.getInventoryPath = this.getInventoryPath.bind(this);
      this.handleSetMode = this.handleSetMode.bind(this);
      this.removeAlert = this.removeAlert.bind(this);
      this.toggleMapFullScreen = this.toggleMapFullScreen.bind(this);
      this.toggleDataFullScreen = this.toggleDataFullScreen.bind(this);
      this.moveItem = this.moveItem.bind(this);
      this.saveNewContainer = this.saveNewContainer.bind(this);
      this.saveContainer = this.saveContainer.bind(this);
      this.deleteContainer = this.deleteContainer.bind(this);
      this.updateHoveredRecord = this.updateHoveredRecord.bind(this); 
      this.updateSelectedRecord = this.updateSelectedRecord.bind(this);
      this.handleSetNewLocation = this.handleSetNewLocation.bind(this);    
    }

    // load user info
    loggedInUser(loggedInUser) {
      // if logged in
      if (loggedInUser) { 
        // inventory types can be removed when removed from app.actions.inventory
        // otherwise it will throw an error
        //app.actions.inventory.getInventoryTypes();
        app.actions.inventory.getFavorites();
        app.actions.inventory.getWorkbenchContainer();
        // set the user state object to the logged in user
        this.setState({
          user: loggedInUser
        });
      // if not logged in  
      } else {
        // set the user state object to default empty object
        this.setState({
          user: {}
        });
      }
    }

    // set the inventory path, selected record and parent record
    getInventoryPath() {
      // app.actions requires an active connection
      util.whenConnected(function(){
        // get id param from the url if it exists, else set to null
        const idParam = (this.props) ? this.props.match.params.id : null;
        // get the inventory path
        app.actions.inventory.populateInventoryPath(idParam, function(error, inventoryPath) {
          // if error getting inventory path
          if (error) {
            // notify the user of the error
            app.actions.notify(error.message, 'error');
            // set the error state object
            this.setState({ error });
          } else {
            // empty unwanted subdivisions field from each item in the inventory path
            for(let i = 0; i < inventoryPath.length; i++){
              let inventoryRecord = inventoryPath[i];
              inventoryRecord.subdivisions = [];
              inventoryPath[i] = inventoryRecord;
            }
            // if the inventory path length is greater than 1, set the parent record to the second to last array item
            // else set the parent record to the default empty object
            const parentRecord = inventoryPath.length > 1 ? inventoryPath[inventoryPath.length - 2] : {};
            // if the inventory path length is greater than 0, set the selected record to the last item in the array
            const selectedRecord = inventoryPath.length > 0 ? inventoryPath[inventoryPath.length - 1] : {};
            
            // need to determine record type
            
            // each virtual, when viewed, has a id param starting with a 'v'
            // this can be used to determine if the selected record is a virtual
            const isVirtual = 
              this.props && 
              this.props.match && 
              this.props.match.params && 
              this.props.match.params.id && 
              this.props.match.params.id[0] === 'v';
            // if the selected record is not a virtual, it is either the lab, a container or a physical
            // physicals have a 'virtual_id' state attribute, look for it to determine if 
            // the selected record is a physical 
            const isPhysical = !isVirtual && Object.keys(selectedRecord).indexOf('virtual_id') > -1;
            // if the selected record is not a virtual or physical, it is the lab or a container
            // the lab does not have a 'parent_id' attribute, so we will check for it to 
            // determine if the selected record is the lab
            const isLab = !isVirtual && !isPhysical && Object.keys(selectedRecord).indexOf('parent_id') === -1;
            // if the selected record is not a virtual, a physical or a lab, then it's a container
            const isContainer = !isVirtual && !isPhysical && !isLab; 
            
            // if the type attribute exists
            if (Object.keys(selectedRecord).indexOf('type') > -1) {
              // create/set the attribute 'type' to the existing value
              selectedRecord['type'] = selectedRecord.type;
            // else if the selected record is a virtual
            } else if (isVirtual) { 
              // create/set the attribute 'type' to a virtual
              selectedRecord['type'] = 'virtual'; 
            // else if the selected record is a physical
            } else if (isPhysical) {
              // create/set the attribute 'type' to a physical
              selectedRecord['type'] = 'physical';
            // else if the selected record is a lab
            } else if (isLab) {
              // create/set the attribute 'type' to a lab
              selectedRecord['type'] = 'lab';
            // else if the selected record is a container
            } else if (isContainer) {
              // create/set the attribute 'type' to a container
              selectedRecord['type'] = 'container';
            }


            // set state
            //  inventoryPath was updated
            //  selectedRecord was updated
            //  mode should be reset to 'view'
            this.setState({
              inventoryPath,
              parentRecord,
              selectedRecord,
              mode: 'view'               
            });
          }
        }.bind(this)); 
        // the 'this' context was bound to the method in the constructor but can be passed down
        // through each callback function by appending .bind(this) to the function 
      }.bind(this));
    }

    // change the mode 
    handleSetMode(e) {
      // the mode is set as an attribute 'mode' on the clickable DOM Element
      const mode = e.target.getAttribute('mode');
      // alerts should not persist mode change
      this.removeAlert();
      // set the mode in state
      this.setState({
        mode
      });
    }

    // clear the alert
    removeAlert() {
      this.setState({
        alert: {
          type: '',
          message: ''
        }
      });
    }

    // toggle map panel full width, hiding data panel
    toggleMapFullScreen() {
      this.setState({
        mapFullScreen: !this.state.mapFullScreen,
        dataFullScreen: false
      });
    }

    // toggle data panel full width, hiding map panel
    toggleDataFullScreen() {
      this.setState({
        dataFullScreen: !this.state.dataFullScreen,
        mapFullScreen: false
      });
    }

    // move a physical or container
    // requires updating the record, it's parent and the inventory path in state
    moveItem(record) {
      
      // set state variables to assist in human readability
      let inventoryPath = this.state.inventoryPath;
      let selectedRecord = this.state.selectedRecord;

      // the app actions save callback function
      app.actions.inventory.updateRecord(record, function(error) {
        let alert;
        if (error) {
          // notify with error
          app.actions.notify(error.message, 'error');
          // set alert message object to error
          alert = {
            type: 'danger',
            message: `There was a problem updating ${record.name}. If the problem persists, please contact your network administrator.`
          };
          // set the error and alert to state
          this.setState({ error, alert });
        } else {
          // set alert message object to success
          // alert = {
          //   type: 'success',
          //   message: `${record.name} was updated successfully.`
          // };
          
          // the record exists in the selectedRecord.children array
          // get the index
          let recordIndex;
          for(let i = 0; i < selectedRecord.children.length; i++) {
            let child = selectedRecord.children[i];
            if (String(record.id) === String(child.id)) {
              recordIndex = i;
            }  
          }

          // update selectedRecord.children
          selectedRecord.children[recordIndex] = record;

          // update inventoryPath
          inventoryPath[inventoryPath.length - 1] = selectedRecord;
          
          // update state
          this.setState({
            error: {},
            alert: {},
            inventoryPath,
            selectedRecord
          });                      

        } 
      }.bind(this));
    } 

    // save new container
    saveNewContainer(container, labelImageData=null, doPrint=null) {
      let newContainer = container;
      let selectedRecord = this.state.selectedRecord;
      console.log('Inventory.saveNewContainer', selectedRecord);
      newContainer['children'] = [];
      newContainer['parent_id'] = selectedRecord.id;
      app.actions.inventory.saveNewRecord(newContainer, null, null, function(error, savedContainer){
        let alert;
        if (error) {
          alert = {
            type: 'danger',
            message: `There was a problem saving ${newContainer.name}. If the problem persists, please contact your network administrator.`
          };
          app.actions.notify(alert.message + error.message, 'error');
          this.setState({ error, alert });
        } else {
          alert = {
            type: 'success',
            message: `${savedContainer.name} was created successfully.`
          };
          selectedRecord.children.push(savedContainer);
          app.actions.notify(alert.message, 'notice', 2000);
          this.setState({
            redirect: true,
            redirectTo: `/ui/inventory/${savedContainer.id}`,
            error: {},
            alert,
            mode: 'view',
            selectedRecord
          });
        }         
      }.bind(this));
    }

    // save changes to existing container
    saveContainer(container, changeToView=false) {
      // set state inventory path to variable to assist in human readability
      let inventoryPath = this.state.inventoryPath;
      // the app actions save callback function
      app.actions.inventory.updateRecord(container, function(error) {
        let alert;
        if (error) {
          // notify with error
          app.actions.notify(error.message, 'error');
          // set alert message object to error
          alert = {
            type: 'danger',
            message: `There was a problem updating ${container.name}. If the problem persists, please contact your network administrator.`
          };
          // set the error and alert to state
          this.setState({ error, alert });
        } else {
          // set alert message object to success
          alert = {
            type: 'success',
            message: `${container.name} was updated successfully.`
          };
          // replace the previous container in the inventory path with the updated container
          inventoryPath[inventoryPath.length - 1] = container;
          // update state
          if (changeToView) {
            this.setState({
              mode: 'view',
              error: {},
              alert,
              inventoryPath
            });
          } else {
            this.setState({
              error: {},
              alert,
              inventoryPath
            });            
          }
        } 
      }.bind(this));
    }  

    // delete a container
    deleteContainer(container, parentContainer) {
      // the app actions delete callback function
      app.actions.inventory.delPhysical(container.id, function(error, idRemoved) {
        if (error) {
          // notify with error
          app.actions.notify(error.message, 'error');
          // set alert message object to error
          alert = {
            type: 'danger',
            message: `There was a problem removing ${container.name}. If the problem persists, please contact your network administrator.`
          };
          // update state
          this.setState({ error, alert });
        } else {
          // notify that delete was successful
          app.actions.notify(name + " deleted", 'notice', 2000);
          // set alert message object to success
          alert = {
            type: 'success',
            message: `${container.name} was successfully removed.`
          };
          // set state 
          this.setState({
            redirect: true,
            redirectTo: `/ui/inventory/${parentContainer.id}`,            
            mode: 'view',
            error: {},
            alert
          });
        }
      }.bind(this));      
    }

    // set the hover record
    updateHoveredRecord(record) {
      if(!record) {
        this.setState({
          hoveredRecordId: '',
          hoveredRecord: {}
        });
      } else {
        this.setState({
          hoveredRecordId: record.id,
          hoveredRecord: record
        });
      }
    }

    // set selected and parent records
    updateSelectedRecord(selectedRecord) {
      // console.log('this.updateSelectedRecord', selectedRecord);
      // if no record provided
      if(!selectedRecord) {
        // set selected and parent records according to inventory path position
        this.setState({
          selectedRecord: this.state.inventoryPath[this.state.inventoryPath.length - 1],
          parentRecord: this.state.inventoryPath[this.state.inventoryPath.length - 2] || {}
        });
      // else if record provided
      } else {
        // set parent record to the existing, a new parent according to inventory path position, or none
        let parentRecord = this.state.parentRecord || this.state.inventoryPath[this.state.inventoryPath.length - 2] || null;
        // if parent record exists and is not empty
        if (Object.keys(parentRecord).length > 0 ) {
          // if the parent record has no children attribute
          if (Object.keys(parentRecord).indexOf('children') === -1){
            // set the children attribute to a blank array
            parentRecord['children'] = [];
          }

          // update parent records children with updated selected record
          for(let i = 0; i < parentRecord.children.length; i++){
            let child = parentRecord.children[i];
            if (String(child.id) === String(selectedRecord.id)) {
              parentRecord.children[i] = selectedRecord;
            }
          }
        }
        // update inventory path with updated selected and parent records
        let inventoryPath = this.state.inventoryPath;
        inventoryPath[inventoryPath.length - 1] = selectedRecord;
        inventoryPath[inventoryPath.length - 2] = parentRecord;
        // set state
        this.setState({
          selectedRecord,
          parentRecord,
          inventoryPath
        });
      }
    }

    handleSetNewLocation(e) {
      e.preventDefault();
      console.log('handleSetNewLocation');
      let newItemY = e.target.getAttribute('row');
      let newItemX = e.target.getAttribute('col');
      console.log(`${newItemX},${newItemY}`);
      this.setState({
        newItemY,
        newItemX
      });
    }

    // fired on first mount and every state change after
    componentDidUpdate() { 
      util.whenConnected(function(){
        const idParam = (this.props.match.params.id) ? this.props.match.params.id : null;
        const selectedRecordExists = Object.keys(this.state.selectedRecord).length > 0;
        const idMatchesSelectedRecord = idParam && selectedRecordExists && this.state.selectedRecord.id === idParam;
        if (idParam && idParam.length > 0 && !selectedRecordExists || !idMatchesSelectedRecord) {
          this.getInventoryPath(); 
        }  
      }.bind(this));         
    }

    // fired on first mount only
    componentDidMount() {
      util.whenConnected(function(){
        const idParam = (this.props.match.params.id) ? this.props.match.params.id : null;
        const selectedRecordExists = Object.keys(this.state.selectedRecord).length > 0;
        const idMatchesSelectedRecord = idParam && selectedRecordExists && this.state.selectedRecord.id === idParam;
        if (!selectedRecordExists || !idMatchesSelectedRecord) {
          this.getInventoryPath(); 
        }  
      }.bind(this));    
    }

    render() {
      // set state variables
      const inventoryPath = this.state.inventoryPath;
      const selectedRecord = this.state.selectedRecord;
      
      // set render conditions
      const selectedRecordExists = Object.keys(selectedRecord).length > 0;
      const parentRecord = this.state.parentRecord;
      
      // apply conditional css classes for full screen
      let column1Class, column2Class;
      if (this.state.dataFullScreen) {
        column1Class = "column is-12";
        column2Class = "column is-12 is-hidden";
      } else if (this.state.mapFullScreen) {
        column1Class = "column is-12 is-hidden";
        column2Class = "column is-12";
      } else {
        column1Class = "column is-7-desktop";
        column2Class = "column is-5-desktop";
      }    

      return (
        <div class="InventoryPage">
          
          {(selectedRecordExists) ? (
          
            <div class="columns is-desktop">
              
              <div class={column1Class}>
                
                {(this.state.selectedRecord.type === 'lab') ? (
                  <LabPanel
                    selectedRecord={selectedRecord}
                    inventoryPath={this.state.inventoryPath}
                    mode={this.state.mode}
                    handleSetMode={this.handleSetMode}
                    alert={this.state.alert}
                    removeAlert={this.removeAlert}
                    saveNewContainer={this.saveNewContainer}
                    saveContainer={this.saveContainer}
                    deleteContainer={this.deleteContainer}
                    dataFullScreen={this.state.dataFullScreen}
                    toggleDataFullScreen={this.toggleDataFullScreen}                  
                  />
                ) : null }

                {(this.state.selectedRecord.type === 'container') ? (
                  <ContainerPanel
                    selectedRecord={selectedRecord}
                    parentRecord={parentRecord}
                    inventoryPath={this.state.inventoryPath}
                    mode={this.state.mode}
                    handleSetMode={this.handleSetMode}
                    alert={this.state.alert}
                    removeAlert={this.removeAlert}
                    saveNewContainer={this.saveNewContainer}
                    saveContainer={this.saveContainer}
                    deleteContainer={this.deleteContainer}
                    dataFullScreen={this.state.dataFullScreen}
                    toggleDataFullScreen={this.toggleDataFullScreen}
                    updateSelectedRecord={this.updateSelectedRecord}
                    handleSetNewLocation={this.handleSetNewLocation}
                    newItemName={this.state.newItemName}
                    newItemX={this.state.newItemX}
                    newItemY={this.state.newItemY}
                  />
                ) : null }

                {(this.state.selectedRecord.type === 'physical') ? (
                  <PhysicalPanel
                    selectedRecord={selectedRecord}
                    inventoryPath={this.state.inventoryPath}
                    mode={this.state.mode}
                    handleSetMode={this.handleSetMode}
                    dataFullScreen={this.state.dataFullScreen}
                    toggleDataFullScreen={this.toggleDataFullScreen}                
                  />
                ) : null }

                {(this.state.selectedRecord.type === 'virtual') ? (
                  <VirtualPanel
                    selectedRecord={selectedRecord}
                    inventoryPath={this.state.inventoryPath}
                    mode={this.state.mode}
                    handleSetMode={this.handleSetMode}
                    dataFullScreen={this.state.dataFullScreen}
                    toggleDataFullScreen={this.toggleDataFullScreen}                 
                  />
                ) : null }

              </div>

              <div class={column2Class}>
                <MapPanel
                  selectedRecord={selectedRecord}
                  parentRecord={parentRecord}
                  inventoryPath={this.state.inventoryPath}
                  type={this.state.selectedRecord.type}
                  mode={this.state.mode}
                  mapFullScreen={this.state.mapFullScreen}
                  toggleMapFullScreen={this.toggleMapFullScreen}
                  onRecordMouseEnter={this.onRecordMouseEnter}
                  onRecordMouseLeave={this.onRecordMouseLeave}
                  hoveredRecordId={this.state.hoveredRecordId}
                  hoveredRecord={this.state.hoveredRecord}
                  updateHoveredRecord={this.updateHoveredRecord}
                  saveContainer={this.saveContainer}
                  moveItem={this.moveItem}
                  handleSetNewLocation={this.handleSetNewLocation}
                  newItemName={this.state.newItemName}
                  newItemX={this.state.newItemX}
                  newItemY={this.state.newItemY}
                />
              </div>
            </div>
          ) : null }
        </div>
      );
    }
  }
}