
import {h} from 'preact';
import linkState from 'linkstate';
import merge from 'deepmerge';
import {Link} from 'react-router-dom';

module.exports = function(Component) {

  return class SearchResults extends Component {
   
    constructor(props) {
      super(props);
      this.state = {
        page: 0
      };
    };

    componentWillReceiveProps(nextProps) {
//      console.log("RECEIVE search_results");
    }

	  render() {

//      console.log("RENDER search_results", this.props);

      var results;

      var numPages = this.props.numpages || 0;

      if(!this.props.results.length) {
        results = (
          <p>no results</p>
        );

      } else {
//        var start = this.state.page * this.state.perPage;
//        var pageResults = this.props.results.slice(start, start + this.state.perPage);
//        console.log("this.props.results", this.props.results)
        results = this.props.results.map(function(result) {
          return (<p>{result.name}</p>);
        });

      }

      var pageLinks = [];
      if(numPages > 1) {
        var i;
        for(i=0; i < numPages; i++) {
          pageLinks.push((
              <li><Link to={'/search/'+encodeURI(this.props.query)+'/'+(i+1)}>{i+1}</Link></li>
          ))
        }
      }

      
      return (
        <div>
          <div>PAGE: {this.props.page}</div>
          <div>
            {results}
          </div>
          <ul>
            {pageLinks}
          </ul>
        </div>
      )
    }
  }
}
