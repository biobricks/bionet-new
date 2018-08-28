import { h } from 'preact';
import PropTypes from 'prop-types';

module.exports = function(Component) {

  return class ContainerNewForm extends Component {

    // static defaultProps = {
    //   name: '',
    //   description: '',
    //   xUnits: 1,
    //   yUnits: 1,
    //   color:'aqua',
    //   majorGridLine: 1,
    //   viewOrientation:'top'
    // }
    
    constructor(props) {
      super(props);
      this.state = {
        form: {
          name: '',
          description: '',
          xUnits: 1,
          yUnits: 1,
          fontSize: 16,
          color: '#00FFFF',
          majorGridLine: 1,
          viewOrientation: 'top',
          parent_id: '',
          parent_x: 0,
          parent_y: 0,
          parent_x_span: 1,
          parent_y_span: 1
        }
      };
      this.updateFormField = this.updateFormField.bind(this);
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
                        step="1"
                        value={this.state.form.parent_x}
                        onInput={this.updateFormField}
                      />
                    </div>
                  </div>  
                </div>
              </div>

              <div class="field is-horizontal">
                <div class="field-label is-normal is-narrow">
                  <label class="label mt-1">External Dimensions</label>
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
                          name="parent_y_span"
                          min="1"
                          step="1"
                          value={this.state.form.parent_y_span}
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
                        name="parent_x_span"
                        min="1"
                        step="1"
                        value={this.state.form.parent_x_span}
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