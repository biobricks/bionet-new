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
          columnSpan: 1
        }
      };
      this.updateField = this.updateField.bind(this);
    }

    updateField(e) {
      let fieldName = e.target.getAttribute('name');
      let form = this.state.form;
      if(fieldName === 'rows' || fieldName === 'columns'){
        form[fieldName] = parseInt(e.target.value);
      } else {
        form[fieldName] = e.target.value;
      }
      this.setState({
        form
      });
    }

    render() {
      let gridContainerStyles = {
        'gridTemplateRows': `repeat(${this.state.form.rows}, 1fr)`,
        'gridTemplateColumns': `repeat(${this.state.form.columns}, 1fr)`
      };
      const gridCellCount = this.state.form.rows * this.state.form.columns;
      let gridCells = [];
      for(let i = 0; i < gridCellCount; i++){
        gridCells.push(
          <div class="empty grid-cell"></div>
        );
      }
      
      return (
        <div class="ContainerNew">
          <div class="columns is-desktop">
            <div class="column is-7-desktop">
              <div class="panel has-background-white">
                <div class="panel-heading is-capitalized">
                  <div class="is-block">
                    <i class="mdi mdi-grid"></i>&nbsp;&nbsp;New Container
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
                                checked="checked"
                                onChange={this.updateField}
                              />
                              &nbsp;Top
                            </label>
                            <label class="radio">
                              <input 
                                type="radio" 
                                name="viewType"
                                value="front"
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
                        <label class="label">Size</label>
                      </div>
                      <div class="field-body">  
                        <div class="field has-addons">
                          <div class="control is-expanded">
                            <input 
                              class="input"
                              type="number"
                              min="1"
                              max="30"
                              name="rowSpan"
                              value={this.state.form.rowSpan}
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
                              name="columnSpan"
                              value={this.state.form.columnSpan}
                              onChange={this.updateField}
                            />
                          </div>
                          <div class="control">
                            <a class="button is-static">Columns</a>
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
              <div class="panel-heading is-capitalized">
                <i class="mdi mdi-grid"></i>&nbsp;&nbsp;
                {(this.state.form.name) ? (
                  <span>{this.state.form.name}</span>
                ) : (
                  <span>New Container</span>
                )}
              </div>
              <div 
                class="grid"
                style={gridContainerStyles}
              >
                {gridCells}
              </div>
            </div>
          </div>


          <div class="columns is-desktop">
            <div class="column">
              <div class="panel">
                <div class="panel-heading">
                  Current State
                </div>
                <div class="panel-block">
                  <pre>
                    {JSON.stringify(this.state, null, 2)}
                  </pre>  
                </div>
              </div>
            </div>
            <div class="column">
              <div class="panel">
                <div class="panel-heading">
                  Current Props
                </div>
                <div class="panel-block">
                  <pre>
                    {JSON.stringify(this.props, null, 2)}
                  </pre>  
                </div>
              </div>
            </div>
          </div>

        </div>
      );
    }
  }

}