import { h } from 'preact';
import { timingSafeEqual } from 'crypto';

module.exports = function(Component) {

  const ContainerNewForm = require('./ContainerNewForm.js')(Component);

  return class ContainerNewItem extends Component {

    constructor(props) {
      super(props);
      this.state = {
        formType: ''
      };
      this.handleSetFormType = this.handleSetFormType.bind(this);
    }

    handleSetFormType(e) {
      let formType = e.target.getAttribute('formtype');
      this.setState({ formType });
    }

    render() {

      const selectedRecord = this.props.selectedRecord;

      return (
        <div class="ContainerNewItem">
          
          <div class="panel-block">
            <form>
              <div class="field is-horizontal">
                <div class="field-label is-normal is-narrow">
                  <label class="label">
                    Item Type
                    {(this.state.formType === '') ? (
                      <span><br/>(select one)</span>
                    ) : null }
                  </label>
                </div>
                <div class="field-body">
                  <div class="control">
                    <label class="radio">
                      <input 
                        type="radio" 
                        name="formType" 
                        checked={this.state.formType === 'container'}
                        formtype="container"
                        onClick={this.handleSetFormType}
                      />
                      Container
                    </label>
                    <label class="radio">
                      <input 
                        type="radio" 
                        name="formType" 
                        checked={this.state.formType === 'physical'}
                        formtype="physical"
                        onClick={this.handleSetFormType}
                      />
                      Physical
                    </label>
                  </div>                    
                </div>
              </div>
            </form> 
          </div>

          {(this.state.formType === 'container' && this.props.newItemX > 0) ? (
            <ContainerNewForm
              {...this.props}
              newItemX={this.props.newItemX}
              newItemY={this.props.newItemY}
            />
          ) : null }

          {(this.state.formType === 'container' && this.props.newItemX === 0) ? (
            <div class="panel-block">
              <p>Please select an empty location for the new container.</p>
            </div>
          ) : null }

          {(this.state.formType === 'physical') ? (
            <div class="panel-block">
              Physical New Form
            </div>
          ) : null }

        </div>
      )
    }
  }
}  