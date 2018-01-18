
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
    
    pageUrl(pageNumber) {
      return '/search/'+encodeURI(this.props.query)+'/'+pageNumber;
    }

    pageLink(pageNumber, curPage) {
        
      const label = "Goto page " + pageNumber;
      var className = "pagination-link";
      if(curPage === pageNumber) className += ' is-current';

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
      var numPages = this.props.numpages || 0;

      if(!this.props.results.length) {
        results = (
          <p>no results</p>
        );

      } else {

        results = this.props.results.map(function(result) {
          return (
            <div class="columns">
              <div class="column left is-10">{result.name}</div>
              <div class="column"></div>
              <div class="column"></div>
            </div>
          );
        });

      }

      const curPage = parseInt(this.props.page);
      const lastPage = numPages;

      var forwardBackLinks = [
        (<Link to={this.pageUrl(Math.max(1, curPage-1))} class="pagination-previous">Previous</Link>),
        (<Link to={this.pageUrl(Math.min(lastPage, curPage+1))} class="pagination-next">Next page</Link>)
      ];


      var pageLinks = [];
      if(numPages <= 1) {
        forwardBackLinks = '';
      } else if(numPages <= 5) {
        var i;
        for(i=0; i < numPages; i++) {
          pageLinks.push(this.pageLink(i+1, curPage));
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
