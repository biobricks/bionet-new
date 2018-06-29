import { h } from 'preact';
import { Link } from 'react-router-dom';

module.exports = function(Component) {

  const ContainerProfile = require('./ContainerProfile.js')(Component);
  const ContainerNewForm = require('./ContainerNewForm.js')(Component);
  const ContainerEditForm = require('./ContainerEditForm.js')(Component);
  const PhysicalProfile = require('./PhysicalProfile.js')(Component);
  const PhysicalNewForm = require('./PhysicalNewForm.js')(Component);
  const PhysicalEditForm = require('./PhysicalEditForm.js')(Component);

  return class DataPanel extends Component {
    
    constructor(props) {
      super(props);
      this.state = {
        formType: ''
      };
      this.setFormType = this.setFormType.bind(this);
    }
    
    setFormType(e) {
      let formType = e.target.value;
      console.log(`Form type switched to ${formType}`);
      this.setState({
        formType
      });
    }

    render() {

      <li class="is-active">{this.props.selectedRecord.name}</li>
        
      let isViewMode = !this.props.editMode && !this.props.newMode;
      let isEditMode = this.props.editMode;
      let isNewMode = this.props.newMode;
      let parentRecord = this.props.parentRecord;
      let selectedRecord = this.props.selectedRecord;
      let isContainer = Object.keys(selectedRecord).indexOf('children') > -1;
      let headingIcon = isContainer ? (<i class="mdi mdi-grid"></i>) : (<i class="mdi mdi-flask"></i>);
      return (
        <div class="DataPanel panel has-background-white">
          <div class="panel-heading is-capitalized">
            <div class="is-block">
              <div class="columns is-gapless">
                <div class="column">
                  
                  {(isViewMode) ? (
                    <span>{headingIcon} {this.props.selectedRecord.name}</span>
                  ) : null }

                  {(isNewMode && isContainer) ? (
                    <span>New {this.state.formType || "Item"} In {this.props.selectedRecord.name}</span>
                  ) : null }

                  {(isNewMode && !isContainer) ? (
                    <span>New Instances Of {this.props.selectedRecord.name}</span>
                  ) : null }

                  {(isEditMode) ? (
                    <span>Edit {this.props.selectedRecord.name}</span>
                  ) : null }

                  {(isViewMode) ? (
                    <div class="toolbox is-pulled-right">
                      <div class="buttons has-addons">
                        <span 
                          class="button is-small is-success"
                          onClick={this.props.toggleNewMode}
                        >
                          <i class="mdi mdi-plus"></i>
                        </span>
                        <span 
                          class="button is-small is-link"
                          onClick={this.props.toggleEditMode}
                        >
                          <i class="mdi mdi-pencil"></i>
                        </span>
                      </div>
                    </div>
                  ) : null }

                  {(isNewMode) ? (
                    <div class="toolbox is-pulled-right">
                      <div class="buttons has-addons">
                        <span 
                           class="button is-small"
                          onClick={this.props.toggleNewMode}
                        >
                          <i class="mdi mdi-arrow-left-bold"></i>
                        </span>
                        <span 
                          class="button is-small is-success"
                          onClick={this.props.onSaveNewClick}
                        >
                          <i class="mdi mdi-content-save"></i>
                        </span>
                      </div>
                    </div>                    
                  ): null }

                  {(isEditMode) ? (
                    <div class="toolbox is-pulled-right">
                      <div class="buttons has-addons">
                        <span 
                          class="button is-small"
                          onClick={this.props.toggleEditMode}
                        >
                          <i class="mdi mdi-arrow-left-bold"></i>
                        </span>
                        <span 
                          class="button is-small is-success"
                          onClick={this.props.onSaveEditClick}
                        >
                          <i class="mdi mdi-content-save"></i>
                        </span>
                        <span 
                          class="button is-small is-danger"
                          onClick={this.props.onDeleteClick}
                        >
                          <i class="mdi mdi-delete-variant"></i>
                        </span>
                      </div>
                    </div>                    
                  ): null }

                </div>
              </div>    
            </div>
          </div>

          <div class="panel-block">
              <nav class="breadcrumb is-capitalized" aria-label="breadcrumbs">
                <ul>
                  <li>
                    <Link to="/ui/lab">
                      {this.props.lab.name}
                    </Link> 
                  </li>
                  {(this.props.parentRecord.name !== "EndyLab") ? (
                    <li>
                      <a 
                        href="#"
                        id={this.props.parentRecord.id}
                        onClick={this.props.selectRecord}
                      >
                        {this.props.parentRecord.name}
                      </a>
                    </li>
                  ) : null }  
                  <li>
                      {this.props.selectedRecord.name}
                  </li>                 
                </ul>
              </nav>
          </div>
          <div>
            {(isViewMode && isContainer) ? (
              <ContainerProfile 
                {...this.props}
                selectRecord={this.props.selectRecord}
              />
            ) : null }
            {(isViewMode && !isContainer) ? (
              <PhysicalProfile 
                {...this.props}
                selectRecord={this.props.selectRecord}
              />
            ) : null }
            {(isNewMode && isContainer) ? (
              <div>
                <div class="panel-block">
                  <div class="columns">
                    <div class="column is-12">
                      <div class="columns is-mobile">
                        <div class="column is-narrow">
                          <label class="label">New</label>
                        </div>
                        <div class="column">   
                          <div class="select">
                            <select 
                              class="is-small"
                              onChange={this.setFormType}
                              value={this.state.formType}
                            >
                              <option value="">Select One</option>
                              <option value="Container">Container</option>
                              <option value="Physical">Physical</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {(this.state.formType === 'Container') ? (
                  <ContainerNewForm 
                    {...this.props}
                  />
                ) : null }
                {(this.state.formType === 'Physical') ? (
                  <PhysicalNewForm 
                  {...this.props}
                />
              ) : null }
              </div>
            ) : null }
            {(isNewMode && !isContainer) ? (
              <span>New Instance Form</span>
            ) : null}
            {(isEditMode) ? (
              <div>
                {(isContainer) ? (
                  <ContainerEditForm 
                    {...this.props}
                  />
                ) : (
                  <PhysicalEditForm 
                    {...this.props}
                  />
                )}  
              </div>
            ) : null }
              
          </div>
        </div>
      )
    }
  }
}
