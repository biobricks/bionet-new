import { h } from 'preact';
import PropTypes from 'prop-types';

module.exports = function(Component) {

  return class ContainerEditForm extends Component {
/*      
    static defaultProps = {
        name: '',
        description: '',
        width: 1,
        height: 1,
        units: 'm',
        color:'aqua',
        majorGridLine: 1
    }

    static propTypes = {
        name: PropTypes.string,
        description: PropTypes.string,
        width: PropTypes.number,
        height: PropTypes.number,
        units: PropTypes.string,
        color: PropTypes.string,
        majorGridLine: PropTypes.number
    }
*/
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
            const width=(props.selectedRecord.width) ? props.selectedRecord.width : 1
            const height=(props.selectedRecord.height) ? props.selectedRecord.height : 1
            //const width=(props.selectedRecord.width) ? props.selectedRecord.width/gridItemSize : 1
            //const height=(props.selectedRecord.height) ? props.selectedRecord.height/gridItemSize : 1
            this.setState({
                id: props.selectedRecord.id,
                name: props.selectedRecord.name,
                description: props.selectedRecord.description,
                xUnits: xUnits,
                yUnits: yUnits,
                width: width,
                height: height,
                units: props.selectedRecord.units,
                color: props.selectedRecord.color,
                majorGridLine: props.selectedRecord.majorGridLine
            })
        }
    }
      
    update(newProps) {
        const newState = Object.assign(this.state, newProps)
        this.setState(newState)
        if (this.props.onChange) this.props.onChange(newProps)
        
        //const gridItemSize = this.gridItemSize
        //newState.width *= gridItemSize
        //newState.height *= gridItemSize
        
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
    onDescription(e) {
        this.update({description:e.target.value})
    }
    onXUnits(e) {
        this.update({xUnits:Number(e.target.value)})
    }
    onYUnits(e) {
        this.update({yUnits:Number(e.target.value)})
    }
    onWidth(e) {
        this.update({width:Number(e.target.value)})
    }
    onHeight(e) {
        this.update({height:Number(e.target.value)})
    }
    onMajorGridLine(e) {
        this.update({majorGridLine:Number(e.target.value)})
    }
    onUnits(e) {
        this.update({units:e.target.value})
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
                    <label class="label">X axis grid units</label>
                  </div>
                  <div class="column">   
                    <input 
                      class="input  "
                      type="number" 
                      onChange={this.onXUnits.bind(this)}
                      value={this.state.xUnits}
                    />
                  </div>
                </div>
              </div>              
          
            <div class="column is-12">
                <div class="columns is-gapless">
                  <div class="column is-narrow">
                    <label class="label">Y axis grid units</label>
                  </div>
                  <div class="column">   
                    <input 
                      class="input  "
                      type="number" 
                      onChange={this.onYUnits.bind(this)}
                      value={this.state.yUnits}
                    />
                  </div>
                </div>
              </div>
          
            <div class="column is-12">
                <div class="columns is-gapless">
                  <div class="column is-narrow">
                    <label class="label">Width</label>
                  </div>
                  <div class="column">   
                    <input 
                      class="input  "
                      type="number" 
                      onChange={this.onWidth.bind(this)}
                      value={this.state.width}
                    />
                  </div>
                </div>
              </div>
          
            <div class="column is-12">
                <div class="columns is-gapless">
                  <div class="column is-narrow">
                    <label class="label">Height</label>
                  </div>
                  <div class="column">   
                    <input 
                      class="input  "
                      type="number" 
                      onChange={this.onHeight.bind(this)}
                      value={this.state.height}
                    />
                  </div>
                </div>
              </div>
          
            <div class="column is-12">
                <div class="columns is-gapless">
                  <div class="column is-narrow">
                    <label class="label">Units</label>
                  </div>
                  <div class="column">   
                    <select
                        value={this.state.units}
                        onChange={this.onUnits.bind(this)}
                        style={{paddingTop:'4px'}}
                        >
                        <option value="m">m</option>
                        <option value="cm">cm</option>
                        <option value="mm">mm</option>
                        <option value="ft">ft</option>
                        <option value="in">in</option>
                    </select>
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