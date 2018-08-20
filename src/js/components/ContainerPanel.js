import { h } from 'preact';
import ashnazg from 'ashnazg';

module.exports = function (Component) {

  const Breadcrumbs = require('./Breadcrumbs.js')(Component);
  const PanelToolbar = require('./PanelToolbar.js')(Component);
  const Message = require('./Message.js')(Component);
  const ContainerProfile = require('./ContainerProfile.js')(Component);
  const ContainerEditForm = require('./ContainerEditForm.js')(Component);
  const ContainerDelete = require('./ContainerDelete.js')(Component);

  return class ContainerPanel extends Component {

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
        <div class="ContainerPanel panel">

          <div class="panel-heading">
            <i class="mdi mdi-grid"/>&nbsp;
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
            <ContainerProfile
              selectedRecord={selectedRecord}
            />
          ) : null }

          {(this.props.mode === 'new') ? (
            <div class="panel-block">
              Container New Item
            </div>
          ) : null }

          {(this.props.mode === 'edit') ? (
            <ContainerEditForm
              selectedRecord={selectedRecord}
              saveContainer={this.props.saveContainer}
              handleSetMode={this.props.handleSetMode}
            />
          ) : null }

          {(this.props.mode === 'delete') ? (
            <ContainerDelete
              selectedRecord={selectedRecord}
              saveContainer={this.props.saveContainer}
              deleteContainer={this.props.deleteContainer}
              handleSetMode={this.props.handleSetMode}
              inventoryPath={inventoryPath}
            />
          ) : null }          

        </div>
      );
    }

  }
}