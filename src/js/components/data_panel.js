import { h } from 'preact';
import { Link } from 'react-router-dom';

module.exports = function(Component) {

  const ContainerProfile = require('./container_profile.js')(Component);
  const ContainerEditForm = require('./container_edit_form.js')(Component);

  return class DataPanel extends Component {
	  render() {
      let isViewMode = !this.props.editMode && !this.props.newMode;
      let isEditMode = this.props.editMode;
      let isNewMode = this.props.newMode;
      let parentRecord = this.props.parentRecord;
      let hasParentRecord = parentRecord && Object.keys(parentRecord).length > 0;
      let parentRecordIsLab = hasParentRecord && parentRecord.name === this.props.lab.name;
      let record = this.props.selectedRecord;
      let isContainer = Object.keys(record).indexOf('children') > -1;      
      return (
        <div class="DataPanel panel has-background-white">
          <div class="panel-heading">
            <div class="is-block">
              <div class="columns is-gapless">
                <div class="column">
                  
                  {(isViewMode) ? (
                    <span>{this.props.selectedRecord.name}</span>
                  ) : null }

                  {(isNewMode) ? (
                    <span>New Physical In {this.props.selectedRecord.name}</span>
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
            {(hasParentRecord) ? (
              <nav class="breadcrumb has-succeeds-separator" aria-label="breadcrumbs">
                <ul>
                  <li>
                    <Link to="/ui/lab">
                      {this.props.lab.name}
                    </Link>
                  </li>
                  {(!parentRecordIsLab) ? (
                
                      <li>
                        <a
                          id={this.props.parentRecord.id}
                          onClick={this.props.selectRecord}
                        >
                          {this.props.parentRecord.name}
                        </a>
                      </li>
               
                  ) : null }
                  <li class="is-active">{this.props.selectedRecord.name}</li>
                </ul>
              </nav>
            ) : null }  
          </div>
          <div>
            {(isViewMode && isContainer) ? (
              <ContainerProfile 
                 {...this.props}
                selectRecord={this.props.selectRecord}
              />
            ) : null }
            {(isViewMode && !isContainer) ? (
              <div> 
                {this.props.children}
              </div>
            ) : null }
            {(isNewMode) ? (
              <div>
                New Mode:<br/>
                New Container/Physical Form
              </div>
            ) : null }
            {(isEditMode) ? (
              <div>
              <ContainerEditForm 
                {...this.props}
              />
              </div>
            ) : null }
              
          </div>
        </div>
      )
    }
  }
}
