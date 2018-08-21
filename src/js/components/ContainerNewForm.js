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

    // static propTypes = {
    //   name: PropTypes.string,
    //   description: PropTypes.string,
    //   xUnits: PropTypes.number,
    //   yUnits: PropTypes.number,
    //   color: PropTypes.string,
    //   majorGridLine: PropTypes.number,
    //   viewOrientatoin: PropTypes.string
    // }
    
    constructor(props) {
      super(props);
      this.state = {
        form: {
          name: '',
          description: '',
          xUnits: 1,
          yUnits: 1,
          color: 'aqua',
          majorGridLine: 1,
          viewOrientation: 'top',
          parent_id: '',
          parent_x: 0,
          parent_y: 0
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

    // update(newProps) {
    //     const newState = Object.assign(this.state, newProps)
    //     this.setState(newState)
    //     if (this.props.onChange) this.props.onChange(newProps)
    //     //todo: ashnagz doesn't seem to be setting state correctly
    //     const gridItemSize=40
    //     app.state.ContainerNewForm={
    //         name: this.state.name,
    //         description: this.state.description,
    //         xUnits: this.state.xUnits,
    //         yUnits: this.state.yUnits,
    //         color:this.state.color,
    //         majorGridLine: this.state.majorGridLine
    //     }
    //     /*
    //     app.setState({
    //         ContainerNewForm:this.state
    //     })
    //     */
    // }
    // onName(e) {
    //     this.update({name:e.target.value})
    // }
    // onViewOrientation(e) {
    //     this.update({viewOrientation:e.target.value})
    // }
    // onDescription(e) {
    //     this.update({description:e.target.value})
    // }
    // onXUnits(e) {
    //     this.update({xUnits:Number(e.target.value)})
    // }
    // onYUnits(e) {
    //     this.update({yUnits:Number(e.target.value)})
    // }
    // onMajorGridLine(e) {
    //     this.update({majorGridLine:Number(e.target.value)})
    // }
    // onViewOrientation(e) {
    //     this.update({viewOrientation:e.target.value})
    // }
    // onColor(e) {
    //     this.update({color:e.target.value})
    // }


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
                  <label class="label">Columns</label>
                </div>
                <div class="field-body">        
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

              <div class="field is-horizontal">
                <div class="field-label is-normal is-narrow">
                  <label class="label">Rows</label>
                </div>
                <div class="field-body">        
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