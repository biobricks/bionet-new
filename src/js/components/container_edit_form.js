import { h } from 'preact';
import PropTypes from 'prop-types';

module.exports = function(Component) {

  return class ContainerEditForm extends Component {

      constructor(props, context) {
        super(props, context)
        this.gridItemSize=40
        this.componentWillReceiveProps(props)
    }
    
    componentWillReceiveProps(props) {
        if (props.selectedRecord) {
            console.log('container_edit_form props:',props)
            const xUnits = (props.selectedRecord.layoutWidthUnits) ? props.selectedRecord.layoutWidthUnits : props.selectedRecord.xUnits
            const yUnits = (props.selectedRecord.layoutHeightUnits) ? props.selectedRecord.layoutHeightUnits : props.selectedRecord.yUnits
            const gridItemSize = this.gridItemSize

            this.setState({
                id: props.selectedRecord.id,
                name: props.selectedRecord.name,
                description: props.selectedRecord.description,
                xUnits: xUnits,
                yUnits: yUnits,
                color: props.selectedRecord.color,
                viewOrientation: (props.selectedRecord.viewOrientation) ? props.selectedRecord.viewOrientation : 'top',
                majorGridLine: props.selectedRecord.majorGridLine
            })
        }
    }
      
    update(newProps) {
        const newState = Object.assign(this.state, newProps)
        this.setState(newState)
        if (this.props.onChange) this.props.onChange(newProps)
        
        //todo: ashnagz doesn't seem to be setting state correctly
        app.state.ContainerEditForm=newState
        /*
        app.setState({
            ContainerEditForm:this.state
        })
        */
    }
    onName(e) {
        this.update({name:e.target.value})
    }
    onViewOrientation(e) {
        this.update({viewOrientation:e.target.value})
    }
    onDescription(e) {
        this.update({description:e.target.value})
    }
    onXUnits(e) {
        const value=Math.trunc(Number(e.target.value))
        this.update({xUnits:value})
    }
    onYUnits(e) {
        const value=Math.trunc(Number(e.target.value))
        this.update({yUnits:value})
    }
    onWidth(e) {
        const value=Math.trunc(Number(e.target.value))
        this.update({width:value})
    }
    onHeight(e) {
        const value=Math.trunc(Number(e.target.value))
        this.update({height:value})
    }
    onMajorGridLine(e) {
        this.update({majorGridLine:Number(e.target.value)})
    }
    onColor(e) {
        this.update({color:e.target.value})
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
        <div class="ContainerEditForm">
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
                      onChange={this.onName.bind(this)}
                      value={this.state.name}
                    />
                  </div>
                </div>
              </div>
    
              <div class="column is-12">
                <div class="columns">
                  <div class="column is-narrow">
                    <label class="label">View</label>
                  </div>
                  <div class="column">   
                    <div class="control">
                      <label class="radio">
                        <input
                            type="radio"
                            name="viewOrientation"
                            value="top"
                            onChange={this.onViewOrientation.bind(this)}
                            checked={(this.state.viewOrientation==='top')}
                            />
                        &nbsp;Top
                      </label>
                      <label class="radio">
                        <input
                            type="radio"
                            name="viewOrientation"
                            value="side"
                            onChange={this.onViewOrientation.bind(this)}
                            checked={(this.state.viewOrientation==='side')}
                        />
                        &nbsp;Side
                      </label>
                    </div>
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
                      value={this.state.description}
                      onChange={this.onDescription.bind(this)}
                      rows="2"
                    >{this.state.description}</textarea>
                  </div>
                </div>
              </div>              
          
            <div class="column is-12">
                <div class="columns is-gapless">
                  <div class="column is-narrow">
                    <span style={{display:'inline-block'}}>  
                        <label className="label">Rows</label>
                    </span>
                  </div>
                  <div class="column">   
                    <span style={{display:'inline-block'}}>  
                        <input 
                          type="number" 
                          min="1"
                          max="1000"
                          step="1"
                          style={{display:'inline-block',width:'80px'}}
                          onChange={this.onYUnits.bind(this)}
                          value={this.state.yUnits}
                        />
                        <label style={{display:'inline-block',fontSize:'1rem',fontWeight:700,marginLeft:'20px'}}>Columns2</label>
                        <input 
                          type="number" 
                          min="1"
                          max="1000"
                          step="1"
                          style={{display:'inline-block',width:'80px',marginLeft:'20px'}}
                          onChange={this.onXUnits.bind(this)}
                          value={this.state.xUnits}
                        />
                    </span>
                  </div>              
                </div>
              </div>              
          
            <div class="column is-12">
                <div class="columns is-gapless">
                  <div class="column is-narrow">
                    <label class="label">Grid Line</label>
                  </div>
                  <div class="column">   
                    <input 
                      class="input  "
                      type="number"
                      onChange={this.onMajorGridLine.bind(this)}
                      value={this.state.majorGridLine}
                    />
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