import { h } from 'preact';
import { Link } from 'react-router-dom';

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

      const children = selectedRecord && selectedRecord.children && selectedRecord.children.map((child, index) => {
        const hasParentId = Object.keys(child).indexOf('parent_id') > -1;
        const hasVirtualId = Object.keys(child).indexOf('virtual_id') > -1;
        const isContainer = hasParentId && !hasVirtualId;
        return (
          <Link
            to={`/ui/inventory/${child.id}`}
            class="panel-block"
            id={child.id}
          >
            <span class="panel-icon">
              {(isContainer) ? (
                <i class="mdi mdi-grid"></i>
              ) : (
                <i class="mdi mdi-flask"></i>
              )}  
            </span>
            {child.name} 
          </Link>
        );
      });

      return (
        <div class="ContainerProfile Restructured">
          
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
            </form>   
          </div>

        </div>
      )
    }
  }
}  