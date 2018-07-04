import {h} from 'preact';
import {Link} from 'react-router-dom';

module.exports = function(Component) {

  return class SuggestPanel extends Component {

	  render() {
      let record = this.props.selectedRecord;
      let isContainer = Object.keys(record).indexOf('children') > -1;
      let isEditMode = this.props.editMode;
      let isNewMode = this.props.newMode;
      console.log(isNewMode);      
      return (
        <div class="MapPanel panel has-background-white">
          <div className="panel-heading">
            Virtual Suggestions
          </div>
          <div className="panel-block">

          </div>         
        </div>
      )
    }
  }
}
