import { h } from 'preact';
import fakeLabData from '../../fake_lab';

module.exports = function(Component) {

  const DataPanel = require('./DataPanel.js')(Component);
  const MapPanel = require('./MapPanel.js')(Component);
  const SuggestPanel = require('./SuggestPanel.js')(Component);

  return class LabInventory extends Component {

    constructor(props) {
      super(props);
      this.state = {
        lab: {},
        editMode: false,
        newMode: false,
        formType: "",
        selectedRecord: {},
        selectedRecordPath: [],
        parentRecord: {},
      };
      this.searchResult = null;
      this.getLabData = this.getLabData.bind(this);
      this.selectRecord = this.selectRecord.bind(this);
      this.getRecordById = this.getRecordById.bind(this);
      this.getRecordPath = this.getRecordPath.bind(this);
      this.toggleNewMode = this.toggleNewMode.bind(this);
      this.toggleEditMode = this.toggleEditMode.bind(this);
      this.onSaveNewClick = this.onSaveNewClick.bind(this);
      this.onSaveEditClick = this.onSaveEditClick.bind(this);
      this.onDeleteClick = this.onDeleteClick.bind(this);
      this.setFormType = this.setFormType.bind(this);
    }

    selectRecord(e) {
      let recordId = e.target.getAttribute('id');
      //console.info(`User clicked on record ${recordId}. Searching...`);
      
      // selectedRecord
      this.searchResult = null;
      this.getRecordById(recordId, fakeLabData);
      let selectedRecord = this.searchResult || {};
      
      // parentRecord
      this.searchResult = null;
      this.getRecordById(selectedRecord.parent, fakeLabData);
      let parentRecord = this.searchResult || {};

      // selectedRecordPath
      this.setState({
        selectedRecordPath: []
      });
      this.getRecordPath(selectedRecord);
      let selectedRecordPath = this.state.selectedRecordPath;

      // console.log('selectedRecord:');
      // console.log(selectedRecord);
      
      // console.log('selectedRecordPath:');
      // console.log(selectedRecordPath);

      // console.log('parentRecord:');
      // console.log(parentRecord);

      this.setState({
        selectedRecord,
        parentRecord
      });
    }

    getRecordById(id, data) {
      if(typeof data === 'object'){
        if(id === data.id){ this.searchResult = data; }
        if(this.searchResult){ 
          return this.searchResult;
        } else {  
          if(data.children && data.children.length > 0){
            for(let i = 0; i < data.children.length; i++){
              let child = data.children[i];
              this.getRecordById(id, child);
            }
          }
        }
      }      
    }

    getRecordPath(record) {
      let selectedRecordPath = this.state.selectedRecordPath;
      selectedRecordPath.unshift(record);
      this.setState({
        selectedRecordPath
      });
      if(record.parent){
        this.searchResult = null;
        this.getRecordById(record.parent, fakeLabData);
        let parentRecord = this.searchResult;
        this.getRecordPath(parentRecord);
      }
    }

    toggleEditMode() {
      this.setState({
        editMode: !this.state.editMode
      });
    }

    toggleNewMode() {
      this.setState({
        editMode: false,
        newMode: !this.state.newMode
      });
    }

    onSaveEditClick() {
      alert('To-Do: Here is where the Container/Physical changes needs to be saved.');
      this.toggleEditMode();
    }

    onSaveNewClick() {
      alert('To-Do: Here is where the new Container/Physical needs to be saved.');
      this.toggleNewMode();
    }

    onDeleteClick() {
      alert('To-Do: Here is where the Container/Physical needs to be deleted.');
      this.toggleEditMode();      
    }

    getLabData() {
      const lab = fakeLabData;
      const itemId = this.props.match.params.itemId || null;
      
      this.searchResult = null; 
      this.getRecordById(itemId, lab);
      let selectedRecord = this.searchResult;
      
      this.searchResult = null; 
      this.getRecordById(selectedRecord.parent, lab);
      let parentRecord = this.searchResult;

      this.setState({
        selectedRecordPath: []
      });
      this.getRecordPath(selectedRecord);

      this.setState({
        lab: lab,
        parentRecord,
        selectedRecord
      });
    }

    setFormType(e) {
      let formType = e.target.value;
      console.log(`Form type switched to ${formType}`);
      this.setState({
        formType
      });
    }

    componentDidMount() {
      this.getLabData();
    }  

    render() {
      let isContainer = Object.keys(this.state.selectedRecord).indexOf('children') > -1;
      let isPhysical = Object.keys(this.state.selectedRecord).indexOf('children') === -1;
      let isNewMode = this.state.newMode;
      let isEditMode = this.state.editMode;
      return (
        <div class="LabInventory">
          <div class="columns is-desktop">
            <div class="column is-7-desktop">
              <DataPanel 
                {...this.state}
                selectRecord={this.selectRecord}
                onSaveNewClick={this.onSaveNewClick}
                onSaveEditClick={this.onSaveEditClick}
                onDeleteClick={this.onDeleteClick}
                toggleEditMode={this.toggleEditMode}
                toggleNewMode={this.toggleNewMode}
                setFormType={this.setFormType}
              />
            </div>
            <div class="column is-5-desktop">
              {(isNewMode && this.state.formType === 'Physical') ? (
                <SuggestPanel 
                {...this.state}
              />
              ) : (
                <MapPanel 
                  {...this.state}
                  selectRecord={this.selectRecord}
                />
              )}  
            </div>
          </div>
        </div>
      )
    }

  }
}
