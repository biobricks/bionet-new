import { h } from 'preact';

module.exports = function(Component) {

  return class AlertPanel extends Component {

    render() {
      return (
        <div class="AlertPanel">
          <div class="panel-heading has-text-centered">
            <h3>{this.props.heading || 'Alert Panel (props.heading)'}</h3>
          </div>
          <div class="panel-block">
            <div class="has-text-centered" style={{'margin': '0 auto'}} dangerouslySetInnerHTML={{__html: this.props.message || 'Alert Panel Message. (props.message)'}}>

            </div>
          </div>
        </div>
      )
    }
  }
}  