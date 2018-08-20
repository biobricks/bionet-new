import { h } from 'preact';
import ashnazg from 'ashnazg';

module.exports = function (Component) {

  const Breadcrumbs = require('./Breadcrumbs.js')(Component);
  const PanelToolbar = require('./PanelToolbar.js')(Component);
  
  return class VirtualPanel extends Component {

    constructor(props) {
      super(props);
      this.state = {};
    }

    render() {
      const inventoryPath = this.props.inventoryPath || [];
      const selectedRecord = this.props.selectedRecord || {};
      return (
        <div class="VirtualPanel panel">
          
          <div class="panel-heading">
            <i class="mdi mdi-dna"/>&nbsp;
            {selectedRecord && selectedRecord.name || 'Loading...'}
            <PanelToolbar {...this.props} />
          </div>

          <Breadcrumbs 
            selectedRecord={selectedRecord}
            inventoryPath={inventoryPath}
          />

          {(this.props.mode === 'view') ? (
            <div class="panel-block">
              Virtual Profile
            </div>
          ) : null }

          {(this.props.mode === 'new') ? (
            <div class="panel-block">
              Virtual New Instance
            </div>
          ) : null }

          {(this.props.mode === 'edit') ? (
            <div class="panel-block">
              Virtual Edit
            </div>
          ) : null }

          {(this.props.mode === 'delete') ? (
            <div class="panel-block">
              Virtual Delete Confirm
            </div>
          ) : null } 

        </div>
      );
    }

  }
}