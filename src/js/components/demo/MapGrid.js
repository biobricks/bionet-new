import {h} from 'preact';

module.exports = function(Component) {

  return class MapGrid extends Component {

    render() {
      let containerStyles = {
        'gridTemplateColumns': '',
        'gridTemplateRows': ''
      };
      for(let i = 0; i < this.props.record.columns; i++){
        containerStyles.gridTemplateColumns += '1fr';
        if(i !== (this.props.record.columns - 1)) {
          containerStyles.gridTemplateColumns += ' ';
        }
      }
      for(let i = 0; i < this.props.record.rows; i++){
        containerStyles.gridTemplateRows += '1fr';
        if(i !== (this.props.record.rows - 1)) {
          containerStyles.gridTemplateRows += ' ';
        }
      }
      let record = this.props.record;
      let childrenEls = [];
      if(record && record.children){
        childrenEls = record.children.map((child, index) => {
          return (
            <div class="grid-item">
              {child.name}
            </div>
          );
        });
      }

      // add emptys

      return (
        <div class="MapGrid">
          <div class="grid-container" style={containerStyles}>
            {childrenEls}
          </div>
        </div>
      )
    }
  } 
}
