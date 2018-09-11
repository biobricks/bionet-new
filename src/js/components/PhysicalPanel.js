import { h } from 'preact';
import ashnazg from 'ashnazg';
import moment from 'moment';

module.exports = function (Component) {

  const Breadcrumbs = require('./Breadcrumbs.js')(Component);
  const PanelToolbar = require('./PanelToolbar.js')(Component);
  const Message = require('./Message.js')(Component);
  const PhysicalProfile = require('./PhysicalProfile.js')(Component);
  const PhysicalEditForm = require('./PhysicalEditForm.js')(Component);
  
  return class PhysicalPanel extends Component {

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
      
      let panelTitle = "Loading ...";
      if (selectedRecord && Object.keys(selectedRecord).length > 0) {
        switch (this.props.mode) {
          case 'view':
            panelTitle = `${selectedRecord.name}` || panelTitle;
            break;
          case 'new':
            panelTitle = `New Instances Of ${selectedRecord.name}` || panelTitle;
            break;
          case 'edit':
            panelTitle = `Edit ${selectedRecord.name}` || panelTitle;
            break;
          case 'delete':
            panelTitle = `Delete ${selectedRecord.name}` || panelTitle;
            break;
          default:
            panelTitle = 'Loading...';
        }
      }      
      
      
      return (
        <div class="PhysicalPanel panel">

          <div class="panel-heading">
            <i class="mdi mdi-flask"/>&nbsp;
            {panelTitle}
            <PanelToolbar {...this.props} />
          </div>

          {(this.props.mode === 'view' && !alertExists) ? (
            <Breadcrumbs 
              selectedRecord={selectedRecord}
              inventoryPath={inventoryPath}
            />
          ) : null }

          {(alertExists) ? (
            <Message
              alert={this.props.alert}
              removeAlert={this.props.removeAlert}
            />         
          ) : null }

          {(this.props.mode === 'view') ? (
            <PhysicalProfile
              selectedRecord={selectedRecord} 
              virtualRecord={virtualRecord}
            />
          ) : null }

          {(this.props.mode === 'new') ? (
            <div class="panel-block">
              Physical New Instance
            </div>
          ) : null }

          {(this.props.mode === 'edit') ? (
            <PhysicalEditForm
              selectedRecord={selectedRecord} 
              virtualRecord={virtualRecord}
            />
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