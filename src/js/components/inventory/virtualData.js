import {
    h
}
from 'preact'
import marked from 'marked';
import strftime from 'strftime'
import {Link} from 'react-router-dom';

module.exports = function (Component) {
    
    return class VirtualData extends Component {
        constructor(props) {
            super(props);
            this.componentWillReceiveProps(this.props)
        }
        
        componentWillReceiveProps(nextProps) {
            
        }
        
        render() {
            if (!this.props.virtual) return null
            
            const formatTime = function(unixEpochTime) {
              return strftime('%b %o %Y', new Date(unixEpochTime * 1000));
            }
            var timestamps = [(
                <div>
                First created: <span>{formatTime(this.props.virtual.created.time)}</span> by <span>{this.props.virtual.created.user}</span>
                </div>
            )];

            if(this.props.virtual.updated.time > this.props.virtual.created.time) {
              timestamps.push((
                  <div>
                  Last updated: <span>{formatTime(this.props.virtual.updated.time)}</span> by <span>{this.props.virtual.updated.user}</span>
                  </div>
              ));
            };

            var sequence = '';
            if(this.props.virtual.Sequence) {
                sequence = (
                  <textarea rows="10" cols="50" disabled>{this.props.virtual.Sequence.toUpperCase()}</textarea>
                );
            }
            var modifyLinks = '';
            if(app.state.global.user) {
              modifyLinks = (
                  <span><Link to={'/virtual/edit/' + this.props.virtual.id}>edit</Link></span>
              );
            }
            var content = '';
            if(this.props.virtual.content) {
              content = (
                <div class="content">
                  <hr/>
                  <div class="markdown-help" dangerouslySetInnerHTML={{
                    __html: marked(this.props.virtual.content)
                  }} />
                  <hr/>
                </div>
              );
            }
    
            return (
                  <div>
                    <div>
                      <h3>{this.props.virtual.name}</h3>
                    </div>
                    <div>
                      <span style="font-weight:bold">Description:</span> {this.props.virtual.description}
                    </div>
                    {content}
                    <div>
                      <span style="font-weight:bold">Provenance:</span> {this.props.virtual.provenance || "Unknown"}
                    </div>
                    <div>
                      <span style="font-weight:bold">Genotype:</span> {this.props.virtual.genotype || "None"}
                    </div>
                    <div>
                      <span style="font-weight:bold">Sequence:</span> {this.props.virtual.sequence || "None"}
                    </div>
                    <div>
                      <span style="font-weight:bold">Terms and condition:</span> {this.props.virtual.terms || "Limbo"}
                    </div>
                    <div>{timestamps}</div>
                    <div>{sequence}</div>
                  </div>
            )
        }
    }
}
        