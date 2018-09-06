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
      let selectedRecord = this.props.selectedRecord || null;
      
      // selected record type - lab/container/physical/virtual - defaults to container
      const type = this.props.selectedRecord.type || 'container';
      

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
      let positionCounter = 1;
      for(let rowNo = 1; rowNo <= gridContainerHeight; rowNo++){
        for(let colNo = 1; colNo <= gridContainerWidth; colNo++){
          let emptyChildStyles = {
            'display': 'grid',
            'alignSelf': 'stretch',
            'justifySelf': 'stretch',
            'gridTemplateColumns': '1fr',
            'gridTemplateRows': '1fr'
          };
          gridContainerChildren.push(
            <div 
              class="empty grid-item"
              style={emptyChildStyles}
              row={rowNo}
              col={colNo}
              pos={positionCounter}
              onDragOver={this.props.onCellDragOver}
              onDrop={this.props.onCellDrop}
              draggable="true"
            ></div>
          );
          positionCounter++;
        }  
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
            'gridTemplateColumns': '1fr',
            'gridTemplateRows': '1fr'
          };
          


          let childEl = (
            <Link
              to={`/ui/inventory/${child.id}`}
              id={child.id}
              class="grid-item"
              pos={childIndex}
              row={child.parent_y}
              col={child.parent_x} 
              style={childStyles}
              onMouseEnter={this.props.onRecordMouseEnter}
              onMouseLeave={this.props.onRecordMouseLeave}
              draggable="true"
              onDragStart={this.props.onCellDragStart}
              onDragOver={this.props.onCellDragOver}
              onDragEnd={this.props.onCellDragEnd}
              onDrop={this.props.onCellDrop}
            >
              <div 
                class="grid-item-label"
                style={
                  {
                    'fontSize': `${child.fontSize}px` || '12px',
                    'line-height': `${child.fontSize + 2}px` || '14px',
                  }
                }
              >{child.name}</div>
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