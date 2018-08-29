import { h } from 'preact';

module.exports = function(Component) {

  return class ContainerProfile extends Component {


    constructor(props){
      super(props);
      this.onRecordEnter = this.onRecordEnter.bind(this);
      this.onRecordLeave = this.onRecordLeave.bind(this);
    }

    onRecordEnter(e) {
      let recordId = e.target.getAttribute('id');
      if (this.props.onRecordEnter) this.props.onRecordEnter(recordId)
      //console.log(`Mouse Enter Record ${recordId}`);
    }

    onRecordLeave(e) {
      let recordId = e.target.getAttribute('id');
      if (this.props.onRecordLeave) this.props.onRecordLeave(recordId)
      //console.log(`Mouse Leaving Record ${recordId}`);
    }

    render() {
      let selectedRecord = this.props.selectedRecord;
      let parentRecord = this.props.parentRecord;
      let children=null
      if (!this.props.selectedRecord.children || !this.props.selectedRecord.children.length) {
          children=(
              <div>
                <br/>
                <h6>Container is currently empty.</h6>
              </div>
              )
      }
      else if (this.props.selectedRecord.children) {
            children = this.props.selectedRecord.children.map((child, index) => {
            //let isContainer = Object.keys(child).indexOf('children') > -1;
            let isContainer = child.type !== 'physical'
            return (
              <a 
                class="panel-block"
                id={child.id}
                onClick={this.props.selectRecord}
                onMouseEnter={this.onRecordEnter.bind(this)}
                onMouseLeave={this.onRecordLeave.bind(this)}
              >
                <span class="panel-icon">
                  {(isContainer) ? (
                    <i class="mdi mdi-grid"></i>
                  ) : (
                    <i class="mdi mdi-flask"></i>
                  )}  
                </span>
                {child.name} 
              </a>
            )
          });
        }
      return (
        <div class="ContainerProfile">
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
            </div>    
          </div>
          <div class="panel-block">                      
            <div class="columns">
              <div class="column">
                <h5>Content</h5>
              </div>
            </div>
          </div>

          {children}
        </div>
      )
    }
  }
}  