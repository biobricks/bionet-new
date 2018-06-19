import {h} from 'preact';
import {Link} from 'react-router-dom';

module.exports = function(Component) {

  return class DataPanel extends Component {
	  render() {
      return (
        <div class="DataPanel panel has-background-white">
          <div className="panel-heading">
            <div class="is-block">
              <div class="columns is-gapless">
                <div class="column has-text-centered-mobile">
                  Data Panel
                </div>
                <div class="column is-clearfix">
                  <div class="toolbox">
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

          <div className="panel-block">
            Breadcrumbs
          </div>
          <div className="panel-block">
            Status
          </div>
        </div>
      )
    }
  }
}
