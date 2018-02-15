
import {h} from 'preact';
import linkState from 'linkstate';
import {Link} from 'react-router-dom';
import util from '../util.js';

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

      util.whenConnected(function() {
        if(this.state.query) {
          this.doSearch(this.state.query, this.state.page);
        }
      }.bind(this));
    };

    doSearch(query, page) {

      this.changeState({
        prevQuery: query,
        page: page,
        loading: true,
        results: [],
        newQuery: !(query == this.state.prevQuery)
      });

      app.actions.search.auto(query, page - 1, this.perPage, function(err, metadata, stream) {
        if(err) {
          app.actions.notify("Search failed: " + err, 'error');
          console.error(err);
          return;
        }

        if(this.prevStream) {
          this.prevStream.destroy();
        }
        this.prevStream = stream;


        var isFirst = true;
        const self = this;

        stream.on('error', function(err) {
          // TODO handle better
          app.actions.notify("Search failed", 'error');
          console.error(err);
          self.prevStream = null;
        });
        

        this.changeState({
          hits: metadata.hits
        });
       
        stream.on('data', function(data) {
          self.changeState({
            results: this.state.results.concat([data]),
            loading: false
          });
        });

        stream.on('end', function() {
          self.changeState({
            loading: false
          });
          self.prevStream = null;
        });
                  
      }.bind(this));
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
                <p>You can search using either human language or a DNA/AA sequence.</p>
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
