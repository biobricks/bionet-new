import { h } from 'preact';
import { Link } from 'react-router-dom';
import moment from 'moment';

module.exports = function(Component) {

  return class PhysicalProfile extends Component {

    constructor(props) {
      super(props);
      //this.onRecordEnter = this.onRecordEnter.bind(this);
      //this.onRecordLeave = this.onRecordLeave.bind(this);
    }

    // onRecordEnter(e) {
    //   let recordId = e.target.getAttribute('id');
    //   //console.log(`entered ${recordId}`);
    //   this.props.setHoveredRecord(recordId);
    // }

    // onRecordLeave(e) {
    //   let recordId = e.target.getAttribute('id');
    //   //console.log(`left ${recordId}`);
    //   this.props.setHoveredRecord(null);
    // }

    render() {

      const selectedRecord = this.props && this.props.selectedRecord;
      const virtualRecord = this.props && this.props.virtualRecord;
      const freeGeneStages = ['Not Submitted', 'Submitted', 'Optimizing', 'Synthesizing', 'Cloning', 'Sequencing', 'Shipping', 'Delivered'];
      const freeGeneStage = virtualRecord.freeGenes ? freeGeneStages[virtualRecord.freeGenesStage] : freeGeneStages[0];

      const children = selectedRecord && selectedRecord.children && selectedRecord.children.map((child, index) => {
        return (
          <Link
            to={`/inventory/${child.id}`}
            class="panel-block"
            id={child.id}
          >
            <span class="panel-icon">
              <i class="mdi mdi-flask"></i>
            </span>
            {child.name} 
          </Link>          
        );
      });

      return (
        <div class="PhysicalProfile Restructured">
          
          <div class="panel-block">
            <form>
              <div class="field is-horizontal">
                <div class="field-label is-normal is-narrow">
                  <label class="label">Name</label>
                </div>
                <div class="field-body">
                  {selectedRecord.name}
                </div>
              </div>
              <div class="field is-horizontal">
                <div class="field-label is-normal is-narrow">
                  <label class="label">Description</label>
                </div>
                <div class="field-body">
                  {selectedRecord.description || virtualRecord.description || 'No description provided.'}
                </div>
              </div>        
              <div class="field is-horizontal">
                <div class="field-label is-normal is-narrow">
                  <label class="label">Is Available?</label>
                </div>
                <div class="field-body">
                  {virtualRecord.isAvailable ? (
                    <i class="mdi mdi-18px mdi-check has-text-success" />
                  ) : null}
                </div>
              </div>
              <div class="field is-horizontal">
                <div class="field-label is-normal is-narrow">
                  <label class="label">Submitted To Free Genes?</label>
                </div>
                <div class="field-body">
                  {virtualRecord.freeGenes ? (
                    <i class="mdi mdi-18px mdi-check has-text-success" />
                  ) : (
                    <i class="mdi mdi-18px mdi-close has-text-danger" />
                  )}
                </div>
              </div>
              {(virtualRecord.freeGenes) ? (
                <div class="field is-horizontal">
                  <div class="field-label is-normal is-narrow">
                    <label class="label">Free Genes Stage</label>
                  </div>
                  <div class="field-body">
                    {virtualRecord.freeGenesStage} - {freeGeneStage}
                  </div>
                </div>                
              ) : null}
              <div class="field is-horizontal">
                <div class="field-label is-normal is-narrow">
                  <label class="label">Provenance</label>
                </div>
                <div class="field-body">
                  {virtualRecord.provenance || 'No provenance provided.'}
                </div>
              </div>
              <div class="field is-horizontal">
                <div class="field-label is-normal is-narrow">
                  <label class="label">Genotype</label>
                </div>
                <div class="field-body">
                  {virtualRecord.genotype || 'No genotype provided.'}
                </div>
              </div>
              <div class="field is-horizontal">
                <div class="field-label is-normal is-narrow">
                  <label class="label">Sequence</label>
                </div>
                <div class="field-body" style={{'wordBreak': 'break-all'}}>
                  {virtualRecord.sequence || 'No sequence provided.'}
                </div>
              </div>
              <div class="field is-horizontal">
                <div class="field-label is-normal is-narrow">
                  <label class="label">License</label>
                </div>
                <div class="field-body">
                  {selectedRecord.license || "Limbo"}
                </div>
              </div>
              <div class="field is-horizontal">
                <div class="field-label is-normal is-narrow">
                  <label class="label">Created</label>
                </div>
                <div class="field-body">
                  {moment.unix(selectedRecord.created.time).format("MMM Do, YYYY")} by {selectedRecord.created.user}
                </div>
              </div>
              <div class="field is-horizontal">
                <div class="field-label is-normal is-narrow">
                  <label class="label">Updated</label>
                </div>
                <div class="field-body">
                  {moment.unix(selectedRecord.updated.time).format("MMM Do, YYYY")} by {selectedRecord.updated.user}
                </div>
              </div>              
            </form>   
          </div>

          <div class="panel-block">                      
            <div class="columns">
              <div class="column">
                {(selectedRecord.children && selectedRecord.children.length > 0) ? (
                  <h5>Physical Instances</h5>
                ) : (
                  <h5>No Physical Instances</h5>
                )}
              </div>
            </div>
          </div>
          
          {children}

        </div>
      )
    }
  }
}  