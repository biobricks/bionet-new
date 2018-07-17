import { h } from 'preact';
import ashnazg from 'ashnazg';
import { Link, Redirect } from 'react-router-dom';

module.exports = function(Component) {

  const DataPanel = require('./DataPanel.js')(Component);

  return class LabInventory extends Component {
    
    constructor(props) {
      super(props);
      this.initialized = false;
      app.actions.inventory.initialize();
      this.state = {
        redirect: false,
        redirectTo: '',
        inventoryPath: [],
        selectedRecord: {},
        editMode: false,
        newMode: false
      };
      //console.log(app.actions.inventory);
      //ashnazg.listen('global.user', this.loggedInUser.bind(this));
      this.toggleEditMode = this.toggleEditMode.bind(this);
      this.toggleNewMode = this.toggleNewMode.bind(this);
      this.getInventoryPath = this.getInventoryPath.bind(this);
      this.onClickLink = this.onClickLink.bind(this);
    }

    toggleEditMode() {
      console.log('toggle edit mode fired');
      this.setState({
        editMode: !this.state.editMode
      });
      console.log(this.state);
    }

    toggleNewMode() {
      console.log('toggle new mode fired');
      this.setState({
        editMode: false,
        newMode: !this.state.newMode
      });
      console.log(this.state);
    }    

    getInventoryPath(id, callback) {
      app.actions.inventory.getInventoryPath(id, (error, inventoryPath) => {
        if(error !== null){ 
          callback(error, null); 
        } else {
          callback(null, inventoryPath);
        }
      });      
    }

    onClickLink(e){
      e.preventDefault();
      console.log('on click link fired');
      const redirectTo = e.target.getAttribute('to');
      this.setState({
        redirect: true,
        redirectTo
      });   
    }

    componentWillReceiveProps(props){
      console.log('componentWillReceiveProps fired'); 
    }

    componentDidMount() {
      console.log('componentDidMount fired');
    }

    componentDidUpdate() {
      console.log('componentDidUpdate fired');
      console.log(this.state);
      const idParam = this.props.match.params.id ? this.props.match.params.id : null;       
      if(idParam !== this.state.selectedRecord.id){
        this.getInventoryPath(idParam, (error, inventoryPath) => {
          let selectedRecord = this.state.selectedRecord;
          if(error){ 
            console.log(error);
          } else {
            selectedRecord = inventoryPath[inventoryPath.length - 1];
            console.log(selectedRecord);
            this.setState({
              inventoryPath,
              selectedRecord
            });
          }
        });
      }
      if(idParam === this.state.selectedRecord.id && this.state.redirect === true){
        this.setState({
          redirect: false,
          redirectTo: ''
        });
      }      
    }

    render() {
      if(this.state.redirect){ 
        return (
          <Redirect
            to={this.state.redirectTo}
          />
        );
      }
      return (
        <div class="Inventory">
          <div class="columns is-desktop">
            <div class="column is-7-desktop">
              <DataPanel
                {...this.state}
                selectedRecord={this.state.selectedRecord}
                inventoryPath={this.state.inventoryPath}
                onClickLink={this.onClickLink}
                toggleNewMode={this.toggleNewMode}
                toggleEditMode={this.toggleEditMode}
              />
            </div>
            <div class="column is-5-desktop">

            </div>
          </div>  
        </div>
      );
    }

  }

}