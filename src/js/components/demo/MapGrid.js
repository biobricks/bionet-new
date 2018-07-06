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
    
      let childElements = [];
      if(record && record.children){
        
        // get total number of cells in grid
        let cellCount = record.rows * record.columns;

        // fill childElements array with empty cells
        for(let i = 0; i < cellCount;i++){
          childElements.push(<div class="empty grid-item"></div>);  
        }

        // replace with children by position
        // childElements = record.children.map((child, index) => {
        //   return (
        //     <div class="grid-item">
        //       {child.name}
        //     </div>
        //   );
        // });
      }

      // add emptys

      return (
        <div class="MapGrid">
          <div class="grid-container" style={containerStyles}>
            {childElements}
          </div>
        </div>
      )
    }
  } 
}
