import {h} from 'preact';
import linkState from 'linkstate';
import merge from 'deepmerge';
import {Link} from 'react-router-dom';
import marked from 'marked';
import topics from '../../help/index.js';

module.exports = function(Component) {

  return class Help extends Component {
   
    constructor(props) {
      super(props);
      this.state = {
        topic: this.props.match.params.topic
      };
    }

    componentWillReceiveProps(nextProps) {
      if(nextProps.match.params.topic) {
        this.changeState({
          topic: nextProps.match.params.topic
        });
      }
    }

	  render() {

      var help;
      if(!topics[this.state.topic]) {
        help = (
          <div>
            <h1>Topic not found</h1>
            <p>No help entry found for the topic '{this.state.topic}'</p>
          </div>
        )
      } else {
        help = (
            <div class="markdown-help" dangerouslySetInnerHTML={{
              __html: marked(topics[this.state.topic])
            }} />
        )
      }

      return (
        <div class="help">
          {help}
        </div>
      )
    }
  }
}
