
import {h} from 'preact';
import linkState from 'linkstate';
import {Link} from 'react-router-dom';
import xtend from 'xtend';
import util from '../util.js';

// TODO import something better
function diff(a, b) {
  if(!a || !b) return true;
  var allKeys = Object.keys(a).concat(Object.keys(b));
  var i;
  for(i=0; i < allKeys.length; i++) {
    if(a[allKeys[i]] !== b[allKeys[i]]) return true;
  }
  return false;
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
          scope: 'local',
          text: this.props.match.params.query,
          type: this.props.match.params.type || 'human',
          onlyAvailable: !!(this.props.match.params.available)
        },
        page: parseInt(this.props.match.params.page) || 1,
        results: [],
        perPage: 25,
      };

      util.whenConnected(function() {
//        if(this.state.query) {
//          this.doSearch();
//        }
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

    changeScope(e) {
      if(!e || !e.target || !e.target.value) return;

      this.changeState({
        query: {
          scope: e.target.value
        },
        page: 1
      });

      const el = document.getElementById('query');
      el.focus();
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
    doSearch(isNewQuery) {

      if(!this.state.query || !this.state.query.text || !this.state.query.text.trim()) return;

      this.setState({
        loading: true,
        results: [],
        page: parseInt(this.state.page),
        isNewQuery: isNewQuery,
        lastQuery: xtend(this.state.query, {})
      });

      if(this.state.query.scope === 'global') {
      console.log("SEARCHING:", this.state.page, this.state.query);

        var stream = app.actions.search.global(this.state.query.type, this.state.query.text);

        this.changeState({
          hits: undefined
        });
        this.gotResultStream(stream, {});

        return;
      }

      var q = app.actions.search[this.state.query.type];
      if(!q) {
        app.actions.notify("Invalid query type", 'error');
        console.error("Invalid query type:", this.state.query.type)
        return;
      }

      // Currently only 'blast' queries have a callback.
      // Other query types just return a stream and number of hits is unknown.
      if(this.state.query.type !== 'blast') {
        var stream = q(this.state.query.text, this.state.page, this.state.perPage, {
          includeAvailability: true,
          onlyAvailable: this.state.query.onlyAvailable
        });
        this.changeState({
          hits: undefined
        });
        this.gotResultStream(stream, {
          streamHits: true
        });
        return;
      }

      q(this.state.query.text, this.state.page, this.state.perPage, {
        includeAvailability: true,
        onlyAvailable: this.state.query.onlyAvailable
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

      // cancel any in-progress streaming results
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
        url += '/' + encodeURIComponent(this.state.query.scope || 'local');
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

        this.changeState({
          query: {
            text: nextProps.match.params.query,
            scope: nextProps.match.params.scope || 'local', 
            type: nextProps.match.params.type || 'human',
            onlyAvailable: !!(nextProps.match.params.available)
          },
          page: nextProps.match.params.page || 1
        })

        const isNewQuery = diff(this.state.query, this.state.lastQuery);
        const isNewPage = this.props.match.params.page !== nextProps.match.params.page;
        if(isNewQuery || isNewPage) {
          this.doSearch(isNewQuery);
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
                <input type="radio" name="scope" value="local" onchange={this.changeScope.bind(this)} checked={this.state.query.scope === 'local'} />
                Local search
              </label>
              <label class="radio">
                <input type="radio" name="scope" value="global" onchange={this.changeScope.bind(this)} checked={this.state.query.scope === 'global'} />
                Global search
              </label>
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
