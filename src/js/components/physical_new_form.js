
import { h } from 'preact';
import ColorPicker from 'react-color-picker'

module.exports = function(Component) {

  return class PhysicalNewForm extends Component {
      
    constructor(props, context) {
        super(props, context)
        this.state={
            name:'',
            description:'',
            instances:1,
            enableColorPicker:false,
            color:'aqua'
        }
    }
    onSelectColor(e) {
        this.setState({enableColorPicker:!this.state.enableColorPicker})
    }
    update(newProps) {
        const newState = Object.assign(this.state, newProps)
        this.setState(newState,()=>{/*console.log('PhysicalNew update:',this.state)*/})
        if (this.props.onChange) this.props.onChange(newProps)
        
        //todo: ashnagz doesn't seem to be setting state correctly
        app.state.PhysicalNewForm=this.state
        /*
        app.setState({
            PhysicalNewForm:this.state
        })
        */
    }

    // begin suggestion existing virtuals when name input field is focused
    nameFocus(e) {
      this.suggestVirtual(e);
    }

    suggestVirtual(e) {
      this.update({name:e.target.value})

      var query = e.target.value.trim();
      if(!query) {
        app.changeState({
          inventoryPath: {
            suggestMode: false
          }
        });
        return true;
      }

      app.changeState({
        inventoryPath: {
          suggestMode: {
            results: ['foo'],
            loading: true
          }
        }
      });

      var s = app.remote.searchVirtuals(query, {
        offset: 0,
        maxResults: 20
      });

      var results = []

      s.on('data', function(data) {
        if(!e.target.value.trim()) return;
        results = results.concat([data]);

        console.log("RESULTS:", results.length);

        app.changeState({
          inventoryPath: {
            suggestMode: {
              results: results
            }
          }
        });

      }.bind(this));

      s.on('end', function() {
        if(!e.target.value.trim()) {
          app.changeState({
            inventoryPath: {
              suggestMode: false
            }
          });    
          return;
        }
        app.changeState({
          inventoryPath: {
            suggestMode: {
              results: results,
              loading: false
            }
          }
        });        
      });

      return true;
    }

    // stop suggestion existing virtuals when name input field loses focus
    nameBlur(e) {

    }

    descriptionFocus(e) {
      app.changeState({
        inventoryPath: {
          suggestMode: false
        }
      });
    }

    onName(e) {
        this.update({name:e.target.value})
    }
    onInstances(e) {
        this.update({instances:e.target.value})
    }
    onDescription(e) {
        this.update({description:e.target.value})
    }
    onGenotype(e) {
        this.update({genotype:e.target.value})
    }
    onLicense(e) {
        this.update({license:e.target.value})
    }
    onFreeGenes(e) {
        this.update({freeGenes:e.target.value})
    }
    onFreeGenesStage(e) {
        this.update({freeGenesStage:e.target.value})
    }
    onSequence(e) {
        this.update({sequence:e.target.value})
    }
    onProvenance(e) {
        this.update({provenance:e.target.value})
    }
    onIsAvailable(e) {
        this.update({isAvailable:e.target.value})
    }
    onSetColor(color, c) {
        this.update({color:color})
    }
    onSave() {
        console.log('PhysicalNew onSave:',this.state)
        if (this.props.onSaveNew) this.props.onSaveNew(this.state)
    }
    render() {
      let selectedRecord = this.props.selectedRecord;
      let parentRecord = this.props.parentRecord;
      let children = null
      
      if (this.props.selectedRecord.children) {
          children = this.props.selectedRecord.children.map((child, index) => {
            return (
              <div class="container-child">
                Row {child.row}, Col {child.column}: {child.name} 
              </div>
            )
          });
      }
        var colorPicker = null
        if (this.state.enableColorPicker) {
            colorPicker = (
                    <div style={{position:'relative',display:'inline-block',backgroundColor:'#ffffff'}}>
                        <div style={{position:'fixed',zIndex:'11000'}}>
                            <ColorPicker value={this.state.color} onDrag={this.onSetColor.bind(this)}/>
                        </div>
                    </div>
                )
        }
        
      return (
        <div class="PhysicalNewForm">
          <form autocomplete="off">
          <div class="panel-block">

            <div class="columns is-multiline">
          
              <div class="column is-12">
                <div class="columns is-mobile">
                  <div class="column is-narrow">
                    <label class="label">Name</label>
                  </div>
                  <div class="column">   
                    <input 
                      class="input  "
                      type="text" 
                      name="name"
                      placeholder="Physical Name"
                      onChange={this.onName.bind(this)}
                      value={this.state.name}
                      onInput={this.suggestVirtual.bind(this)}
                      onFocus={this.nameFocus.bind(this)}
                      onBlur={this.nameBlur.bind(this)}
                    />
                  </div>
                </div>
              </div>
    
              <div class="column is-12">
                <div class="columns is-gapless">
                  <div class="column is-narrow">
                    <label class="label">Description</label>
                  </div>
                  <div class="column">   
                    <textarea 
                      class="textarea  "
                      name="description"
                      rows="2"
                      placeholder="A short description of the Physical."
                      onChange={this.onDescription.bind(this)}
                      value={this.state.description} 
                      onFocus={this.descriptionFocus.bind(this)}
                    ></textarea>
                  </div>
                </div>
              </div>              
    
              <div class="column is-12">
                <div class="columns">
                  <div class="column is-narrow">
                    <label class="label">Is Available?</label>
                  </div>
                  <div class="column">   
                    <div class="control">
                      <label class="radio">
                        <input type="radio" name="available"
                          onChange={this.onIsAvailable.bind(this)}
                        />
                        &nbsp;Yes
                      </label>
                      <label class="radio">
                        <input type="radio" name="available"
                          onChange={this.onIsAvailable.bind(this)}
                        checked/>
                        &nbsp;No
                      </label>
                    </div>
                  </div>
                </div>
              </div>
    
              <div class="column is-12">
                <div class="columns">
                  <div class="column is-narrow">
                    <label class="label">License</label>
                  </div>
                  <div class="column">   
                    <div class="select">
                      <select
                        name="license"
                          onChange={this.onLicense.bind(this)}
                        >
                        <option value="OpenMTA">OpenMTA</option>
                        <option value="UBMTA">UBMTA</option>
                        <option value="Limbo">Limbo</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
    
              <div class="column is-12">
                <div class="columns is-mobile">
                  <div class="column is-narrow">
                    <label class="label">Instances</label>
                  </div>
                  <div class="column">   
                    <input 
                      class="input is-small"
                      type="number" 
                      min="1"
                      onChange={this.onInstances.bind(this)}
                      value={this.state.instances} 
                    />
                  </div>
                </div>  
              </div>
    
              <div class="column is-12">
                <div class="columns is-mobile">
                  <div class="column is-narrow">
                    <label class="label">Color</label>
                  </div>
                    <span onClick={this.onSelectColor.bind(this)} style={{backgroundColor:this.state.color}}>
                        {this.state.color}
                    </span>
                    {colorPicker}
                </div>  
              </div>
    
              <div class="column is-12">
                <div class="columns is-mobile">
                  <div class="column is-narrow">
                    <label class="label">Genotype</label>
                  </div>
                  <div class="column">   
                    <input 
                      class="input"
                      type="text" 
                      name="genotype"
                      onChange={this.onGenotype.bind(this)}
                    />
                  </div>
                </div>  
              </div>
    
              <div class="column is-12">
                <div class="columns is-mobile">
                  <div class="column is-narrow">
                    <label class="label">Provenance</label>
                  </div>
                  <div class="column">   
                    <input 
                      class="input"
                      type="text" 
                      name="provenance"
                      onChange={this.onProvenance.bind(this)}
                    />
                  </div>
                </div>
              </div>
    
              <div class="column is-12">
                <div class="columns">
                  <div class="column is-narrow">
                    <label class="label">Sequence</label>
                  </div>
                  <div class="column">   
                    <textarea 
                      class="textarea" 
                      name="sequence"
                      rows="3"
                      onChange={this.onSequence.bind(this)}
                    ></textarea>
                  </div>
                </div>
              </div>
    
              <div class="column is-12">
                <div class="columns">
                  <div class="column is-narrow">
                    <label class="label">Submitted To FreeGenes?</label>
                  </div>
                  <div class="column">   
                    <div class="control">
                      <label class="radio">
                        <input
                            type="radio"
                            name="freeGenes"
                            value={true}
                            onChange={this.onFreeGenes.bind(this)}
                            checked={this.state.freeGenes}
                        />
                        &nbsp;Yes
                      </label>
                      <label class="radio">
                        <input
                            type="radio"
                            name="freeGenes"
                            value={false}
                            onChange={this.onFreeGenes.bind(this)}
                            checked={!this.state.freeGenes}
                        />
                        &nbsp;No
                      </label>
                    </div>
                  </div>
                </div>
              </div>
    
              <div class="column is-12">
                <div class="columns">
                  <div class="column is-narrow">
                    <label class="label">FreeGenes Stage</label>
                  </div>
                  <div class="column">   
                    <div class="select">
                      <select
                        name="freeGenesStage"
                          onChange={this.onFreeGenesStage.bind(this)}
                        >
                        <option value="0">0 - Not Submitted</option>
                        <option value="1">1 - Submitted</option>
                        <option value="2">2 - Optimizing</option>
                        <option value="3">3 - Synthesizing</option>
                        <option value="4">4 - Cloning</option>
                        <option value="5">5 - Sequencing</option>
                        <option value="6">6 - Shipping</option>
                        <option value="7">7 - Delivered</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div> 
    
            </div>
          </div>
          </form>
        </div>
      )
    }
  }
}  
