import { h } from 'preact';
import { Link } from 'react-router-dom';

module.exports = function(Component) {

  return class DataPanel extends Component {
	  render() {
      let parentRecord = this.props.parentRecord;
      let hasParentRecord = parentRecord && Object.keys(parentRecord).length > 0;
      let parentRecordIsLab = hasParentRecord && parentRecord.name === this.props.lab.name; 
      return (
        <div class="DataPanel panel has-background-white">
          <div class="panel-heading">
            <div class="is-block">
              <div class="columns is-gapless">
                <div class="column">
                  {this.props.selectedRecord.name}
                  {(hasParentRecord) ? (
                    <div class="toolbox is-pulled-right">
                      <div class="buttons has-addons">
                        <span class="button is-small is-success">
                          <i class="mdi mdi-plus"></i>
                        </span>
                        <span class="button is-small is-link">
                          <i class="mdi mdi-pencil"></i>
                        </span>
                      </div>
                    </div>
                  ) : null }  
                </div>
              </div>    
            </div>
          </div>

          <div class="panel-block">
            {(hasParentRecord) ? (
              <nav class="breadcrumb has-succeeds-separator" aria-label="breadcrumbs">
                <ul>
                  <li>
                    <Link to="/ui/lab">
                      {this.props.lab.name}
                    </Link>
                  </li>
                  {(!parentRecordIsLab) ? (
                    <div>
                      <li class="elipses">...</li>                 
                      <li>
                        <a>{this.props.parentRecord.name}</a>
                      </li>
                    </div>                  
                  ) : (
                    <li class="is-active">{this.props.selectedRecord.name}</li>
                  )}
                </ul>
              </nav>
            ) : null }  
          </div>
          <div class="panel-block">
            Status
          </div>
        </div>
      )
    }
  }
}
