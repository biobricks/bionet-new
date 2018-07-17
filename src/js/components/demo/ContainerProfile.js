import { h } from 'preact';
import { Link } from 'react-router-dom';

module.exports = function(Component) {

  return class ContainerProfile extends Component {

    constructor(props){
      super(props);
      this.onRecordEnter = this.onRecordEnter.bind(this);
      this.onRecordLeave = this.onRecordLeave.bind(this);
    }

    onRecordEnter(e) {
      let recordId = e.target.getAttribute('id');
      console.log(`entered ${recordId}`);
      this.props.setHoveredRecord(recordId);
    }

    onRecordLeave(e) {
      let recordId = e.target.getAttribute('id');
      console.log(`left ${recordId}`);
      this.props.setHoveredRecord(null);
    }

    render() {
      let selectedRecord = this.props.selectedRecord;
      let parentRecord = this.props.parentRecord;
      let children;
      if (this.props.selectedRecord.children) {
        children = this.props.selectedRecord.children.map((child, index) => {
          
          //let isContainer = Object.keys(child).indexOf('children') > -1;
          let isContainer = child.layoutHeightUnits && child.layoutWidthUnits && child.layoutHeightUnits > 1 && child.layoutWidthUnits > 1;

          let classNames = this.props.hoveredRecord && child.id === this.props.hoveredRecord.id ? "active panel-block" : "panel-block";
          return (
            <a
              to={`/ui/inventory/${child.id}`}
              class={classNames}
              id={child.id}
              onClick={this.props.onClickLink}
              //onMouseEnter={this.onRecordEnter}
              //onMouseLeave={this.onRecordLeave}
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
          );
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
                <div class="columns is-gapless profile">
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