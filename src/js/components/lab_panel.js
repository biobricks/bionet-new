import { h } from 'preact';
import { Link } from 'react-router-dom';

module.exports = function(Component) {

  return class LabPanel extends Component {
  
    constructor(props) {
      super(props);
      this.state = {
        editMode: true,
        lab: {}
      };
    }
      
    toggleNewMode() {
        if (this.props.toggleNewMode) this.props.toggleNewMode()
    }
      
    toggleEditItemMode() {
        if (this.props.toggleEditItemMode) this.props.toggleEditItemMode()
    }
      
    toggleEditMode() {
        this.setState({
            editMode: !this.state.editMode
        });
        if (this.props.toggleEditMode) this.props.toggleEditMode()
    }
      
    toggleFullscreenMode() {
        const fullWidth=!this.props.fullWidth
        if (this.props.toggleFullscreenMode) this.props.toggleFullscreenMode(fullWidth)
    }

    onSaveButtonClick() {
      this.toggleEditMode();
    }

    componentDidMount() {
        if (this.props.onMount) {
            const mapContainer = document.getElementById('EditContainerDiv')
            var containerWidth=450
            var containerHeight=600
            if (mapContainer) {
                containerWidth=mapContainer.offsetWidth
                containerHeight=mapContainer.offsetHeight
            }
            this.props.onMount(containerWidth,containerHeight)
        }
    }

    render() {
      let lab = this.state.lab;
      let isEditMode = this.state.editMode;
        const name=(this.props.selectedRecord) ? this.props.selectedRecord.name : ''
      return (
        <div class="LabPanel panel has-background-white">
          <div class="panel-heading">
            <div class="is-block">
              <div class="columns is-gapless">
                <div class="column">
                  { (isEditMode) ? (
                    <div>
                      Edit {name}
                      <div class="toolbox is-pulled-right">
                        <div class="buttons has-addons">
                          <span 
                            class="button is-small"
                            onClick={this.toggleEditMode.bind(this)}
                          >
                            <i class="mdi mdi-arrow-left-bold"></i>
                          </span>
      
                            <span 
                            class="button is-small is-success"
                            onClick={this.onSaveButtonClick.bind(this)}
                          >
                            <i class="mdi mdi-content-save"></i>
                          </span>

                          <span 
                            class="button is-small is-link"
                            onClick={this.toggleFullscreenMode.bind(this)}
                          >
                          {(this.props.fullWidth) ? <i class="mdi mdi-arrow-collapse"></i> : <i className="mdi mdi-arrow-expand"></i>}
                          </span>

                        </div>
                      </div>                    
                    </div>
                  ) : (
                    <div>
                      {name}
                      <div class="toolbox is-pulled-right">
                        <div class="buttons has-addons">
                          <span 
                            class="button is-small is-link"
                            onClick={this.toggleEditMode.bind(this)}
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
            <div id="edit-container" class="lab-editor">
              {(isEditMode) ? (
                <p id="map-panel-item" class="is-size-12">
                    <div class="map-container">{this.props.children}</div>
                </p>
              ) : (
                <p class="is-size-12">
                    <div id="map-panel-item" class="map-container">{this.props.children}</div>
                </p>
              )} 
            </div>
          </div>
        </div>
      )
    }
  }
}
