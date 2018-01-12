
import {h} from 'preact';
import linkState from 'linkstate';
import merge from 'deepmerge';

module.exports = function(Component) {

  var SearchResults = require('./search_results.js')(Component)

  return class Search extends Component {

    constructor(props) {
      super(props);

      this.state = {
        query: this.props.match.params.query,
        page: parseInt(this.props.match.params.page) || 1,
        results: [],
        perPage: 25
      };

      this.doSearch(this.state.query, this.state.page);
    };

    doSearch(query, page) {
      var self = this;
      this.fakeSearch(query, page - 1, function(err, data) {

        self.changeState({
          page: page,
          results: data.results,
          hits: data.hits
        });
      });
    }
    
    fakeResults(start, length, postfix) {
      var results = [];
      var i;
      for(i=start; i < start + length; i++) {
        results.push({
          name: "This is a fake result - " + postfix + ' - ' +  i,
          description: "Yeah it's really a fake result. Very fake. I don't know if I can really say much more about it. I just feel so full of fnord."
        });
      }

      return {
        results: results,
        hits: 1000
      }
    }

    fakeSearch(query, page, cb) {
      var self = this;
      setTimeout(function() {
        cb(null, self.fakeResults(page * self.state.perPage, self.state.perPage, query));
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
