import { h } from 'preact';
import { Link } from 'react-router-dom';
import fakeLabData from '../fake_lab';

module.exports = function(Component) {

  return class LabPanel extends Component {
  
    constructor(props) {
      super(props);
      this.state = {
        editMode: false,
        lab: {},
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
      alert('Since the Lab Editor is edit-in-place, this button can toggle this.state.editMode back to false and have the map from the editor act as navigation rather than Lab Editor.');
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
                            <i class="mdi mdi-arrow-left-bold"></i>
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
            <div class="lab-editor">
              {(isEditMode) ? (
                <p class="is-size-4">
                  Edit Mode:<br/>
                  This section is for the Lab Map Editor.
                </p>
              ) : (
                <p class="is-size-4">
                  View/Navigation Mode:<br/>
                  This section is for the Lab Map Navigator.<br/>
                  Rather than editing the Lab Map, it is used for navigating<br/>
                  into it's child containers.<br/>
                  <Link to="/ui/lab-inventory">
                    Enter Demo Freezer
                  </Link>
                </p>
              )} 
            </div>
          </div>
        </div>
      )
    }
  }
}
