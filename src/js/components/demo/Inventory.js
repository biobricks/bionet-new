import { h } from 'preact';
import ashnazg from 'ashnazg';
import { Redirect } from 'react-router-dom';
import util from '../../util.js';

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
        formattedRecord: {},
        editMode: false,
        newMode: false,
        formType: "",
        hoveredRecord: {}
      };
      console.log(app.actions.inventory);
      //ashnazg.listen('global.user', this.loggedInUser.bind(this));
      this.toggleEditMode = this.toggleEditMode.bind(this);
      this.toggleNewMode = this.toggleNewMode.bind(this);
      this.getInventoryPath = this.getInventoryPath.bind(this);
      this.setFormType = this.setFormType.bind(this);
      this.setHoveredRecord = this.setHoveredRecord.bind(this);
      this.getSelectedRecord = this.getSelectedRecord.bind(this);
      this.formatSelectedRecord = this.formatSelectedRecord.bind(this);
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
      let selectedRecord = this.state.selectedRecord;
      const idMatchesSelectedRecord = idParam === selectedRecord;
      const selectedRecordEmpty = Object.keys(selectedRecord).length === 0;
      const inventoryPathEmpty = this.state.inventoryPath.length === 0;
      if (selectedRecordEmpty || inventoryPathEmpty || idParam !== selectedRecord.id) {
        this.getInventoryPath(idParam, (error, inventoryPath) => {
          if(error){ 
            console.log(error); 
          } else {
            selectedRecord = inventoryPath[inventoryPath.length - 1];
            const formattedRecord = this.formatSelectedRecord(selectedRecord);
            const hasChildren = Object.keys(formattedRecord).indexOf('children') > -1;
            const hasSubdivisions = Object.keys(selectedRecord).indexOf('subdivisions') > -1;
            if(hasChildren && hasSubdivisions){
              for(let i = 0; i < formattedRecord.children.length; i++){
                const child = selectedRecord.subdivisions[i][0].item;
                const isFormatted = Object.keys(child).indexOf('parent_id') === -1;
                if (!isFormatted) {
                  this.getInventoryPath(child.id, (error, inventoryPath) => {
                    let childRecord = inventoryPath[inventoryPath.length - 1];
                    formattedRecord.children[i] = this.formatSelectedRecord(childRecord);
                  });
                  //formattedRecord.children[i] = this.formatSelectedRecordChild(child);
                  //console.log(formattedRecord.children[i])
                }
              }
            }
            // console.group();
            //   console.log('Selected Record:');
            //   console.log(selectedRecord);
            //   console.log('Formatted Record:');
            //   console.log(formattedRecord);
            // console.groupEnd();             
            
            this.setState({
              inventoryPath,
              selectedRecord,
              formattedRecord,
              hoveredRecord: null
            });        
          }
        });
      }
    }
    
    formatSelectedRecord(record) {
      const isLab = Object.keys(record).indexOf('type') > -1 && record.type === 'lab';
      const isContainer = Object.keys(record).indexOf('virtual_id') === -1;
      let type;

      let formattedRecord = {
        id: record.id,
        parentId: record.parent_id,
        name: record.name || 'Untitled',
        description: record.description || '',
        layout: {
          orientation: record.viewOrientation || 'side',
          rows: record.yUnits,
          columns: record.xUnits
        },
        style: {
          fontSize: record.fontSize || 18,
          backgroundColor: record.color,
          gridColumnStart: record.parent_x,
          gridColumnEnd: record.parent_x + 1,
          gridRowStart: record.parent_y,
          gridRowEnd: record.parent_y + 1          
        },
        created: record.created,
        updated: record.updated
      };

      if (isLab) {
        formattedRecord['type'] = 'lab';
        formattedRecord['children'] = record.children || [];
      } else if (isContainer) {
        formattedRecord['type'] = 'container';
        formattedRecord['children'] = record.children || [];
      } else {
        formattedRecord['type'] = 'physical';
        formattedRecord['virtualId'] = record.virtual_id;
      }
      // console.log('Formatted Record:');
      // console.log(formattedRecord);
      return formattedRecord;
    }

    componentDidUpdate() {
      //console.log('componentDidUpdate fired');
      util.whenConnected(() => { 
        this.getSelectedRecord();
      });
    }

    componentDidMount() {
      //console.log('componentDidMount fired');
      util.whenConnected(() => { 
        this.getSelectedRecord();
      });
    }

    render() {
      return (
        <div class="Inventory">
          <div class="columns is-desktop">
            <div class="column is-7-desktop">
              <DataPanel
                formattedRecord={this.state.formattedRecord}
                selectedRecord={this.state.selectedRecord}
                inventoryPath={this.state.inventoryPath}
                onClickLink={this.onClickLink}
                toggleNewMode={this.toggleNewMode}
                toggleEditMode={this.toggleEditMode}
                setFormType={this.setFormType}
                setHoveredRecord={this.setHoveredRecord}
              />
              <div class="panel">
                <div class="panel-heading">
                  Selected Record
                </div>
                <div class="panel-block">
                  <pre style={{'width': '100%'}}>{JSON.stringify(this.state.selectedRecord, null, 2)}</pre>  
                </div>
              </div>
              <div class="panel">
                <div class="panel-heading">
                  Formatted Record
                </div>
                <div class="panel-block">
                  <pre style={{'width': '100%'}}>{JSON.stringify(this.state.formattedRecord, null, 2)}</pre>  
                </div>
              </div>
            </div>
            <div class="column is-5-desktop">
              <MapPanel
                {...this.state}
                selectedRecord={this.state.formattedRecord}
                setHoveredRecord={this.setHoveredRecord}
              />
            </div>
          </div>  
        </div>
      );
    }

  }

}