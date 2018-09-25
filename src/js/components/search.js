
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

  var SearchBar = require('./search_bar.js')(Component)
  var SearchResults = require('./search_results_new.js')(Component)
  var SearchPagination = require('./search_pagination.js')(Component)

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
          onlyAvailable: !!(this.props.match.params.available),
        },
        page: parseInt(this.props.match.params.page) || 1,
        results: [],
        perPage: 25,
        loading: false,
        
        // new stuff
        resultsView: false,
        status: "bionet search",
        inventoryView: false,
        inventoryEditView: false
      };

      util.whenConnected(function() {
        this.doSearch(true);
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

    doSearch(isNewQuery) {

      if(!this.state.query || !this.state.query.text || !this.state.query.text.trim()) return;

      this.setState({
        results: [],
        page: parseInt(this.state.page),
        isNewQuery: isNewQuery,
        lastQuery: xtend(this.state.query, {})
      });

      if(this.state.query.scope === 'global') {

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
          loading: false,
          resultsView: true
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

    n() {

    }

    search(e) {
      e.preventDefault();
      var query = this.state.query.text || '';
      query = query.trim();

      var url = '/search/';
      if(this.state.query && this.state.query.text) {
        url += encodeURIComponent(query);
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
          this.setState({
            loading: true,
            status: "Searching for " + this.state.query
          });
          util.whenConnected(function() {
            this.doSearch(isNewQuery);
          }.bind(this));
        }
      }
    }


	  render() {
      return (
      <section className="columns is-desktop is-gapless is-centered">  
        <div className="column is-8-desktop">
        	<div className="search-container">
    	      <div className="columns">
    	        <div className="column">
    	          <SearchBar 
    	          	query={ this.state.query.text }
                  status={ this.state.status }
                  loading={ this.state.loading }              
    	          	onChangeQuery={ this.onQueryInput.bind(this) }
    	          	onSubmitQuery={ this.search.bind(this) }
    	          />
                { (this.state.resultsView === true) ? (
                  <div>
                    <SearchResults 
                      {...this.state}
                      selectProfileView={ this.n }
                      changeSortKey={ this.n }
                      toggleSortAsc={ this.n }
                    />
                    <SearchPagination query={this.state.lastQuery} loading={this.state.loading} results={this.state.results} page={this.state.page} numpages={Math.ceil(this.state.hits / this.state.perPage)} perPage={this.state.perPage} />
                  </div>
                ) : (
                  <div class="panel">
                    <div class="panel-heading has-text-centered">
                      <h3 class="mb-0">Welcome To The BioNet!</h3>
                    </div>
                    <div class="panel-block is-block has-text-centered pb-2">
                      <h2 class="mt-1">A Free Biological Inventory Management System And Browser</h2>
                      <p>
                        Keep track of your stuff, find what you need, and share as you like. The bionet supports true asynchronous, peer-peer inventory management and sharing — all your inventory information is controlled locally by you. You decide if others can see what you wish to share. All BioNet software and associated materials are free to use.
                      </p>
                      <h2 class="mt-1">How Does It Work?</h2>
                      <iframe width="100%" height="400" src="https://www.youtube.com/embed/t29-RGggSU8?ecver=1" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
                    </div>
                  </div>                  
                )}
    	        </div>
    	      </div>
          </div>
        </div>
      </section>            
      );
    }
  }
}
