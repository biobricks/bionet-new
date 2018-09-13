import { h } from 'preact';

module.exports = function(Component) {

  return class VirtualEditForm extends Component {

    constructor(props) {
      super(props);
      this.state = {
        form: {
          name: this.props.selectedRecord.name || '',
          description: this.props.selectedRecord.description || '',
          isAvailable: this.props.selectedRecord.isAvailable || false,
          freeGenes: this.props.selectedRecord.freeGenes || false,
          freeGenesStage: this.props.selectedRecord.freeGenesStage || 0,
          provenance: this.props.selectedRecord.provenance,
          sequence: this.props.selectedRecord.sequence || '',
          genotype: this.props.selectedRecord.genotype || '' 
        }
      };
      this.handleFormSubmit = this.handleFormSubmit.bind(this);
      this.updateFormField = this.updateFormField.bind(this);
      this.updateFormRadio = this.updateFormRadio.bind(this);
    }

    handleFormSubmit(e) {
      e.preventDefault();
      const form = this.state.form;
      let virtual = this.props.selectedRecord;
      for(let i = 0; i < Object.keys(this.state.form).length; i++ ){
        let formKey = Object.keys(this.state.form)[i];
        let formValue;
        if (
          formKey === 'name' || 
          formKey === 'description' || 
          formKey === 'provenance' ||
          formKey === 'genotype' ||
          formKey === 'sequence' ||
          formKey === 'isAvailable' || 
          formKey === 'freeGenes'
        ) {
          formValue = form[formKey];
        } else if (formKey === 'freeGenesStage') {
          formValue = parseInt(form[formKey]);
        }
        virtual[formKey] = formValue;
      }
      this.props.saveVirtual(virtual, true);
      this.setState({
        form: {
          name: this.props.selectedRecord.name || '',
          description: this.props.selectedRecord.description || '',
          isAvailable: this.props.selectedRecord.isAvailable || false,
          freeGenes: this.props.selectedRecord.freeGenes || false,
          freeGenesStage: this.props.selectedRecord.freeGenesStage || 0,
          provenance: this.props.selectedRecord.provenance,
          sequence: this.props.selectedRecord.sequence || '',
          genotype: this.props.selectedRecord.genotype || '' 
        }
      });
    }

    updateFormField(e) {
      let virtual = this.props.selectedRecord;
      const fieldName = e.target.getAttribute('name');
      const fieldType = e.target.getAttribute('type');
      let form = this.state.form;
      
      form[fieldName] = e.target.value;
      this.setState({
        form
      });
      // for(let i = 0; i < Object.keys(this.state.form).length; i++ ){
      //   let formKey = Object.keys(this.state.form)[i];
      //   let formValue;
      //   if (
      //     formKey === 'name' || 
      //     formKey === 'description' || 
      //     formKey === 'provenance' ||
      //     formKey === 'genotype' ||
      //     formKey === 'sequence' 
      //   ) {
      //     formValue = form[formKey];
      //   } else if (formKey === 'freeGenesStage') {
      //     formValue = parseInt(form[formKey]);
      //   } else if (formKey === 'isAvailable' || formKey === 'freeGenes') {
      //     formValue = form[formKey] === 'true' ? true : false;
      //   }
      //   virtual[formKey] = formValue;
      // }
      // this.props.updateSelectedRecord(container);
    }

    updateFormRadio(e) {
      const fieldName = e.target.getAttribute('name');
      let form = this.state.form;
      form[fieldName] = e.target.value === 'true' ? true : false;
      this.setState({
        form
      });      
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
                      placeholder={"Virtual Name"}
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
                    placeholder="A short description of the Virtual."
                    rows="1"
                    onInput={this.updateFormField}
                  >{selectedRecord.description}</textarea>
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
                        onClick={this.updateFormRadio}
                        value="true"
                      />
                      Yes
                    </label>
                    <label class="radio">
                      <input 
                        type="radio" 
                        name="isAvailable" 
                        checked={this.state.form.isAvailable === false}
                        onClick={this.updateFormRadio}
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
                        onClick={this.updateFormRadio}
                        value="true"
                      />
                      Yes
                    </label>
                    <label class="radio">
                      <input 
                        type="radio" 
                        name="freeGenes" 
                        checked={this.state.form.freeGenes === false}
                        onClick={this.updateFormRadio}
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