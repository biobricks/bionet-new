import { h } from 'preact';
import ColorPicker from 'react-color-picker'

module.exports = function(Component) {

  return class PhysicalEditForm extends Component {
    constructor(props, context) {
        super(props, context)
        this.state={
            name:'',
            description:'',
            enableColorPicker:false,
            color:'aqua',
            isAvailable:true,
            freeGenes:false
        }
    }
      
    componentWillReceiveProps(props) {
        const item=props.selectedRecord
        if (item) {
            this.setState({
                freeGenesStage:item.freeGenesStage,
                color:item.color,
                name:item.name,
                description:item.description,
                genotype:item.genotype,
                license:item.license,
                freeGenes:item.freeGenes,
                sequence:item.sequence,
                provenance:item.provenance,
                isAvailable:item.isAvailable,
            })
        }
    }
      
    update(newProps) {
        const newState = Object.assign(this.state, newProps)
        console.log('PhysicalEdit update:',newState)
        
        this.setState(newState,()=>{console.log('PhysicalEdit update:',this.state)})
        if (this.props.onChange) this.props.onChange(newProps)
        
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
        this.update({freeGenes:e.target.value==='free'})
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
        this.update({isAvailable:e.target.value==='available'})
    }
    onSelectColor(e) {
        this.setState({enableColorPicker:!this.state.enableColorPicker})
    }
    onSetColor(color, c) {
        this.update({color:color})
        this.setState({enableColorPicker:false})
    }
    onSave() {
        console.log('PhysicalNew onSave:',this.state)
        if (this.props.onSaveNew) this.props.onSaveNew(this.state)
    }

    render() {
        let selectedRecord = this.props.selectedRecord;
        let parentRecord = this.props.parentRecord;
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
        <div class="PhysicalEditForm">
          <div class="panel-block">

            <div class="columns is-multiline">
              <div class="column is-12">
                <div class="columns is-mobile">
                  <div class="column is-narrow">
                    <label class="label">Name</label>
                  </div>
                  <div class="column">   
                    <input 
                      class="input"
                      type="text"
                      name="name" 
                      onChange={this.onName.bind(this)}
                      value={this.state.name}
                    />
                  </div>
                </div>
              </div>
              <div class="column is-12">
                <div class="columns">
                  <div class="column is-narrow">
                    <label class="label">Description</label>
                  </div>
                  <div class="column">   
                    <textarea 
                      class="textarea"
                      name="description" 
                      value={this.state.description}
                      onChange={this.onDescription.bind(this)}
                      rows="2"
                    >{this.state.description}</textarea>
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
                        <input
                            type="radio"
                            name="available"
                            value="available"
                            checked={this.state.isAvailable}
                            onChange={this.onIsAvailable.bind(this)}
                        />
                        &nbsp;Yes
                      </label>
                      <label class="radio">
                        <input
                            type="radio"
                            name="available"
                            value="unavailable"
                            checked={!this.state.isAvailable}
                            onChange={this.onIsAvailable.bind(this)}
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
                    <label class="label">Provenance</label>
                  </div>
                  <div class="column">   
                    <input 
                      class="input"
                      type="text"
                      name="provenance"
                      onChange={this.onProvenance.bind(this)}
                      value={this.state.provenance}
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
                      value={this.state.genotype}
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
                      value={this.state.sequence}
                      onChange={this.onSequence.bind(this)}
                      rows="3"
                    >{this.state.sequence}</textarea>
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
                            value="free"
                            onChange={this.onFreeGenes.bind(this)}
                            checked={this.state.freeGenes}
                        />
                        &nbsp;Yes
                      </label>
                      <label class="radio">
                        <input
                            type="radio"
                            name="freeGenes"
                            value="notfree"
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
        </div>
      )
    }
  }
}  