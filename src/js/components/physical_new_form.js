
import { h } from 'preact';

module.exports = function(Component) {

  return class PhysicalNewForm extends Component {
      
    constructor(props, context) {
        super(props, context)
        this.state={
            name:'',
            description:'',
            content:'',
            instances:1
        }
    }
    update(newProps) {
        const newState = Object.assign(this.state, newProps)
        this.setState(newState,()=>{/*console.log('PhysicalNew update:',this.state)*/})
        if (this.props.onChange) this.props.onChange(newProps)
    }
    onName(e) {
        this.update({name:e.target.value})
    }
    onDescription(e) {
        this.update({description:e.target.value})
    }
    onContent(e) {
        this.update({content:e.target.value})
    }
    onInstances(e) {
        this.update({instances:e.target.value})
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
        
      return (
        <div class="PhysicalNewForm">
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
                        <input type="radio" name="available" />
                        &nbsp;Yes
                      </label>
                      <label class="radio">
                        <input type="radio" name="available" checked/>
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
                      <select name="license">
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
                    <label class="label">Content</label>
                  </div>
                  <div class="column">   
                    <textarea 
                      class="textarea is-small"
                      rows="2"
                      placeholder="Markdown content."
                      onChange={this.onContent.bind(this)}
                      value={this.state.content} 
                    ></textarea>
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
                    <label class="label">Genotype</label>
                  </div>
                  <div class="column">   
                    <input 
                      class="input"
                      type="text" 
                      name="genotype"
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
                        <input type="radio" name="freeGenes" />
                        &nbsp;Yes
                      </label>
                      <label class="radio">
                        <input type="radio" name="freeGenes" checked/>
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
                      <select name="freeGenesStage">
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
    
              <div class="column is-12">
                <div class="columns is-gapless">
                  <div class="column is-narrow">
                  <button onClick={this.onSave.bind(this)} >Save</button>
                  </div>
                </div>
              </div>
    
            </div>
          </div>
        </div>
      )
    }
  }
}  