import { h } from 'preact';
import ashnazg from 'ashnazg';

module.exports = function (Component) {

  const Breadcrumbs = require('./Breadcrumbs.js')(Component);
  const PanelToolbar = require('./PanelToolbar.js')(Component);
  const Message = require('./Message.js')(Component);
  const LabProfile = require('./LabProfile.js')(Component);

  return class LabPanel extends Component {

    constructor(props) {
      super(props);
      this.state = {};
    }

    render() {

      const inventoryPath = this.props.inventoryPath || [];
      const selectedRecord = this.props.selectedRecord || {};
      const alertTypeExists = this.props.alert && this.props.alert.type && this.props.alert.type.length > 0;
      const alertMessageExists = this.props.alert && this.props.alert.message && this.props.alert.message.length > 0;
      const alertExists = alertTypeExists && alertMessageExists;

      return (
        <div class="panel">
          
          <div class="panel-heading">
            <i class="mdi mdi-home-outline"/>&nbsp;
            {selectedRecord && selectedRecord.name || 'Loading...'}
            <PanelToolbar {...this.props} />
          </div>

          <Breadcrumbs 
            selectedRecord={selectedRecord}
            inventoryPath={inventoryPath}
          />

          {(alertExists) ? (
            <Message
              alert={this.props.alert}
              removeAlert={this.props.removeAlert}
            />         
          ) : null }

          {(this.props.mode === 'view') ? (
            <LabProfile
              selectedRecord={selectedRecord}
            />
          ) : null }

          {(this.props.mode === 'new') ? (
            <div class="panel-block">
              Lab New Item
            </div>
          ) : null }

          {(this.props.mode === 'edit') ? (
            <div class="panel-block">
              Lab Edit
            </div>
          ) : null }

          {(this.props.mode === 'delete') ? (
            <div class="panel-block">
              Lab Reset Confirm
            </div>
          ) : null }

        </div>
      );
    }

  }
}