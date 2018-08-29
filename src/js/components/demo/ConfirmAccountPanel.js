import { h } from 'preact';

module.exports = function(Component) {

  const AlertPanel = require('./AlertPanel.js')(Component);

  return class ConfirmAccountPanel extends Component {

    render() {
      return (
        <div class="ConfirmAccountPanel">
          <div class="columns is-centered">
            <div class="column is-12-mobile is-8-tablet is-6-desktop">
              <AlertPanel
                heading={'Account Confirmed'}
                message={'<p>Welcome to the <span class="has-text-primary">Bionet</span>.</p>'}
              />
            </div>
          </div>    
        </div>
      )
    }
  }
}  