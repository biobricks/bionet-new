import { h } from 'preact';
import ashnazg from 'ashnazg';
import { Redirect } from 'react-router-dom';

module.exports = function(Component) {

  return class Favorites extends Component {

    render() {
        const favorites = this.props.favorites
        if (!favorites) return null
        console.log('render favorites:',favorites)
        const self=this
        const selectFavorite = function(e) {
            e.preventDefault();
            if (self.props.selectRecord) self.props.selectRecord(e)
        }

        const favs = this.props.favorites.map( favorite => {
            if (!favorite.material || !favorite.favorite) return null
            return (
                <a class="panel-block" id={favorite.material.id} onclick={selectFavorite}>
                  <span class="panel-icon">
                    <i class="mdi mdi-flask"></i>
                  </span>
                  {favorite.material.name}
                </a>
            )
        })
        
      return (
        <div class="Favorites">
          <div class="columns is-desktop">
            <div class="column is-12-desktop">
              <div class="panel has-background-white">
                {favs}
              </div>
            </div>
          </div>  
        </div>
      );
    }
  }
}
