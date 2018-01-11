
import {h} from 'preact';
import linkState from 'linkstate';
import merge from 'deepmerge';

module.exports = function(Component) {

/*
  TODO 

  Add functionality to ashnazg for running a function when a part of state changes.
  It should receive the previous and new states.
  Bind this component's state to app.state.search
  then set a function that listens for state changes to app.state.search
  and if there are changes to app.state.search.query or app.state.search.page
  then run the async search query and update app.state.search.results.
  This will trigger one more run of the function monitoring the state
  changes but then it won't trigger another query and that will be it.

*/

  var SearchResults = require('./search_results.js')(Component)

  return class Search extends Component {

    constructor(props) {
      super(props);

//      this.listen('runQuery', function(newState) {
//        if(newState) {
//          this.doSearch(newState, this.state.page);
//        }
//        console.log(this.state);
//      }.bind(this));


      this.state = {
        query: this.props.match.params.query,
        page: parseInt(this.props.match.params.page) || 1,
        results: [],
        perPage: 25
      };

//      this.doSearch(this.state.query, this.state.page);

    };

    doSearch(query, page) {
      console.log("SEARCHING");
      var self = this;
      this.fakeSearch(query, page - 1, function(err, data) {
        console.log("GOT RESULTS:", data.results.length);

        // TODO changeState is broken (it appends arrays when it should replace them)
        self.setState({
          results: data.results,
          hits: data.hits
        });
      });
    }
    
    // TODO have ashnazg add this to the Component class
    changeState(stateChange) {
      var newState = merge(this.state, stateChange, {clone: true});
      this.setState(newState);
    }

    fakeResults(start, length) {
      var results = [];
      var i;
      for(i=start; i < start + length; i++) {
        results.push({
          name: "This is a fake result " + i,
          description: "Yeah it's really a fake result. Very fake. I don't know if I can really say much more about it. I just feel so full of fnord."
        });
      }

      return {
        results: results,
        hits: 100
      }
    }

    fakeSearch(query, page, cb) {
      var self = this;
      setTimeout(function() {
        cb(null, self.fakeResults(page * self.state.perPage, self.state.perPage));
      }, 300);
    }

    search(e) {
      e.preventDefault();
      app.actions.route('/search/' + encodeURI(this.state.query));
    }

    componentWillReceiveProps(nextProps) {

      if(nextProps.match.params.query !== this.props.match.params.query || 
         nextProps.match.params.page !== this.props.match.params.page) {
        this.doSearch(nextProps.match.params.query, nextProps.match.params.page || 1);
      }
    }


	  render() {

      return (
        <div>
          <form onsubmit={this.search.bind(this)}>
            <input type="text" oninput={linkState(this, 'query')} placeholder="Search the bionet" />
          </form>
          <SearchResults query={this.state.query} results={this.state.results} page={this.state.page} numpages={Math.ceil(this.state.hits / this.state.perPage)} />
        </div>
      )
    }
  }
}
