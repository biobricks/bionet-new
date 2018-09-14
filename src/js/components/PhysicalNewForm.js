import { h } from 'preact';
import PropTypes from 'prop-types';

module.exports = function(Component) {

  return class PhysicalNewForm extends Component {
    
    constructor(props) {
      super(props);
      this.state = {
        form: {
          name: '',
          description: '',
          fontSize: 12,
          color: '#00ffff',
          parent_x: this.props.newItemX,
          parent_y: this.props.newItemY,
          parent_x_span: 1,
          parent_y_span: 1,
          isAvailable: false,
          freeGenes: false,
          freeGenesStage: 0,
          provenance: '',
          sequence: '',
          genotype: '',
          license: ''
        }
      };
      this.updateFormField = this.updateFormField.bind(this);
      this.handleFormSubmit = this.handleFormSubmit.bind(this);
    }

    updateFormField(e) {      
      const fieldName = e.target.getAttribute('name');
      const fieldType = e.target.getAttribute('type');
      let form = this.state.form;
      
      switch (fieldType) {
        case 'text':
          form[fieldName] = e.target.value;
          break;
        case 'textarea':
          form[fieldName] = e.target.value;
          break;
        case 'color':
          form[fieldName] = e.target.value;
          break;
        case 'select':
          form[fieldName] = e.target.value;
          break;    
        case 'number':
          form[fieldName] = Number(e.target.value);
          break;
        case 'radio':
          form[fieldName] = e.target.value === 'true' ? true : false;
          break;
        default:
          form[fieldName] = e.target.value;
      }
      this.setState({
        form
      });
    }

    handleFormSubmit(e) {
      e.preventDefault();
      const form = this.state.form;
      let physical = {
        name: form.name + '_0',
        type: 'physical',
        description: form.description,
        fontSize: form.fontSize,
        color: form.color,
        parent_x: Number(form.parent_x),
        parent_y: Number(form.parent_y),
        parent_x_span: form.parent_x_span,
        parent_y_span: form.parent_y_span
      };
      let virtual = {
        name: form.name,
        type: 'virtual',
        description: form.description,
        isAvailable: form.isAvailable,
        freeGenes: form.freeGenes,
        freeGenesStage: Number(form.freeGenesStage),
        provenance: form.provenance,
        sequence: form.sequence.toUpperCase(),
        genotype: form.genotype,
        license: form.license
      };
      this.props.saveNewPhysical(virtual, physical);
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
                      placeholder="Physical Name"
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
                    type="textarea"
                    name="description"
                    value={this.state.form.description}
                    placeholder="A short description of the physical."
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
                  <label class="label">Is Available</label>
                </div>
                <div class="field-body">        
                  <div class="control">
                    <label class="radio">
                      <input 
                        type="radio" 
                        name="isAvailable" 
                        checked={this.state.form.isAvailable === true}
                        onClick={this.updateFormField}
                        value="true"
                      />
                      Yes
                    </label>
                    <label class="radio">
                      <input 
                        type="radio" 
                        name="isAvailable" 
                        checked={this.state.form.isAvailable === false}
                        onClick={this.updateFormField}
                        value="false"
                      />
                      No
                    </label>
                  </div>
                </div>    
              </div>

              <div class="field is-horizontal">
                <div class="field-label is-normal is-narrow">
                  <label class="label">Submitted To FreeGenes?</label>
                </div>
                <div class="field-body">        
                  <div class="control">
                    <label class="radio">
                      <input 
                        type="radio" 
                        name="freeGenes" 
                        checked={this.state.form.freeGenes === true}
                        onClick={this.updateFormField}
                        value="true"
                      />
                      Yes
                    </label>
                    <label class="radio">
                      <input 
                        type="radio" 
                        name="freeGenes" 
                        checked={this.state.form.freeGenes === false}
                        onClick={this.updateFormField}
                        value="false"
                      />
                      No
                    </label>
                  </div>
                </div>    
              </div>

              <div class="field is-horizontal">
                <div class="field-label is-normal is-narrow">
                  <label class="label">FreeGenes Stage</label>
                </div>
                <div class="field-body">        
                  <div class="select">
                    <select 
                      name="freeGenesStage"
                      type="select"
                      onChange={this.updateFormField}
                    >
                      <option 
                        value="0" 
                        selected={!this.state.form.freeGenesStage || this.state.form.freeGenesStage === 0}
                      >0 - Not Submitted</option>
                      <option value="1" selected={this.state.form.freeGenesStage === 1}>1 - Submitted</option>
                      <option value="2" selected={this.state.form.freeGenesStage === 2}>2 - Optimizing</option>
                      <option value="3" selected={this.state.form.freeGenesStage === 3}>3 - Synthesizing</option>
                      <option value="4" selected={this.state.form.freeGenesStage === 4}>4 - Cloning</option>
                      <option value="5" selected={this.state.form.freeGenesStage === 5}>5 - Sequencing</option>
                      <option value="6" selected={this.state.form.freeGenesStage === 6}>6 - Ready</option>
                      <option value="7" selected={this.state.form.freeGenesStage === 7}>7 - Delivered</option>
                    </select>
                  </div>
                </div>    
              </div>

              <div class="field is-horizontal">
                <div class="field-label is-normal is-narrow">
                  <label class="label">Provenance</label>
                </div>
                <div class="field-body">
                    <input 
                      class="input"
                      type="text" 
                      name="provenance"
                      value={this.state.form.provenance}
                      placeholder="provenance"
                      onInput={this.updateFormField}
                    />
                </div>
              </div>

              <div class="field is-horizontal">
                <div class="field-label is-normal is-narrow">
                  <label class="label">Genotype</label>
                </div>
                <div class="field-body">
                    <input 
                      class="input"
                      type="text" 
                      name="genotype"
                      value={this.state.form.genotype}
                      placeholder="genotype"
                      onInput={this.updateFormField}
                    />
                </div>
              </div>              

              <div class="field is-horizontal">
                <div class="field-label is-normal is-narrow">
                  <label class="label">Sequence</label>
                </div>
                <div class="field-body">        
                  <textarea 
                    class="textarea" 
                    name="sequence"
                    value={this.state.form.sequence}
                    placeholder="AGTCAGTCAGTCAGTCAGTCAGTCAGTCAGTCAGTCAGTCAGTCAGTCAGTCAGTCAGTCAGTC"
                    rows="4"
                    onInput={this.updateFormField}
                  >{this.state.form.sequence}</textarea>
                </div>
              </div>

              <div class="field is-horizontal">
                <div class="field-label is-normal is-narrow">
                  <label class="label">License</label>
                </div>
                <div class="field-body">        
                  <div class="select">
                    <select 
                      name="license"
                      onChange={this.updateFormField}
                    >
                      <option value="OpenMTA" selected={this.state.form.license === "OpenMTA"}>OpenMTA</option>
                      <option value="UBMTA" selected={this.state.form.license === "UBMTA"}>UBMTA</option>
                      <option value="Limbo" selected={!this.state.form.license || this.state.form.license === "Limbo"}>Limbo</option>
                    </select>
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