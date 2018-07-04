import { h } from 'preact';
import { EBUSY } from 'constants';

module.exports = function(Component) {

  return class PhysicalProfile extends Component {

    render() {
      let selectedRecord = this.props.selectedRecord;
      let parentRecord = this.props.parentRecord;
      return (
        <div class="PhysicalProfile">
          <div class="panel-block">
            <div class="columns is-multiline">
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
                <div class="columns is-gapless">
                  <div class="column is-narrow">
                    <label class="label">Available</label>
                  </div>
                  <div class="column">   
                    {(selectedRecord.available) ? (
                      <span>Yes</span>
                    ) : (
                      <span>No</span>
                    )}
                  </div>
                </div>
              </div>
              <div class="column is-12">
                <div class="columns is-gapless">
                  <div class="column is-narrow">
                    <label class="label">License</label>
                  </div>
                  <div class="column">   
                    {selectedRecord.license}
                  </div>
                </div>
              </div>
              <div class="column is-12">
                <div class="columns is-gapless">
                  <div class="column is-narrow">
                    <label class="label">Provenance</label>
                  </div>
                  <div class="column">   
                    {selectedRecord.provenance}
                  </div>
                </div>
              </div> 
              <div class="column is-12">
                <div class="columns is-gapless">
                  <div class="column is-narrow">
                    <label class="label">Genotype</label>
                  </div>
                  <div class="column">   
                    {selectedRecord.genotype}
                  </div>
                </div>
              </div> 
              <div class="column is-12">
                <div class="columns is-gapless">
                  <div class="column is-narrow">
                    <label class="label">Sequence</label>
                  </div>
                  <div class="column">   
                    <span class="sequence">{selectedRecord.sequence}</span>
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