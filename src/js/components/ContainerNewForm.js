import { h } from 'preact';
import PropTypes from 'prop-types';

module.exports = function(Component) {

  return class ContainerNewForm extends Component {
    
    constructor(props) {
      super(props);
      this.state = {
        form: {
          name: this.props.newItemName || '',
          description: '',
          fontSize: 12,
          color: '#00FFFF',
          xUnits: 1,
          yUnits: 1,
          viewOrientation: 'top',
          parent_id: '',
          parent_x: this.props.newItemX,
          parent_y: this.props.newItemY,
          parent_x_span: 1,
          parent_y_span: 1
        }
      };
      this.updateFormField = this.updateFormField.bind(this);
      this.handleFormSubmit = this.handleFormSubmit.bind(this);
    }

    updateFormField(e) {
      let fieldName = e.target.getAttribute('name');
      let form = this.state.form;
      if(fieldName === 'xUnits' || fieldName === 'yUnits'){
        form[fieldName] = Number(e.target.value);
      } else {
        form[fieldName] = e.target.value;
      }  
      this.setState({
        form
      });
    }

    handleFormSubmit(e) {
      e.preventDefault();
      const form = this.state.form;
      let container = this.state.form;
      for(let i = 0; i < Object.keys(form).length; i++){
        let formKey = Object.keys(form)[i];
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
      this.props.saveNewContainer(container);
      this.setState({
        form: {
          name: '',
          description: '',
          fontSize: 12,
          color: '#00FFFF',
          xUnits: 1,
          yUnits: 1,
          viewOrientation: 'top',
          parent_id: '',
          parent_x: 0,
          parent_y: 0,
          parent_x_span: 1,
          parent_y_span: 1
        }
      });     
    }

    render() {

      return (
        <div class="ContainerNewForm Restructured">
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
                      autocomplete={false}
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
                  ></textarea>
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
                        min="1"
                        step="1"
                        value={this.state.form.color}
                        onInput={this.updateFormField}
                      />
                    </div>
                  </div>  
                </div>
              </div>

              <div class="field is-horizontal">
                <div class="field-label is-normal is-narrow">
                  <label class="label mt-1">Internal Dimensions</label>
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
                        <input 
                          class="input"
                          type="number" 
                          name="yUnits"
                          min="1"
                          step="1"
                          value={this.state.form.yUnits}
                          onInput={this.updateFormField}
                        />
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
                      <input 
                        class="input"
                        type="number" 
                        name="xUnits"
                        min="1"
                        step="1"
                        value={this.state.form.xUnits}
                        onInput={this.updateFormField}
                      />
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