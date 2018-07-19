import { h } from 'preact';
import ashnazg from 'ashnazg';
import { Redirect } from 'react-router-dom';

module.exports = function(Component) {

  return class Favorites extends Component {

    render() {
      return (
        <div class="Favorites">
          <div class="columns is-desktop">
            <div class="column is-7-desktop">
              <div class="panel has-background-white">
                <div class="panel-heading">
                <i class="mdi mdi-star"></i> My Favorites
                </div>
                <a class="panel-block">
                  <span class="panel-icon">
                    <i class="mdi mdi-flask"></i>
                  </span>
                  Favorite Item 1 
                </a>
                <a class="panel-block">
                  <span class="panel-icon">
                    <i class="mdi mdi-flask"></i>
                  </span>
                  Favorite Item 2 
                </a>
                <a class="panel-block">
                  <span class="panel-icon">
                    <i class="mdi mdi-flask"></i>
                  </span>
                  Favorite Item 3 
                </a>
                <a class="panel-block">
                  <span class="panel-icon">
                    <i class="mdi mdi-flask"></i>
                  </span>
                  Favorite Item 4 
                </a>
                <a class="panel-block">
                  <span class="panel-icon">
                    <i class="mdi mdi-flask"></i>
                  </span>
                  Favorite Item 5 
                </a>
              </div>
            </div>
            <div class="column is-5-desktop">
              <div class="panel-heading">
                <i class="mdi mdi-flask"></i> Item Name
              </div>
              <div class="panel-block">
                Map Panel
              </div>
            </div>
          </div>  
        </div>
      );
    }
  }

}