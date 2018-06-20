import { h } from 'preact';
import { Link } from 'react-router-dom';

module.exports = function(Component) {

  const DataPanel = require('./data_panel.js')(Component);
  const MapPanel = require('./map_panel.js')(Component);

  return class Test extends Component {
	  render() {
      return (
        <div class="LabInventory">
          <div class="columns is-desktop">
            <div class="column is-7-desktop">
              <DataPanel />
            </div>
            <div class="column is-5-desktop">
              <MapPanel />
            </div>
          </div>
        </div>
      )
    }
  }
}
