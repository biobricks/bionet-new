import { h } from 'preact';
import { fakeLabData } from '../fake_lab';

module.exports = function(Component) {

  const DataPanel = require('./data_panel.js')(Component);
  const MapPanel = require('./map_panel.js')(Component);

  return class LabInventory extends Component {

    constructor(props) {
      super(props);
      this.state = {
        lab: {},
        editMode: false
      };
      this.getLabData = this.getLabData.bind(this);
      this.toggleEditMode = this.toggleEditMode.bind(this);
      this.onSaveButtonClick = this.onSaveButtonClick.bind(this);
    }

    toggleEditMode() {
      this.setState({
        editMode: !this.state.editMode
      });
    }

    onSaveButtonClick() {
      alert('ToDo Here: Save Lab Changes From State');
      this.toggleEditMode();
    }

    getLabData() {
      const lab = fakeLabData;
      this.setState({
        lab: lab
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
