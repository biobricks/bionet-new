import { h } from 'preact';

module.exports = function(Component) {

  return class PhysicalProfile extends Component {

    render() {
      let selectedRecord = this.props.selectedRecord;
      let parentRecord = this.props.parentRecord;
      return (
        <div class="PhysicalProfile">
          <div class="panel-block">
            <div class="columns is-multiline is-gapless">
              <div class="column is-12">
                <div class="columns is-gapless">
                  <div class="column is-narrow">
                    <label class="label">Name</label>
                  </div>
                  <div class="column">   
                    {selectedRecord.name}
                  </div>
                </div>
              </div>
              <div class="column is-12">
                <div class="columns is-gapless">
                  <div class="column is-narrow">
                    <label class="label">Description</label>
                  </div>
                  <div class="column">   
                    {selectedRecord.description}
                  </div>
                </div>
              </div>
              <div class="column is-12">
                <div class="columns is-mobile">
                  <div class="column is-narrow">
                    <label class="label">Location</label>
                  </div>
                  <div class="column">   
                    {parentRecord.name} - Row {selectedRecord.row}, Col {selectedRecord.column}
                  </div>
                </div>
              </div>              
            </div>    
          </div>
        </div>
      )
    }
  }
}  