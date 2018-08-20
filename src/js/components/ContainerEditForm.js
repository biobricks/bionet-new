import { h } from 'preact';

module.exports = function(Component) {

  return class ContainerEditForm extends Component {

    constructor(props) {
      super(props);
      this.state = {
        form: {
          name: this.props.selectedRecord.name || '',
          description: this.props.selectedRecord.description || ''
        }
      };
      this.handleFormSubmit = this.handleFormSubmit.bind(this);
      this.updateFormField = this.updateFormField.bind(this);
    }

    handleFormSubmit(e) {
      e.preventDefault();
      const form = this.state.form;
      let container = this.props.selectedRecord;
      container.name = form.name;
      container.description = form.description;
      this.props.saveContainer(container);
      this.setState({
        form: {
          name: '',
          description: ''
        }
      });
    }

    updateFormField(e) {
      let fieldName = e.target.getAttribute('name');
      let form = this.state.form;
      form[fieldName] = e.target.value;
      this.setState({
        form
      });
    }

    render() {

      const selectedRecord = this.props.selectedRecord;

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
                <div class="field-label">

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