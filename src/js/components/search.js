
import {h} from 'preact';
import linkState from 'linkstate';
import {Link} from 'react-router-dom';
import xtend from 'xtend';
import util from '../util.js';

// TODO import something better
function diff(a, b) {
  var allKeys = Object.keys(a).concat(Object.keys(b));
  var i;
  for(i=0; i < allKeys.length; i++) {
    if(a[allKeys[i]] !== b[allKeys[i]]) return false;
  }
  return true;
}

module.exports = function(Component) {

  var SearchResults = require('./search_results.js')(Component)

  return class Search extends Component {

    constructor(props) {
      super(props);

      this.queryID = 0;


      this.state = {
        lastQuery: undefined,
        query: {
          text: this.props.match.params.query,
          type: this.props.match.params.type || 'human',
          onlyAvailable: !!(this.props.match.params.available)
        },
        page: parseInt(this.props.match.params.page) || 1,
        results: [],
        perPage: 25,
      };

      util.whenConnected(function() {
        if(this.state.query) {
          this.doSearch(this.state.query.text, this.state.page, this.state.query.type, this.state.query.onlyAvailable);
        }
      }.bind(this));
    }


    onQueryInput(e) {
      if(!e) return;
      if(typeof e === 'string') {
        var query = e;
      } else {
        if(!e.target || !e.target.value) {
          return;
        }
        var query = e.target.value;
      }

      if(this.state.query.type === 'blast') {
        query = util.stripNonNTChars(query);
      }

      this.changeState({
        query: {
          text: query
        },
        page: 1
      });
    }

    changeQueryType(e) {
      if(!e || !e.target || !e.target.value) return;

      this.changeState({
        query: {
          type: e.target.value
        },
        page: 1
      });

      const el = document.getElementById('query');

      this.onQueryInput(el.value);
      el.focus();
    }

    // TODO this should just use this.state rather than receiving properties
    // and should not run a query if no query params changed
    doSearch(query, page, type, onlyAvailable) {
      page = page || 1;
      type = type || 'human';
      onlyAvailable = !!(onlyAvailable);

      // TODO this shouldn't even be necessary
      const newQuery = {
        text: query,
        type: type,
        onlyAvailable: onlyAvailable
      };

      this.setState({
        loading: true,
        results: [],
        query: newQuery,
        page: parseInt(page),
        isNewQuery: diff(this.state.query, newQuery),
        queryType: type,
        queryOnlyAvailable: onlyAvailable,
        lastQuery: xtend(this.state.query, {})
      });

      var q = app.actions.search[this.state.queryType];
      if(!q) {
        app.actions.notify("Invalid query type", 'error');
        console.error("Invalid query type:", this.state.queryType)
        return;
      }

      // Currently only 'blast' queries have a callback.
      // Other query types just return a stream and number of hits is unknown.
      if(this.state.queryType !== 'blast') {
        var stream = q(query, this.state.page, this.state.perPage, {
          includeAvailability: true,
          onlyAvailable: onlyAvailable
        });
        this.changeState({
          hits: undefined
        });
        this.gotResultStream(stream, {
          streamHits: true
        });
        return;
      }

      q(query, this.state.page, this.state.perPage, {
        includeAvailability: true,
        onlyAvailable: onlyAvailable
      }, function(err, metadata, stream) {
        if(err) {
          app.actions.notify("Search failed: " + err, 'error');
          console.error(err);
          return;
        }

        this.changeState({
          hits: metadata.hits
        });
        
        this.gotResultStream(stream);
      }.bind(this));

    }

    gotResultStream(stream, opts) {
      opts = opts || {};

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
      
      var results = 0;
      stream.on('data', function(data) {
        var o = {
          loading: false
        };

        // TODO We're doing client side filtering here :(
        //      We should instead change the pagination buttons
        //      so they show that we don't know how many more results exist
        //      and filter on the server side.
        if(results < this.state.perPage) {
          o.results = this.state.results.concat([data]);
        }

        // if opts.streamHits is set
        // then we update the number of hits as they come in
        if(opts.streamHits) {
          o.hits = (this.state.perPage * (this.state.page - 1)) + this.state.results.length + 1;
        }
        self.changeState(o);

        results++;
      }.bind(this));

      stream.on('end', function() {
        self.changeState({
          loading: false
        });
        self.prevStream = null;
      });
      
    }
      


    search(e) {
      e.preventDefault();
      var url = '/search/';
      if(this.state.query && this.state.query.text) {
        url += encodeURIComponent(this.state.query.text);
        url += '/' + encodeURIComponent(this.state.page || 1);
        url += '/' + encodeURIComponent(this.state.query.type || 'human');
        if(this.state.query.onlyAvailable) {
          url += '/available'
        }
      }
      app.actions.route(url);
    }

    componentWillReceiveProps(nextProps) {

      if(!nextProps.match.params.query) {
        this.changeState({
          page: 1,
          results: [],
          hits: 0
        })

      } else {

        // TODO this should just set state based on params and call doSearch
         if(nextProps.match.params.query !== this.props.match.params.query 
            || nextProps.match.params.page !== this.props.match.params.page
            || nextProps.match.params.type !== this.props.match.params.type
            || nextProps.match.params.available !== this.props.match.params.available 
           || !this.state.lastQuery) {

           this.doSearch(nextProps.match.params.query, nextProps.match.params.page, nextProps.match.params.type, nextProps.match.params.available);
         }
      }
    }


	  render() {

      var results;
      // this occurs when running a new search but not when paginating
      if(this.state.loading && this.state.isNewQuery) {

        results = (
          <div class="spinner">
            <div class="cssload-whirlpool"></div>
          </div>
        );
      } else if(this.state.lastQuery) {
        results = (
          <SearchResults query={this.state.lastQuery} loading={this.state.loading} results={this.state.results} page={this.state.page} numpages={Math.ceil(this.state.hits / this.state.perPage)} />
        );
      }

      return (
        <div>

          <form onsubmit={this.search.bind(this)}>
            <div class="field has-addons">
              <div class="control">
                <input class="input" id="query" type="text" oninput={this.onQueryInput.bind(this)} placeholder="Search the bionet" value={this.state.query.text} />
              </div>
              <div class="control">
                <a class="button is-info" onclick={this.search.bind(this)}>
                  Search
                </a>
              </div>
            </div>
            <div class="control">
              <label class="radio">
                <input type="radio" name="type" value="human" onchange={this.changeQueryType.bind(this)} checked={this.state.query.type === 'human'} />
                Human language
              </label>
              <label class="radio">
                <input type="radio" name="type" value="blast" onchange={this.changeQueryType.bind(this)} checked={this.state.query.type === 'blast'} />
                DNA/RNA
              </label>
              <label class="radio" disabled>
                <input type="radio" name="type" value="blast_aa" onchange={this.changeQueryType.bind(this)} checked={this.state.query.type === 'blast_aa'} disabled />
                Amino Acid Sequence
              </label>
            </div>
            <div class="field">
              <div class="control">
                <label class="checkbox">
                <input id="onlyAvailable" type="checkbox" onchange={linkState(this, 'query.onlyAvailable')} checked={this.state.query.onlyAvailable} />
                &#160;Search only currently available materials
                </label>
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
