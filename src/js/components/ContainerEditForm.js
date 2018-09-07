import { h } from 'preact';

module.exports = function(Component) {

  return class ContainerEditForm extends Component {

    constructor(props) {
      super(props);
      this.state = {
        form: {
          name: this.props.selectedRecord.name || '',
          description: this.props.selectedRecord.description || '',
          fontSize: this.props.selectedRecord.fontSize || 12,
          color: this.props.selectedRecord.color && this.props.selectedRecord.color !== 'aqua' ? this.props.selectedRecord.color : '#00ffff',
          xUnits: this.props.selectedRecord.xUnits || 0,
          yUnits: this.props.selectedRecord.yUnits || 0,
          layoutWidthUnits: this.props.selectedRecord.layoutWidthUnits || 0,
          layoutHeightUnits: this.props.selectedRecord.layoutHeightUnits || 0,
          parent_x: this.props.selectedRecord.parent_x || 1,
          parent_y: this.props.selectedRecord.parent_y || 1,
          parent_x_span: this.props.selectedRecord.parent_x_span || 1,
          parent_y_span: this.props.selectedRecord.parent_y_span || 1,
        }
      };
      this.handleFormSubmit = this.handleFormSubmit.bind(this);
      this.updateFormField = this.updateFormField.bind(this);
    }

    handleFormSubmit(e) {
      e.preventDefault();
      const form = this.state.form;
      let container = this.props.selectedRecord;
      for(let i = 0; i < Object.keys(this.state.form).length; i++ ){
        let formKey = Object.keys(this.state.form)[i];
        let formValue;
        if (
          formKey === 'name' || 
          formKey === 'description' || 
          formKey === 'color' 
        ) {
          formValue = form[formKey];
        } else {
          formValue = parseInt(form[formKey]);
        }
        container[formKey] = formValue;
      }
      this.props.saveContainer(container, true);
      this.setState({
        form: {
          name: this.props.selectedRecord.name || '',
          description: this.props.selectedRecord.description || '',
          fontSize: this.props.selectedRecord.fontSize || 12,
          color: this.props.selectedRecord.color && this.props.selectedRecord.color !== 'aqua' ? this.props.selectedRecord.color : '#00ffff',
          xUnits: this.props.selectedRecord.xUnits,
          yUnits: this.props.selectedRecord.yUnits,
          parent_x: this.props.selectedRecord.parent_x || 1,
          parent_y: this.props.selectedRecord.parent_y || 1,
          parent_x_span: this.props.selectedRecord.parent_x_span || 1,
          parent_y_span: this.props.selectedRecord.parent_y_span || 1,
        }
      });
    }

    updateFormField(e) {
      let container = this.props.selectedRecord;
      const fieldName = e.target.getAttribute('name');
      let form = this.state.form;
      form[fieldName] = e.target.value;
      this.setState({
        form
      });
      for(let i = 0; i < Object.keys(this.state.form).length; i++ ){
        let formKey = Object.keys(this.state.form)[i];
        let formValue;
        if (
          formKey === 'name' || 
          formKey === 'description' || 
          formKey === 'color' 
        ) {
          formValue = form[formKey];
        } else {
          formValue = parseInt(form[formKey]);
        }
        container[formKey] = formValue;
      }
      this.props.updateSelectedRecord(container);
    }

    render() {

      const selectedRecord = this.props.selectedRecord;
      let mode;

      return (
        <div class="ContainerEditForm Restructured">
          <div class="panel-block">
            <form onSubmit={this.handleFormSubmit}>

              <div class="field is-horizontal">
                <div class="field-label is-normal is-narrow">
                  <label class="label">Name</label>
                </div>
                <div class="field-body">
                    <input 
                      class="input"
                      type="text" 
                      name="name"
                      value={this.state.form.name}
                      placeholder="Container Name"
                      onInput={this.updateFormField}
                    />
                </div>
              </div>

              <div class="field is-horizontal">
                <div class="field-label is-normal is-narrow">
                  <label class="label">Description</label>
                </div>
                <div class="field-body">        
                  <textarea 
                    class="textarea" 
                    name="description"
                    value={this.state.form.description}
                    placeholder="A short description of the container."
                    rows="1"
                    onInput={this.updateFormField}
                  >{selectedRecord.description}</textarea>
                </div>
              </div>

              <div class="field is-horizontal">
                <div class="field-label is-normal is-narrow">
                  <label class="label mt-1">Style</label>
                </div>
                <div class="field-body">        
                  <div class="field is-expanded">
                    <div class="field has-addons">
                      <div class="control">
                        <a class="button is-static">
                          Font Size
                        </a>
                      </div>                      
                      <div class="control is-expanded">
                        <input 
                          class="input"
                          type="number" 
                          name="fontSize"
                          min="8"
                          max="36"
                          step="1"
                          value={this.state.form.fontSize}
                          onInput={this.updateFormField}
                        />
                      </div>
                      <div class="control">
                        <a class="button is-static">
                          px
                        </a>
                      </div>                      
                    </div>
                  </div>  
                  <div class="field has-addons">
                    <div class="control">
                      <a class="button is-static">
                        Background Color
                      </a>
                    </div>
                    <div class="control is-expanded">
                      <input 
                        class="input"
                        type="color" 
                        name="color"
                        value={this.state.form.color}
                        onInput={this.updateFormField}
                      />
                    </div>
                  </div>  
                </div>
              </div>

              {(mode === 'insert this later') ? (
                <div class="field is-horizontal">
                  <div class="field-label is-normal is-narrow">
                    <label class="label mt-1">Position</label>
                  </div>
                  <div class="field-body">        
                    <div class="field is-expanded">
                      <div class="field has-addons">
                        <div class="control">
                          <a class="button is-static">
                            Row
                          </a>
                        </div>                      
                        <div class="control is-expanded">
                          <input 
                            class="input"
                            type="number" 
                            name="parent_y"
                            min="1"
                            max={this.props.parentRecord.layoutHeightUnits || this.props.parentRecord.yUnits}
                            step="1"
                            value={this.state.form.parent_y}
                            onInput={this.updateFormField}
                          />
                        </div>
                      </div>
                    </div>  
                    <div class="field has-addons">
                      <div class="control">
                        <a class="button is-static">
                          Column
                        </a>
                      </div>
                      <div class="control is-expanded">
                        <input 
                          class="input"
                          type="number" 
                          name="parent_x"
                          min="1"
                          max={this.props.parentRecord.layoutWidthUnits || this.props.parentRecord.xUnits}
                          step="1"
                          value={this.state.form.parent_x}
                          onInput={this.updateFormField}
                        />
                      </div>
                    </div>  
                  </div>
                </div>
              ) : null }

              <div class="field is-horizontal">
                <div class="field-label is-normal is-narrow">
                  <label class="label mt-1">Dimensions</label>
                </div>
                <div class="field-body">        
                  <div class="field is-expanded">
                    <div class="field has-addons">
                      <div class="control">
                        <a class="button is-static">
                          Rows
                        </a>
                      </div>                      
                      <div class="control is-expanded">
                        {(this.props.selectedRecord.layoutHeightUnits === 0) ? (
                          <input 
                            class="input"
                            type="number" 
                            name="yUnits"
                            min="1"
                            step="1"
                            value={this.state.form.yUnits}
                            onInput={this.updateFormField}
                          />
                        ) : (
                          <input 
                            class="input"
                            type="number" 
                            name="layoutHeightUnits"
                            min="1"
                            step="1"
                            value={this.state.form.layoutHeightUnits}
                            onInput={this.updateFormField}
                          />
                        )} 
                      </div>
                    </div>
                  </div>  
                  <div class="field has-addons">
                    <div class="control">
                      <a class="button is-static">
                        Columns
                      </a>
                    </div>                    
                    <div class="control is-expanded">
                      {(this.props.selectedRecord.layoutWidthUnits === 0) ? (
                        <input 
                          class="input"
                          type="number" 
                          name="xUnits"
                          min="1"
                          step="1"
                          value={this.state.form.xUnits}
                          onInput={this.updateFormField}
                        />
                      ) : (
                        <input 
                          class="input"
                          type="number" 
                          name="layoutWidthUnits"
                          min="1"
                          step="1"
                          value={this.state.form.layoutWidthUnits}
                          onInput={this.updateFormField}
                        />
                      )}
                    </div>
                  </div>  
                </div>
              </div>

              <div class="field is-horizontal">
                <div class="field-label is-normal is-narrow">
                  <label class="label"></label>
                </div>
                <div class="field-body">
                  <div class="field">
                    <div class="control">
                      <button 
                        type="button"
                        class="button"
                        mode="view"
                        onClick={this.props.handleSetMode}
                      >
                        <span mode="view">Cancel</span>
                      </button>
                      <button type="submit" class="button is-success">Save</button>
                    </div>
                  </div>
                </div>
              </div>
            </form> 
          </div>

        </div>
      )
    }
  }
}  