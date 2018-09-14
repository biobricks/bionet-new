import { h } from 'preact';
import { Link } from 'react-router-dom';

module.exports = function(Component) {

  return class PanelToolbar extends Component {

    render() {

      const mapExpandIcon = this.props.dataFullScreen ? 'mdi mdi-arrow-collapse' : 'mdi mdi-arrow-expand';

      return (
        <div class="PanelToolbar toolbox pull-right">
        
          {(this.props.mode === 'view') ? (
            <div class="buttons has-addons">
                
              {(this.props.selectedRecord.type && this.props.selectedRecord.type !== 'virtual') ? (  
                <span 
                  class="button is-small is-success"
                  mode="new"
                  onClick={this.props.handleSetMode}
                >
                  <i class="
                  mdi mdi-plus" mode="new"></i>
                </span>
              ) : null }  
              
              <span 
                class="button is-small is-link"
                mode="edit"
                onClick={this.props.handleSetMode}
              >
                <i class="mdi mdi-pencil" mode="edit"></i>
              </span>
              <span 
                class="button is-small is-primary"
                onClick={this.props.toggleDataFullScreen}
              >
                <i class={mapExpandIcon}></i>
              </span>              
            </div>  
          ) : null }

          {(this.props.mode === 'new') ? (
            <div class="buttons has-addons">
              <span 
                class="button is-small"
                mode="view"
                onClick={this.props.handleSetMode}
              >
                <i class="mdi mdi-arrow-left-bold" mode="view"></i>
              </span>
              <span 
                class="button is-small is-primary"
                onClick={this.props.toggleDataFullScreen}
              >
                <i class={mapExpandIcon}></i>
              </span>              
            </div>
          ) : null }

          {(this.props.mode === 'edit') ? (
            <div class="buttons has-addons">
              
              <span 
                class="button is-small"
                mode="view"
                onClick={this.props.handleSetMode}
              >
                <i class="mdi mdi-arrow-left-bold" mode="view"></i>
              </span>

              {(this.props.selectedRecord.type && this.props.selectedRecord.type !== 'virtual') ? (
                <span 
                  class="button is-small is-danger"
                  mode="delete"
                  onClick={this.props.handleSetMode}
                >
                  <i class="mdi mdi-delete-variant" mode="delete"></i>
                </span>
              ) : null }
              
              <span 
                class="button is-small is-primary"
                onClick={this.props.toggleDataFullScreen}
              >
                <i class={mapExpandIcon}></i>
              </span>

            </div>
          ) : null }

          {(this.props.mode === 'delete') ? (
            <div class="buttons has-addons">
              <span 
                class="button is-small"
                mode="edit"
                onClick={this.props.handleSetMode}
              >
                <i class="mdi mdi-arrow-left-bold" mode="edit"></i>
              </span>
            </div>
          ) : null }

        </div>
      )
    }
  }
}  