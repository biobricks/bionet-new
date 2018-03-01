
import {h} from 'preact';
import linkState from 'linkstate';
import merge from 'deepmerge';
import {NavLink, Link} from 'react-router-dom';

module.exports = function(Component) {

  return class SearchResults extends Component {
   
    constructor(props) {
      super(props);
      this.state = {
        page: 0
      };
    };

    componentWillReceiveProps(nextProps) {

    }
    
    // TODO generating a url for a query should be a re-usable function
    pageUrl(pageNumber) {
      var url = '/search/'+encodeURI(this.props.query.text);
      url += '/'+pageNumber;
      url += '/'+this.props.query.scope;
      url += '/'+this.props.query.type;
      if(this.props.query.onlyAvailable) {
        url += '/available';
      }
      return url;
    }

    pageLink(pageNumber, curPage, classes) {

      classes = classes || ''
      if(classes instanceof Array) classes = classes.join(' ');
      const label = "Goto page " + pageNumber;
      var className = "button pagination-link";
      if(curPage === pageNumber) {
        className += ' is-current';
        if(this.props.loading) {
          className += ' is-loading';
        }
      }
      
      className += ' '+classes;

      return (
          <li>
            <Link to={this.pageUrl(pageNumber)} class={className} aria-label={label}>
              {pageNumber}
            </Link>
          </li>
        );
    }

	  render() {

      var results;
      var numPages = this.props.numpages || 1;

      if(!this.props.results.length) {
        results = (
          <p>No results found for query: '{this.props.query.text}'</p>
        );

      } else {

        results = this.props.results.map(function(result) {
          var icons = [];
          if(result.value.hasInstance) {
            icons.push((
              <i class="fa fa-flask" aria-hidden="true"></i>
            ));
          }

          return (
            <div class="columns">
              <div class="column left is-12">
                <Link to={'/virtual/show/'+result.value.id}>
                  <span>
                    {result.value.name}
                  </span>
                  <span class="icons">
                    {icons}
                  </span>
                </Link>
              </div>
            </div>
          );
        });

      }

      const curPage = parseInt(this.props.page);
      const lastPage = numPages;

      var forwardBackLinks = [];
      if(curPage > 1) {
        forwardBackLinks.push((
            <Link to={this.pageUrl(Math.max(1, curPage-1))} class="pagination-previous">Previous</Link>));
      }
      if(curPage < lastPage) {
        forwardBackLinks.push((
            <Link to={this.pageUrl(Math.min(lastPage, curPage+1))} class="pagination-next">Next page</Link>));
      }

      var pageLinks = [];
      if(numPages <= 5) {
        if(numPages > 1) {
          var i;
          for(i=0; i < numPages; i++) {
            pageLinks.push(this.pageLink(i+1, curPage));
          }
        }
      } else {
        pageLinks.push(this.pageLink(1, curPage));
        if(curPage > 3) {
          pageLinks.push((
            <li><span class="pagination-ellipsis">&hellip;</span></li>
          ));
        }
        if(curPage > 2) {
          pageLinks.push(this.pageLink(curPage - 1, curPage));
        }
        if(curPage > 1) {
          pageLinks.push(this.pageLink(curPage, curPage));
        }

        if(curPage < lastPage - 1) {
          pageLinks.push(this.pageLink(curPage + 1, curPage));
        }

        if(curPage < lastPage - 2) {
          pageLinks.push((
            <li><span class="pagination-ellipsis">&hellip;</span></li>
          ));
        }

        if(curPage < lastPage) {
          pageLinks.push(this.pageLink(lastPage, curPage));
        }

      }
      
      return (
        <div>
          <div class="search-results">
            {results}
          </div>
          <nav class="pagination is-centered" role="navigation" aria-label="pagination">
            {forwardBackLinks}
            <ul class="pagination-list">
              {pageLinks}
            </ul>
          </nav>
        </div>
      )
    }
  }
}
