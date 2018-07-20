import { h } from 'preact';

module.exports = function(Component) {

  return class ConfirmAccountPanel extends Component {

    render() {
      return (
        <div class="ConfirmAccountPanel">
          <div class="columns is-centered">
            
            <div class="column is-12-mobile is-8-tablet is-6-desktop">
              <div class="panel">
                <div class="panel-heading has-text-centered">
                  <h3>Account Confirmed</h3>
                </div>
                <div class="panel-block">
                  <div class="has-text-centered" style={{'margin': '0 auto'}}>
                    <p>
                      Welcome to the <span class="has-text-primary">Bionet</span>.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>    
        </div>
      )
    }
  }
}  