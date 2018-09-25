
var uuid = require('uuid').v4;
import {h} from 'preact';
import {NavLink, Link} from 'react-router-dom';

module.exports = function(Component) {

  return class SearchPagination extends Component {

    constructor(props) {
      super(props);
      this.state = {
        page: 0
      };
    };

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

    const numPages = this.props.numpages;

    const curPage = parseInt(this.props.page);

    // TODO assuming we don't know the last page but sometimes we do
    const lastPage = 0
    //const lastPage = numPages;

    var isLastPage = false;
    if(this.props.results.length < this.props.perPage) {
      isLastPage = true;
    }

      var forwardBackLinks = [];
      if(curPage > 1) {
        forwardBackLinks.push((
            <Link to={this.pageUrl(Math.max(1, curPage-1))} class="pagination-previous">Previous</Link>));
      }
    if(!lastPage && !isLastPage) {
        forwardBackLinks.push((
            <Link to={this.pageUrl(curPage+1)} class="pagination-next">Next page</Link>));
    } else if(curPage < lastPage) {
        forwardBackLinks.push((
            <Link to={this.pageUrl(Math.min(lastPage, curPage+1))} class="pagination-next">Next page</Link>));
      }

    var pageLinks = [];
      if(numPages <= 5) {
        if(numPages >= 1) {
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

    
    if(!lastPage && !isLastPage) {
          pageLinks.push((
            <li><span class="pagination-ellipsis">&hellip;</span></li>
          ));
    }

    return (
          <nav class="pagination is-centered" style="margin-top:10px" role="navigation" aria-label="pagination">
            {forwardBackLinks}
            <ul class="pagination-list">
              {pageLinks}
            </ul>
          </nav>
    );

/*
		return (
			<div className="panel has-background-white">
				<div className="panel-block">
					<nav className="pagination" aria-label="pagination">
					  <a className="pagination-previous" title="This is the first page" disabled>Previous</a>
					  <a className="pagination-next">Next page</a>
					  <ul className="pagination-list">
					    <li>
					      <a className="pagination-link is-current" aria-label="Page 1" aria-current="page">1</a>
					    </li>
					    <li>
					      <a className="pagination-link" aria-label="Goto page 2">2</a>
					    </li>
					    <li>
					      <a className="pagination-link" aria-label="Goto page 3">3</a>
					    </li>
					  </ul>
					</nav>
				</div>
			</div>
		);
*/
  }
}
}
