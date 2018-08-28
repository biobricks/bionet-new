import { h } from 'preact';
import ashnazg from 'ashnazg';

module.exports = function (Component) {
  
  const InventoryPath = require('./inventoryPath')(Component);

  return class Inventory extends Component {

    constructor(props) {
      super(props);
      this.initialized = false;
      app.actions.inventory.initialize();
      this.state = {
        types: {},
        showFavorites:false,
        inventoryPath: null
      };
      if(props.match.params.virtual_id) {
        this.state.inventoryPath = {
          virtual_id: props.match.params.virtual_id
        }
      }
      ashnazg.listen('global.user', this.loggedInUser.bind(this));
    }
        
    componentWillReceiveProps(props) {
      const id = (props.match) ? props.match.params.id : null;
        
      if (id !== this.state.id || app.state.inventory.forceRefresh) {
        this.getInventoryPath(id);
      }  
      if (props.match.params.virtual_id) {
        this.setState({
          inventoryPath: {
            virtual_id: props.match.params.virtual_id
          },
          err: null
        });
      }
    }
        
    componentWillMount() {
      this.setState({
        types: app.actions.inventory.getInventoryTypes()
      });
    }
        
    getInventoryPath(idp) {
      var id=idp
      const self = this;
      if (id==='favorites') {
        this.setState({
            showFavorites:!this.state.showFavorites
        })
        id=this.state.id
      }
      if (id) {
        app.actions.inventory.getInventoryPath(id, function(err, inventoryPath) {
          if (err) {
            if (!self.state.err) { 
              app.actions.notify(err.message, 'error');
            }
            self.setState({
              id: id,
              err: err,
              inventoryPath: null
            });
            return;  
          }
          self.setState({
            id: id,
            err: null,
            inventoryPath: inventoryPath
          });
        });
      } else {
        app.actions.inventory.getRootItem(function(err, rootId) {
          if (err) {
            console.log('getRootItem, error:', err);
            self.setState({
              id: rootId,
              err: err,
              inventoryPath: null
            });
            return;
          } else {
            app.actions.inventory.getInventoryPath(rootId, function(err, inventoryPath){
              if (err) {
                self.setState({
                  id: rootId,
                  err: err,
                  inventoryPath: null
                });
                return;
              }
              self.setState({
                id: rootId,
                err: null,
                inventoryPath: inventoryPath
              });
            });
          }
        });
      }
    }
        
    shouldComponentUpdate(nextProps, nextState) {
      const idProp = (nextProps.match) ? nextProps.match.params.id : null;
      if (idProp==='favorites') return true
      const idState = nextState.id;
      if (app.state.inventory.forceRefresh) {
        app.state.inventory.forceRefresh = false;
        return true;
      }
      if (!idProp && idState) { 
        return true;
      }  
      return idState === idProp;
    }
        
    loggedInUser(loggedInUser) {
      if (!loggedInUser) {
        return;
      }
      this.initialized = true;
      app.actions.inventory.getInventoryTypes();
      app.actions.inventory.getFavorites();
      app.actions.inventory.getWorkbenchContainer();
      const id = (this.props.match) ? this.props.match.params.id : null;
      this.getInventoryPath(id);
    }
        
    componentDidMount() {
      if (!this.state.inventoryPath) {
        this.loggedInUser(app.state.global.user);
      }
    }
        
    render() {
      //console.log('render:',this.props,this.state)
      if (!app.state.global.user) {
        console.log('inventory index.js not logged in', this.state.inventoryPath);
        // todo: this message could be displayed for reasons other than not having a logged in user
        return null;
        /*
          return (
            <div>You must be logged in to view this page.</div>
          );
        */
      }

      if (this.state.err) {
        return (
          <div>Error:{this.state.err.message}</div>
        );
      }

      return (
        <InventoryPath state="inventoryPath" id={this.state.id} inventoryPath={this.state.inventoryPath} showFavorites={this.state.showFavorites}/>
      );
    }
  }
}