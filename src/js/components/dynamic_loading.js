import {h} from 'preact';
import util from '../util.js';
import {Link} from 'react-router-dom';

module.exports = function(Component) {

  return class DynamicLoading extends Component {
   
    constructor(props) {
      super(props);

      this.state = {
        error: undefined,
        ready: false,
        foo: props.match.params.foo || 'main'
      };

      this.loadJS(function(err, foo) {
        if(err) return console.error(err);

        foo.test();

      }.bind(this));
    };

    componentWillReceiveProps(nextProps) {

        this.setState({
          foo: nextProps.match.params.foo || 'main'
        });

    }

    loadJS(cb) {
      // try changing foo.js to a non-existant filename and watch it fail
      // also, the '.js' at the end of the filename is optional
      util.requireAsync('foo.js', function(err, foo) {
        if(err) {
          this.setState({
            error: err
          });
          if(cb) cb(err, foo);
          return;
        }
        
        this.setState({
          ready: true
        });
        if(cb) cb(null, foo);
      }.bind(this));

    }

	  render() {

      if(this.state.error) {
        return (
          <h3>ERROR: <span>{this.state.error}</span></h3>
        );
      }

      var status;
      if(this.state.ready) {
        status = "Successfully loaded dynamic js!";
      } else {
        status = "Loading...";
      }

      return (
        <div>
          <div>Status: <span>{status}</span></div>
          <div>foo: <span>{this.state.foo}</span></div>
          <Link to='/dynamic-loading/cookiecat'>Change sub-route</Link>
        </div>
      )
    }
  }
}
