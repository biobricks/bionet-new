import { h } from 'preact';
import ashnazg from 'ashnazg';

module.exports = function (Component) {
  
  return class Message extends Component {

    constructor(props) {
      super(props);
      this.state = {};
      this.handleRemoveAlertClick = this.handleRemoveAlertClick.bind(this);
    }

    handleRemoveAlertClick(e) {
      this.props.removeAlert();
    }

    componentDidMount() {
      setTimeout(this.props.removeAlert, 2500);
    }

    render() {
      
      const messageClass = this.props.alert && this.props.alert.type && this.props.alert.type === 'danger' ? 'message is-danger' : 'message is-success';
      
      return (
        <div class="Message">
          <div class={messageClass}>
            <div class="message-header">
              {this.props.alert && this.props.alert.message}
              <button 
                class="delete" 
                aria-label="delete"
                onClick={this.handleRemoveAlertClick}
              ></button>
            </div>
          </div>
        </div>
      );
    }

  }
}