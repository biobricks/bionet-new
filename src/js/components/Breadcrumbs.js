import { h } from 'preact';
import { Link } from 'react-router-dom';

module.exports = function(Component) {

  return class Breadcrumbs extends Component {

    render() {
      const links = this.props.inventoryPath.map((item, index) => {
        const isActiveItem = index === this.props.inventoryPath.length -1;
        return (
          <li>
            {(!isActiveItem) ? (
              <Link 
                to={`/inventory/${item.id}`}
              >
                {item.name}
              </Link>
            ) : (
              <span>{item.name}</span>
            )}

          </li>
        );
      });
      return (
        <div class="Breadcrumbs panel-block">
          <nav class="breadcrumb is-capitalized" aria-label="breadcrumbs">
            <ul>
              { links }
            </ul>
          </nav>          
        </div>
      )
    }
  }
}  