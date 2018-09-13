import { h } from 'preact';
import ashnazg from 'ashnazg';

module.exports = function (Component) {

  const PanelToolbar = require('./PanelToolbar.js')(Component);
  const Message = require('./Message.js')(Component);
  const VirtualProfile = require('./VirtualProfile.js')(Component);
  const VirtualEditForm = require('./VirtualEditForm.js')(Component);
  
  return class VirtualPanel extends Component {

    constructor(props) {
      super(props);
      this.state = {};
    }

    render() {
      const inventoryPath = this.props.inventoryPath || [];
      const selectedRecord = this.props.selectedRecord || {};
      const virtualRecord = this.props.virtualRecord || {};
      const alertTypeExists = this.props.alert && this.props.alert.type && this.props.alert.type.length > 0;
      const alertMessageExists = this.props.alert && this.props.alert.message && this.props.alert.message.length > 0;
      const alertExists = alertTypeExists && alertMessageExists;
      return (
        <div class="VirtualPanel panel">
          
          <div class="panel-heading">
            <i class="mdi mdi-dna"/>&nbsp;
            {selectedRecord && selectedRecord.name || 'Loading...'}
            <PanelToolbar {...this.props} />
          </div>

          {(alertExists) ? (
            <Message
              alert={this.props.alert}
              removeAlert={this.props.removeAlert}
            />         
          ) : null }

          {(this.props.mode === 'view') ? (
            <VirtualProfile
              selectedRecord={selectedRecord}
              virtualRecord={virtualRecord}
            />
          ) : null }

          {(this.props.mode === 'new') ? (
            <div class="panel-block">
              Virtual New Instance
            </div>
          ) : null }

          {(this.props.mode === 'edit') ? (
            <VirtualEditForm
              selectedRecord={selectedRecord}
              virtualRecord={virtualRecord}
              handleSetMode={this.props.handleSetMode}
              saveVirtual={this.props.saveVirtual}
            />
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