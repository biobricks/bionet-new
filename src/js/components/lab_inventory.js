import { h } from 'preact';
import fakeLabData from '../fake_lab';

module.exports = function(Component) {

  const DataPanel = require('./data_panel.js')(Component);
  const MapPanel = require('./map_panel.js')(Component);

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
      this.getLabData = this.getLabData.bind(this);
      this.selectRecord = this.selectRecord.bind(this);
      this.toggleNewMode = this.toggleNewMode.bind(this);
      this.toggleEditMode = this.toggleEditMode.bind(this);
      this.onSaveNewClick = this.onSaveNewClick.bind(this);
      this.onSaveEditClick = this.onSaveEditClick.bind(this);
      this.onDeleteClick = this.onDeleteClick.bind(this);
    }

    selectRecord(e) {
      //e.preventDefault();
      let recordId = e.target.getAttribute('id');
      let record = getRecordById(recordId, fakeLabData);
      console.log('Result:');
      console.log(record);
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


let result;
function getRecordById(id, data){
  result = null;
  if(typeof data === 'object'){
    console.log(id);
    console.log(data.id);
    console.log(id === data.id);
    if(id === data.id){ result = data; }
    if(result){ return result; }
    // for(let i = 0; i < data.children.length; i++){
    //   let child = data.children[i];
    //   console.log(child);
    //   getRecordById(id, child);
    // }
  }
}