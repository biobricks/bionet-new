import {h} from 'preact';

module.exports = function(Component) {

  return class MapGrid extends Component {

    render() {
      
      // create new array with number of items equal to the objects column count 
      //let colArray = new Array(this.props.record.columns);

      // let rows = rowArray.map((row, index) => {
      //   return (
          
      //   );
      // });
      // for(let i = 0; i < colArray.length; i++){
      //   colArray[i] = {
      //     no: i + 1
      //   }
      // }

      // let row = colArray.map((column, index) => {
      //   return (
      //     <div class="column">
      //       <div class="cell">
      //         <span class="cell-location">{column.no}</span>
      //       </div>  
      //     </div>
      //   );
      // });

      let grid = createGrid(this.props.record.rows, this.props.record.columns);

      return (
        <div class="MapGrid">
          {grid}
        </div>
      )
    }
  }
}

function createGridRow(rowNumber, columnCount) {
  let columnArray = [];
  for(let i = 0; i < columnCount; i++){
    columnArray.push({
      no: i + 1
    });
  }
  let resultArray = columnArray.map((column, index) => {
    return (
      <div class="column">
        <a class="cell">
          <span class="cell-location">{rowNumber}, {column.no}</span>
        </a>  
      </div>
    );
  });
  return resultArray;
}

function createGrid(rowCount, columnCount){
  let rowArray = [];
  for(let i = 0; i < rowCount; i++){
    rowArray.push({
      no: i + 1
    });
  }
  let resultArray = rowArray.map((row, index) => {
    let gridRow = createGridRow(row.no, columnCount);
    return (
      <div class="grid columns is-mobile is-gapless is-multiline">
        {gridRow}
      </div>
    )
  });
  return resultArray;
}