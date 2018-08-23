import { h } from 'preact';
import ashnazg from 'ashnazg';
import { Redirect } from 'react-router-dom';
import './ContainerNew.scss';

module.exports = function(Component) {

  return class ContainerNew extends Component {

    constructor(props){
      super(props);
      this.state = {
        form: {
          name: '',
          description: '',
          viewType: 'top',
          rows: 1,
          columns: 1,
          rowSpan: 1,
          columnSpan: 1,
          parentRow: 1,
          parentColumn: 1
        },
        parentContainer: {
          name: 'Parent Container',
          rows: 4,
          columns: 4,
          cells: []
        },
        childContainer: {
          cells: []
        }
      };
      this.updateField = this.updateField.bind(this);
      this.setChildGridCells = this.setChildGridCells.bind(this);
      this.setParentGridCells = this.setParentGridCells.bind(this);
    }

    updateField(e) {
      let fieldName = e.target.getAttribute('name');
      let form = this.state.form;
      if(fieldName === 'rows' || fieldName === 'columns' || fieldName === 'rowSpan' || fieldName === 'columnSpan' || fieldName === 'parentRow' || fieldName === 'parentColumn'){
        form[fieldName] = parseInt(e.target.value);
      } else {
        form[fieldName] = e.target.value;
      }
      this.setState({
        form
      });
      this.setChildGridCells();
      this.setParentGridCells();
    }

    setChildGridCells() {
      //console.log('setting child grid cells');
      let gridContainerStyles = {
        'gridTemplateRows': `repeat(${this.state.form.rows}, 1fr)`,
        'gridTemplateColumns': `repeat(${this.state.form.columns}, 1fr)`
      };
      const gridCellCount = this.state.form.rows * this.state.form.columns;
      let gridCells = [];
      for(let i = 0; i < gridCellCount; i++){
        gridCells.push(
          <div class="grid-cell"></div>
        );
      }
      this.setState({
        childContainer: {
          cells: gridCells
        }
      });      
    }

    setParentGridCells() {
      let gridContainerStyles = {
        'gridTemplateRows': `repeat(${this.state.form.rows}, 1fr)`,
        'gridTemplateColumns': `repeat(${this.state.form.columns}, 1fr)`
      };
      const gridCellCount = this.state.form.rows * this.state.form.columns;

      let parentGridContainerStyles = {
        'gridTemplateRows': `repeat(${this.state.parentContainer.rows}, 1fr)`,
        'gridTemplateColumns': `repeat(${this.state.parentContainer.columns}, 1fr)`        
      };
      const parentGridCellCount = this.state.parentContainer.rows * this.state.parentContainer.columns;
      let parentGridCells = [];
      for(let i = 0; i < parentGridCellCount; i++){
        let position = i + 1;
        let row = Math.ceil(position / this.state.parentContainer.columns);
        let column = (position % this.state.parentContainer.columns) > 0 ? (position % this.state.parentContainer.columns) : this.state.parentContainer.columns;
        
        let subGridContainerStyles = gridContainerStyles;
        subGridContainerStyles['display'] = 'grid';
        subGridContainerStyles['alignSelf'] = 'stretch';
        subGridContainerStyles['justifySelf'] = 'stretch';

        if(row === this.state.form.parentRow && column === this.state.form.parentColumn){
          let subGridCells = [];
          for(let j = 0; j < gridCellCount; j++){
            subGridCells.push(
              <div class="grid-cell"></div>
            );
          }
          parentGridCells.push(
            <div 
              class="active grid-cell"
              style={subGridContainerStyles}
            >
              {subGridCells}  
            </div>
          );
        } else {
          let emptyCellStyles = {
            'alignSelf': 'stretch',
            'justifySelf': 'stretch',
            'display': 'grid',
            'gridTemplateRows': '1fr',
            'gridTemplateColumns': '1fr',
          };
          let labelStyles = {
            'alignSelf': 'center',
            'textAlign': 'center'
          };
          parentGridCells.push(
            <div 
              class="empty grid-cell"
              style={emptyCellStyles}
            >
              <label 
                style={labelStyles}
              >
                {row}, {column}
              </label>  
            </div>
          );
        }  
      }
      let parentContainer = this.state.parentContainer;
      parentContainer['cells'] = parentGridCells;
      this.setState({
        parentContainer
      }); 
    }

    componentDidMount() {
      this.setChildGridCells();
      this.setParentGridCells();
    }

    render() {
      let gridContainerStyles = {
        'gridTemplateRows': `repeat(${this.state.form.rows}, 1fr)`,
        'gridTemplateColumns': `repeat(${this.state.form.columns}, 1fr)`
      }; 
      let parentGridContainerStyles = {
        'gridTemplateRows': `repeat(${this.state.parentContainer.rows}, 1fr)`,
        'gridTemplateColumns': `repeat(${this.state.parentContainer.columns}, 1fr)`        
      };        
      return (
        <div class="ContainerNew">
          <div class="columns is-desktop">
            <div class="column is-7-desktop">
            
              <div class="panel has-background-white">
                <div class="panel-heading is-capitalized">
                  <div class="is-block">
                    <i class="mdi mdi-grid"></i>&nbsp;&nbsp;
                    {(this.state.form.name) ? (
                      <span>{this.state.form.name} ({this.state.form.viewType} View)</span>
                    ) : (
                      <span>Describe New Container</span>
                    )}&nbsp;

                    <div class="toolbox is-pulled-right">
                      <div class="buttons has-addons">
                        <span 
                          class="button is-small"
                        >
                          <i class="mdi mdi-arrow-left-bold"></i>
                        </span>
                        <span 
                          class="button is-small is-success"
                        >
                          <i class="mdi mdi-content-save"></i>
                        </span>
                      </div>
                    </div>
                  </div>                          
                </div>
                <div class="panel-block grid-container">
                  <div 
                    class="grid"
                    style={gridContainerStyles}
                  >
                    {this.state.childContainer.cells}
                  </div>
                </div>                
                <div class="panel-block">
                  <form>
                    <div class="field is-horizontal">
                      <div class="field-label is-normal">
                        <label class="label">Name</label>
                      </div>
                      <div class="field-body">  
                        <div class="field">
                          <div class="control">
                            <input 
                              class="input"
                              type="text"
                              name="name"
                              placeholder="Container Name"
                              onInput={this.updateField}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div class="field is-horizontal">
                      <div class="field-label is-normal">
                        <label class="label">Description</label>
                      </div>
                      <div class="field-body">
                        <div class="field"> 
                          <div class="control">
                            <textarea 
                              class="textarea"
                              name="description"
                              placeholder="A short description of the Container."
                              rows="2"
                              onInput={this.updateField}
                            ></textarea>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div class="field is-horizontal">
                      <div class="field-label">
                        <label class="label">View Type</label>
                      </div>
                      <div class="field-body">
                        <div class="field is-narrow">
                          <div class="control">
                            <label class="radio">
                              <input 
                                type="radio" 
                                name="viewType"
                                value="top"
                                checked={this.state.form.viewType === 'top'}
                                onChange={this.updateField}
                              />
                              &nbsp;Top
                            </label>
                            <label class="radio">
                              <input 
                                type="radio" 
                                name="viewType"
                                value="front"
                                checked={this.state.form.viewType === 'front'}
                                onChange={this.updateField}
                              />
                              &nbsp;Front
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div class="field is-horizontal">
                      <div class="field-label is-normal">
                        <label class="label">Slots</label>
                      </div>
                      <div class="field-body">  
                        <div class="field has-addons">
                          <div class="control is-expanded">
                            <input 
                              class="input"
                              type="number"
                              min="1"
                              max="30"
                              step="1"
                              name="rows"
                              value={this.state.form.rows}
                              onChange={this.updateField}
                            />
                          </div>
                          <div class="control">
                            <a class="button is-static">Rows</a>
                          </div>
                        </div>
                        <div class="field has-addons">
                          <div class="control is-expanded">
                            <input 
                              class="input"
                              type="number"
                              min="1"
                              max="30"
                              step="1"
                              name="columns"
                              value={this.state.form.columns}
                              onChange={this.updateField}
                            />
                          </div>
                          <div class="control">
                            <a class="button is-static">Columns</a>
                          </div>
                        </div>
                      </div>
                    </div>

                  </form>
                </div>
              </div>
              
            </div>
            <div class="column is-5-desktop">
            <div class="panel has-background-white">
                <div class="panel-heading is-capitalized">
                  <div class="is-block">
                    <i class="mdi mdi-grid"></i>&nbsp;&nbsp;
                    {(this.state.form.name) ? (
                      <span>Position {this.state.form.name} In {this.state.parentContainer.name}</span>
                    ) : (
                      <span>Position New Container In {this.state.parentContainer.name}</span>
                    )}&nbsp;
                  </div>                          
                </div>
                <div class="panel-block grid-container">
                  <div 
                    class="grid"
                    style={parentGridContainerStyles}
                  >
                    {this.state.parentContainer.cells}
                  </div>
                </div>                
                <div class="panel-block">
                  <form>

                    <div class="field is-horizontal">
                      <div class="field-label is-normal">
                        <label class="label">Position</label>
                      </div>
                      <div class="field-body">  
                        <div class="field has-addons">
                        <div class="control">
                            <a class="button is-static">Row</a>
                          </div>
                          <div class="control is-expanded">
                            <input 
                              class="input"
                              type="number"
                              min="1"
                              max={this.state.parentContainer.rows}
                              step="1"
                              name="parentRow"
                              value={this.state.form.parentRow}
                              onChange={this.updateField}
                            />
                          </div>
                        </div>
                        <div class="field has-addons">
                        <div class="control">
                            <a class="button is-static">Column</a>
                          </div>
                          <div class="control is-expanded">
                            <input 
                              class="input"
                              type="number"
                              min="1"
                              max={this.state.parentContainer.columns}
                              step="1"
                              name="parentColumn"
                              value={this.state.form.parentColumn}
                              onChange={this.updateField}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    
                  </form>
                </div>
              </div>
            </div>
          </div>

        </div>
      );
    }
  }

} 