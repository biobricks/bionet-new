
import {h} from 'preact';
import {Link} from 'react-router-dom';

module.exports = function(Component) {

  return class SearchBar extends Component {

    render() {
    let controlClassNames = this.props.loading && this.props.loading === true ? 'control has-icons-left is-loading is-medium' : 'control has-icons-left';
    return ( 
      <form onSubmit={this.props.onSubmitQuery}>
        <div className="field has-addons">
          <div className={controlClassNames}>
            <input 
              id="search-form-input"
              type="text" 
              className="input is-info is-medium"
              placeholder={this.props.status}
              autoComplete="off"
              name="search"
              onChange={this.props.onChangeQuery}
              value={this.props.query}
            />
            <span className="icon is-medium is-left">
              <i className="mdi mdi-24px mdi-search-web" />
            </span>            
          </div>
          <div className="control">
            <a 
              className="button is-info is-medium"
              onClick={this.props.onSubmitQuery}
            >Search</a>
          </div> 
        </div>          
      </form>   
    );
    }

  }
}
