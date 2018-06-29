import { h } from 'preact';
import fakeLabData from '../../fake_lab';

module.exports = function(Component) {

  const DataPanel = require('./DataPanel.js')(Component);
  const MapPanel = require('./MapPanel.js')(Component);

  return class LabInventory extends Component {

    constructor(props) {
      super(props);
      this.state = {
        lab: {},
        editMode: false,
        newMode: false,
        selectedRecord: {},
        parentRecord: {}
      };
      this.searchResult = null;
      this.getLabData = this.getLabData.bind(this);
      this.selectRecord = this.selectRecord.bind(this);
      this.getRecordById = this.getRecordById.bind(this);
      this.toggleNewMode = this.toggleNewMode.bind(this);
      this.toggleEditMode = this.toggleEditMode.bind(this);
      this.onSaveNewClick = this.onSaveNewClick.bind(this);
      this.onSaveEditClick = this.onSaveEditClick.bind(this);
      this.onDeleteClick = this.onDeleteClick.bind(this);
    }

    selectRecord(e) {
      e.preventDefault();
      let recordId = e.target.getAttribute('id');
      console.info(`User clicked on record ${recordId}. Searching...`);
      
      // selectedRecord
      this.searchResult = null;
      this.getRecordById(recordId, fakeLabData);
      let selectedRecord = this.searchResult || {};
      
      // parentRecord
      this.searchResult = null;
      this.getRecordById(selectedRecord.parent, fakeLabData);
      let parentRecord = this.searchResult || {};

      console.log('Result:');
      console.log(selectedRecord);
      console.log(parentRecord);

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
      this.setState({
        lab: lab,
        parentRecord: lab,
        selectedRecord: lab.children[0]
      });
    }

    componentDidMount() {
      this.getLabData();
    }  

    render() {
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
              />
            </div>
            <div class="column is-5-desktop">
              <MapPanel 
                {...this.state}
              />
            </div>
          </div>
        </div>
      )
    }

  }
}
