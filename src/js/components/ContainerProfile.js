import { h } from 'preact';
import { Link, Redirect } from 'react-router-dom';

module.exports = function(Component) {

  return class ContainerProfile extends Component {

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

      if (this.props && this.props.redirect && this.props.redirectTo){
        return (
          <Redirect to={this.props.redirectTo}/>
        );
      }

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
                  {selectedRecord.description || 'No description provided.'}
                </div>
              </div>
            </form>   
          </div>

          <div class="panel-block">                      
            <div class="columns">
              <div class="column">
                {(selectedRecord.children && selectedRecord.children.length > 0) ? (
                  <h5>Content</h5>
                ) : (
                  <h5>Empty</h5>
                )}
              </div>
            </div>
          </div>
          
          {children}

          <div class="panel-block"> 
            <pre>{JSON.stringify(this.props, null, 2)}</pre>
          </div>

        </div>
      )
    }
  }
}  