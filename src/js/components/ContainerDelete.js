import { h } from 'preact';
import { Redirect } from 'react-router-dom';

module.exports = function(Component) {

  return class ContainerDelete extends Component {

    constructor(props) {
      super(props);
      this.state = {
        redirect: false,
        redirectTo: ''
      };
      this.handleFormSubmit = this.handleFormSubmit.bind(this);
    }

    handleFormSubmit(e) {
      e.preventDefault();
      const selectedRecord = this.props.selectedRecord;
      const inventoryPath = this.props.inventoryPath;
      const parentRecord = inventoryPath[inventoryPath.length - 2];
      this.props.deleteContainer(selectedRecord, parentRecord);
      this.setState({
        redirect: true,
        redirectTo: `/inventory/${parentRecord.id}`
      });
    }

    
    render() {

      const selectedRecord = this.props.selectedRecord;

      if (this.state.redirect && this.state.redirectTo){
        return (
          <Redirect to={this.state.redirectTo}/>
        );
      }

      return (
        <div class="ContainerDelete">
          <div class="panel-block">
            <form onSubmit={this.handleFormSubmit}>

              <div class="field is-horizontal">
                <div class="field-label is-normal is-narrow">
                  <label class="label">Confirm Delete</label>
                </div>
                <div class="field-body">
                  <div class="control">
                    Are you <strong>sure</strong> you want to delete {selectedRecord.name}?
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
                        mode="edit"
                        onClick={this.props.handleSetMode}
                      >
                        <span mode="edit">Cancel</span>
                      </button>
                      <button type="submit" class="button is-danger">Delete</button>
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