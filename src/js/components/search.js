
import {h} from 'preact';
import linkState from 'linkstate';
import {Link} from 'react-router-dom';

module.exports = function(Component) {

  var SearchResults = require('./search_results.js')(Component)

  return class Search extends Component {

    constructor(props) {
      super(props);

      this.queryID = 0;

      this.state = {
        prevQuery: undefined,
        query: this.props.match.params.query,
        page: parseInt(this.props.match.params.page) || 1,
        results: [],
        perPage: 25
      };

      if(this.state.query) {
        this.doSearch(this.state.query, this.state.page);
      }
    };

    doSearch(query, page) {

      this.changeState({
        prevQuery: query,
        page: page,
        loading: true,
        newQuery: !(query == this.state.prevQuery)
      });

      this.queryID++;

      this.fakeSearch(query, page - 1, this.queryID, function(err, queryID, data) {

        // if multiple queries have been started before one returns
        // then only accept results from most recent query
        if(queryID !== this.queryID) return;

        this.changeState({
          page: page,
          results: data.results,
          hits: data.hits,
          loading: false
        });
      }.bind(this));
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

    fakeSearch(query, page, queryID, cb) {
      var self = this;
      setTimeout(function() {
        cb(null, queryID, self.fakeResults(page * self.state.perPage, self.state.perPage, query));
      }, 3000);
    }

    search(e) {
      e.preventDefault();
      app.actions.route('/search/' + encodeURI(this.state.query));
    }

    componentWillReceiveProps(nextProps) {

      if(!nextProps.match.params.query) {
        this.changeState({
          page: 1,
          results: [],
          hits: 0
        })

      } else {

         if(nextProps.match.params.query !== this.props.match.params.query || 
         nextProps.match.params.page !== this.props.match.params.page) {
           this.doSearch(nextProps.match.params.query, nextProps.match.params.page || 1);
         }
      }
    }


	  render() {

      var results;
      // this occurs when running a new search but not when paginating
      if(this.state.loading && this.state.newQuery) {

        results = (
          <div class="spinner">
            <div class="cssload-whirlpool"></div>
          </div>
        );
      } else if(this.state.prevQuery) {
        results = (
          <SearchResults query={this.state.query} loading={this.state.loading} results={this.state.results} page={this.state.page} numpages={Math.ceil(this.state.hits / this.state.perPage)} />
        );
      }

      return (
        <div>

          <form onsubmit={this.search.bind(this)}>
            <div class="field has-addons">
              <div class="control">
                <input class="input" type="text" oninput={linkState(this, 'query')} placeholder="Search the bionet" value={this.state.query} />
              </div>
              <div class="control">
                <a class="button is-info" onclick={this.search.bind(this)}>
                  Search
                </a>
              </div>
            </div>
            <div class="hint">
              
              <div class="hint-label">Hint:</div>
              <div class="hint-text">
                <p>You can search for using either human language or DNA/AA sequence.</p>
                <p class="other">For advanced search tips have a look at <Link to="/help/search">search syntax help</Link>.</p>
              </div>
              <div class="float-clear"></div> 
            </div>
          </form>

          {results}
        </div>
      )
    }
  }
}
