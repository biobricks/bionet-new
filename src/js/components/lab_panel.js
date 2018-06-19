import { h } from 'preact';
import { Link } from 'react-router-dom';
import fakeLabData from '../fake_lab';

module.exports = function(Component) {

  return class LabPanel extends Component {
  
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
      let lab = this.state.lab;
      let isEditMode = this.state.editMode;
      return (
        <div class="LabPanel panel has-background-white">
          <div class="panel-heading">
            <div class="is-block">
              <div class="columns is-gapless">
                <div class="column">
                  { (isEditMode) ? (
                    <div>
                      Edit {lab.name}
                      <div class="toolbox is-pulled-right">
                        <div class="buttons has-addons">
                          <span 
                            class="button is-small"
                            onClick={this.toggleEditMode}
                          >
                            <i class="mdi mdi-cancel"></i>
                          </span>
                          <span 
                            class="button is-small is-success"
                            onClick={this.onSaveButtonClick}
                          >
                            <i class="mdi mdi-content-save"></i>
                          </span>
                        </div>
                      </div>                    
                    </div>  
                  ) : (
                    <div>
                      {lab.name}
                      <div class="toolbox is-pulled-right">
                        <div class="buttons has-addons">
                          <span 
                            class="button is-small is-link"
                            onClick={this.toggleEditMode}
                          >
                            <i class="mdi mdi-pencil"></i>
                          </span>
                        </div>
                      </div>                      
                    </div>
                  )}
                </div>
              </div>    
            </div>
          </div>

          <div class="panel-block">
            <Link to="/ui/lab-inventory">
              Lab Inventory
            </Link>
          </div>
          <div class="panel-block">
            <div class="lab-editor">
            
            </div>
          </div>
        </div>
      )
    }
  }
}
