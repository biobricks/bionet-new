import {h} from 'preact';
import { Link } from 'react-router-dom';

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
          childElements.push(
            <div class="empty grid-item">
              <div class="grid-item-label">empty</div>
            </div>
          );  
        }

        // replace empty cells with positioned children
        for(let i = 0; i < record.children.length; i++){
          let childRecord = record.children[i];
          // get position of current child record based on its relationship with parent size
          let childIndex = ((childRecord.row * record.columns) - record.columns) + childRecord.column - 1;
          // replace empty with child
          if(childRecord.id === this.props.selectedRecord.id){
            childElements[childIndex] = (
              <div class="active grid-item">
                <div class="grid-item-label">{childRecord.name}</div>
              </div>
            );  
          } else {
            childElements[childIndex] = (
              <Link 
                to={`/ui/lab-inventory/${childRecord.id}`} 
                class="grid-item"
                id={`${childRecord.id}`}
                onClick={this.props.selectRecord}
              >
                <div 
                  class="grid-item-label"
                  id={`${childRecord.id}`}
                >
                  {childRecord.name}
                </div>
              </Link>
            );
          }
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
