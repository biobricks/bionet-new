import { h } from 'preact';
import ashnazg from 'ashnazg';
import { Link } from 'react-router-dom';

module.exports = function (Component) {

  return class MapGrid extends Component {

    constructor(props) {
      super(props);
      this.state = {};
    }

    render() {

      // default selected record - may change depending on container/physical/virtual
      let selectedRecord = this.props && this.props.selectedRecord || null;
      
      // selected record type - lab/container/physical/virtual - defaults to container
      const type = this.props && this.props.type || 'container';
      

      // inner width and height have different attribute names according to type
      let gridContainerWidth, gridContainerHeight;
      switch (type) {
        case 'lab':
          gridContainerWidth = selectedRecord ? selectedRecord.layoutWidthUnits : 1;
          gridContainerHeight = selectedRecord ? selectedRecord.layoutHeightUnits : 1;
          break;
        case 'container':
          gridContainerWidth = selectedRecord ? selectedRecord.xUnits : 1;
          gridContainerHeight = selectedRecord ? selectedRecord.yUnits : 1;
          break;
        case 'physical':
          gridContainerWidth = selectedRecord ? selectedRecord.xUnits : 1;
          gridContainerHeight = selectedRecord ? selectedRecord.yUnits : 1;
          break;  
        default:
          gridContainerWidth = 1;
          gridContainerHeight = 1;
      }

      // styles for the top level grid container based on the selected record's internal rows and columns
      // if no selected record is loaded, it will render the map as a 1x1 grid to prevent layout break
      const gridContainerStyles = {
        'gridTemplateColumns': selectedRecord ? `repeat(${gridContainerWidth}, 1fr)` : '1fr',
        'gridTemplateRows': selectedRecord ? `repeat(${gridContainerHeight}, 1fr)` : '1fr',
      };

      // set an empty array to hold the top level grid container children
      let gridContainerChildren = [];

      // determine grid cell count
      const gridCellCount = gridContainerWidth * gridContainerHeight;

      // add empty cells to gridContainerChildren array
      for(let i = 0; i < gridCellCount; i++){
        gridContainerChildren.push(
          <div class="empty grid-item"></div>
        );
      }

      // replace empty cells in the gridContainerChildren array with children
      if (selectedRecord && selectedRecord.children) {
        for(let i = 0; i < selectedRecord.children.length; i++){
          let child = selectedRecord.children[i];
          let childIndex =  ((child.parent_y * gridContainerWidth) - gridContainerWidth) + child.parent_x - 1;
          let childStyles = {
            'color': child.textColor ? child.textColor : '#333333',
            'backgroundColor': child.color || '#FFFFFF',
            'fontSize': child.font ? `${child.font}px` : '12px',
            'lineHeight': child.font ? `${child.font + 2}px` : '14px',
            'display': 'grid',
            'alignSelf': 'stretch',
            'justifySelf': 'stretch',
            // 'gridTemplateColumns': `repeat(${child.xUnits}, 1fr)`, // for grandchildren
            // 'gridTemplateRows': `repeat(${child.yUnits}, 1fr)` // for grandchildren
            'gridTemplateColumns': '1fr',
            'gridTemplateRows': '1fr'
          };
          
          // add empty cells to child inner grid
          // let grandChildren = [];
          // let childrenLength = child.xUnits * child.yUnits;
          // for(let j = 0; j < childrenLength; j++){
          //   grandChildren.push(
          //     <div class="empty grid-item"></div>
          //   );
          // }

          let childEl = (
            <Link
              to={`/ui/inventory/${child.id}`}
              id={child.id}
              class="grid-item" 
              style={childStyles}
              onMouseEnter={this.props.onRecordMouseEnter}
              onMouseLeave={this.props.onRecordMouseLeave}
            >
              <div class="grid-item-label">{child.name}</div>
            </Link>
          );
          gridContainerChildren[childIndex] = childEl;
        }
      }

      return (
        <div class="MapGrid panel-block p-0">
          <div class="grid-container" style={gridContainerStyles}>
            {gridContainerChildren}
          </div>
        </div>
      );
    }

  }
}