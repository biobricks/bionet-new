import { h } from 'preact';
import PropTypes from 'prop-types';

module.exports = function(Component) {

  return class ContainerNewForm extends Component {

      static defaultProps = {
        name: '',
        description: '',
        xUnits: 1,
        yUnits: 1,
        color:'aqua',
        majorGridLine: 1,
        viewOrientation:'top'
    }

    static propTypes = {
        name: PropTypes.string,
        description: PropTypes.string,
        xUnits: PropTypes.number,
        yUnits: PropTypes.number,
        color: PropTypes.string,
        majorGridLine: PropTypes.number,
        viewOrientatoin: PropTypes.string
    }

    constructor(props, context) {
        super(props, context)
        this.state = props
    }
    
    update(newProps) {
        const newState = Object.assign(this.state, newProps)
        this.setState(newState)
        if (this.props.onChange) this.props.onChange(newProps)
        //todo: ashnagz doesn't seem to be setting state correctly
        const gridItemSize=40
        app.state.ContainerNewForm={
            name: this.state.name,
            description: this.state.description,
            xUnits: this.state.xUnits,
            yUnits: this.state.yUnits,
            color:this.state.color,
            majorGridLine: this.state.majorGridLine
        }
        /*
        app.setState({
            ContainerNewForm:this.state
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
        this.update({xUnits:Number(e.target.value)})
    }
    onYUnits(e) {
        this.update({yUnits:Number(e.target.value)})
    }
    onMajorGridLine(e) {
        this.update({majorGridLine:Number(e.target.value)})
    }
    onViewOrientation(e) {
        this.update({viewOrientation:e.target.value})
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
        <div class="ContainerNewForm">
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
                          style={{display:'inline-block',width:'80px'}}
                          onChange={this.onYUnits.bind(this)}
                          value={this.state.yUnits}
                        />
                        <label style={{display:'inline-block',fontSize:'1rem',fontWeight:700,marginLeft:'20px'}}>Columns</label>
                        <input 
                          type="number" 
                          min="1"
                          max="1000"
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