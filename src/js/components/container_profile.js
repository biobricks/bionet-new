import { h } from 'preact';

module.exports = function(Component) {

  return class ContainerProfile extends Component {

    render() {
      let selectedRecord = this.props.selectedRecord;
      let parentRecord = this.props.parentRecord;
      return (
        <div class="ContainerProfile">
          <div class="columns">
            <div class="column">
              Location: {parentRecord.name}<br/>
              Description: {selectedRecord.description}<br/>
              Rows: {selectedRecord.rows}<br/>
              Columns: {selectedRecord.columns}<br/>
            </div>
          </div>   
        </div>
      )
    }
  }
}  