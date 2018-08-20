import { h } from 'preact';
import ashnazg from 'ashnazg';

module.exports = function (Component) {

  const Breadcrumbs = require('./Breadcrumbs.js')(Component);
  const PanelToolbar = require('./PanelToolbar.js')(Component);
  
  return class PhysicalPanel extends Component {

    constructor(props) {
      super(props);
      this.state = {};
    }

    render() {
      const inventoryPath = this.props.inventoryPath || [];
      const selectedRecord = this.props.selectedRecord || {};
      return (
        <div class="PhysicalPanel panel">

          <div class="panel-heading">
            <i class="mdi mdi-flask"/>&nbsp;
            {selectedRecord && selectedRecord.name || 'Loading...'}
            <PanelToolbar {...this.props} />
          </div>

          <Breadcrumbs 
            selectedRecord={selectedRecord}
            inventoryPath={inventoryPath}
          />

          {(this.props.mode === 'view') ? (
            <div class="panel-block">
              Physical Profile
            </div>
          ) : null }

          {(this.props.mode === 'new') ? (
            <div class="panel-block">
              Physical New Instance
            </div>
          ) : null }

          {(this.props.mode === 'edit') ? (
            <div class="panel-block">
              Physical Edit
            </div>
          ) : null }

          {(this.props.mode === 'delete') ? (
            <div class="panel-block">
              Physical Delete Confirm
            </div>
          ) : null }   

        </div>
      );
    }

  }
}