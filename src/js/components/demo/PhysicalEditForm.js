import { h } from 'preact';

module.exports = function(Component) {

  return class PhysicalEditForm extends Component {

    render() {
      let selectedRecord = this.props.selectedRecord;
      let parentRecord = this.props.parentRecord;
      return (
        <div class="PhysicalEditForm">
          <div class="panel-block">

            <div class="columns is-multiline is-gapless">
              <div class="column is-12">
                <div class="columns is-mobile">
                  <div class="column is-narrow">
                    <label class="label">Name</label>
                  </div>
                  <div class="column">   
                    <input 
                      class="input is-small"
                      type="text" 
                      value={selectedRecord.name}
                    />
                  </div>
                </div>
              </div>
              <div class="column is-12">
                <div class="columns is-gapless">
                  <div class="column is-narrow">
                    <label class="label">Description</label>
                  </div>
                  <div class="column">   
                    <textarea 
                      class="textarea is-small" 
                      value={selectedRecord.description}
                      rows="2"
                    >{selectedRecord.description}</textarea>
                  </div>
                </div>
              </div>              
              <div class="column is-12">
                <div class="columns is-mobile">
                  <div class="column is-narrow">
                    <label class="label">Location</label>
                  </div>
                </div>
              </div>
              <div class="column is-12">
                <div class="columns is-gapless">
                  <div class="column is-narrow">
                    <label class="label">Row</label>
                  </div>
                  <div class="column">   
                    <input 
                      class="input is-small"
                      type="number" 
                      value={selectedRecord.row}
                    />
                  </div>
                </div>
              </div>
              <div class="column is-12">
                <div class="columns is-gapless">
                  <div class="column is-narrow">
                    <label class="label">Column</label>
                  </div>
                  <div class="column">   
                    <input 
                      class="input is-small"
                      type="number" 
                      value={selectedRecord.column}
                    />
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