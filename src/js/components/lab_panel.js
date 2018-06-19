import {h} from 'preact';
import {Link} from 'react-router-dom';

module.exports = function(Component) {

  return class LabPanel extends Component {
	  render() {
      return (
        <div class="LabPanel panel has-background-white">
          <div class="panel-heading">
            <div class="is-block">
              <div class="columns is-gapless">
                <div class="column">
                  Lab Panel
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
                </div>
              </div>    
            </div>
          </div>

          <div class="panel-block">
            <Link to="/ui/lab-inventory">
              Lab Inventory
            </Link>
          </div>
          <div class="panel-block">
            <div class="lab-editor">
            
            </div>
          </div>
        </div>
      )
    }
  }
}
