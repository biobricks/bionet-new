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
        hoveredRecordId: '',
        hoveredRecord: {},
        user: {},
        containerForm: {

        }
      };
      ashnazg.listen('global.user', this.loggedInUser.bind(this));
      this.loggedInUser = this.loggedInUser.bind(this);
      this.setStateKey = this.setStateKey.bind(this);
      this.getInventoryPath = this.getInventoryPath.bind(this);
      this.handleSetMode = this.handleSetMode.bind(this);
      this.removeAlert = this.removeAlert.bind(this);
      this.toggleMapFullScreen = this.toggleMapFullScreen.bind(this);
      this.toggleDataFullScreen = this.toggleDataFullScreen.bind(this);
      this.saveNewContainer = this.saveNewContainer.bind(this);
      this.saveContainer = this.saveContainer.bind(this);
      this.deleteContainer = this.deleteContainer.bind(this);
      this.updateHoveredRecord = this.updateHoveredRecord.bind(this);     
    }

    loggedInUser(loggedInUser) {
      if (loggedInUser) { 
        app.actions.inventory.getInventoryTypes();
        app.actions.inventory.getFavorites();
        app.actions.inventory.getWorkbenchContainer();        
        this.setStateKey('user', loggedInUser); 
      } else {
        this.setStateKey('user', {});
      }
    }

    setStateKey(key, value){
      let newState = this.state;
      newState[key] = value;
      this.setState(newState);
    }    

    getInventoryPath() {   
      util.whenConnected(function(){
        const idParam = (this.props) ? this.props.match.params.id : null;
        const selectedRecord = this.state.inventoryPath.length > 0 ? this.state.inventoryPath[this.state.inventoryPath.length - 1] : null;
        const idMatchesSelectedRecord = selectedRecord && selectedRecord.id === idParam;
        if (!selectedRecord || !idMatchesSelectedRecord) {
          app.actions.inventory.populateInventoryPath(idParam, function(error, inventoryPath) {
            if (error) {
              app.actions.notify(error.message, 'error');
              this.setState({ error });
            } else {
              this.setState({
                inventoryPath,
                mode: 'view'               
              });
            }
          }.bind(this));
        }  
      }.bind(this));
    }

    handleSetMode(e) {
      const mode = e.target.getAttribute('mode');
      this.removeAlert();
      this.setState({
        mode
      });
    }

    removeAlert() {
      this.setState({
        alert: {
          type: '',
          message: ''
        }
      });
    }

    toggleMapFullScreen() {
      this.setState({
        mapFullScreen: !this.state.mapFullScreen,
        dataFullScreen: false
      });
    }

    toggleDataFullScreen() {
      this.setState({
        dataFullScreen: !this.state.dataFullScreen,
        mapFullScreen: false
      });
    }

    saveNewContainer(container) {
      app.actions.inventory.saveToInventory(container, null, null, function(error, newContainerId){
        let alert;
        if (error) {
          alert = {
            type: 'danger',
            message: `There was a problem saving ${container.name}. If the problem persists, please contact your network administrator.`
          };
          app.actions.notify(alert.message + error.message, 'error');
          this.setState({ error, alert });
        } else {
          alert = {
            type: 'success',
            message: `${container.name} was updated successfully.`
          };
          app.actions.notify(alert.message, 'notice', 2000);
          this.setState({
            redirect: true,
            redirectTo: `/ui/inventory/${newContainerId}`,
            error: {},
            alert
          });
        }         
      }.bind(this));
    }

    saveContainer(container) {
      let inventoryPath = this.state.inventoryPath;
      app.actions.inventory.updateRecord(container, function(error) {
        let alert;
        if (error) {
          app.actions.notify(error.message, 'error');
          alert = {
            type: 'danger',
            message: `There was a problem updating ${container.name}. If the problem persists, please contact your network administrator.`
          };
          this.setState({ error, alert });
        } else {
          alert = {
            type: 'success',
            message: `${container.name} was updated successfully.`
          };
          
          inventoryPath[inventoryPath.length - 1] = container;

          this.setState({
            mode: 'view',
            error: {},
            alert,
            inventoryPath
          });
        } 
      }.bind(this));
    }  

    deleteContainer(container, parentContainer) {
      app.actions.inventory.delPhysical(container.id, function(error, idRemoved) {
        if (error) {
          app.actions.notify(error.message, 'error');
          alert = {
            type: 'danger',
            message: `There was a problem removing ${container.name}. If the problem persists, please contact your network administrator.`
          };
          this.setState({ error, alert });
        } else {
          app.actions.notify(name + " deleted", 'notice', 2000);
          alert = {
            type: 'success',
            message: `${container.name} was successfully removed.`
          };
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

    componentDidUpdate() {
      this.getInventoryPath();        
    }

    componentDidMount() {
      this.getInventoryPath();
    }

    render() {
      let inventoryPath = this.state.inventoryPath;
      let selectedRecord = inventoryPath.length > 0 ? inventoryPath[inventoryPath.length - 1] : {};
      let parentRecord = inventoryPath.length > 1 ? inventoryPath[0] : {};

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

      const isVirtual = 
        this.props && 
        this.props.match && 
        this.props.match.params && 
        this.props.match.params.id && 
        this.props.match.params.id[0] === 'v';
      const isPhysical = !isVirtual && Object.keys(selectedRecord).indexOf('virtual_id') > -1;
      const isLab = !isVirtual && !isPhysical && Object.keys(selectedRecord).indexOf('parent_id') === -1;
      const isContainer = !isVirtual && !isPhysical && !isLab; 

      let type;
      if (isVirtual) { 
        type = 'virtual'; 
      } else if (isPhysical) {
        type = 'physical';
      } else if (isLab) {
        type = 'lab';
      } else if (isContainer) {
        type = 'container';
      }      

      return (
        <div class="InventoryPage">
          
          <div class="columns is-desktop">
            
            <div class={column1Class}>
              
              {(isLab) ? (
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

              {(isContainer) ? (
                <ContainerPanel
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

              {(isPhysical) ? (
                <PhysicalPanel
                  selectedRecord={selectedRecord}
                  inventoryPath={this.state.inventoryPath}
                  mode={this.state.mode}
                  handleSetMode={this.handleSetMode}
                  dataFullScreen={this.state.dataFullScreen}
                  toggleDataFullScreen={this.toggleDataFullScreen}                
                />
              ) : null }

              {(isVirtual) ? (
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
                type={type}
                mode={this.state.mode}
                mapFullScreen={this.state.mapFullScreen}
                toggleMapFullScreen={this.toggleMapFullScreen}
                onRecordMouseEnter={this.onRecordMouseEnter}
                onRecordMouseLeave={this.onRecordMouseLeave}
                hoveredRecordId={this.state.hoveredRecordId}
                hoveredRecord={this.state.hoveredRecord}
                updateHoveredRecord={this.updateHoveredRecord}           
              />
            </div>
          </div>

        </div>
      );
    }
  }
}