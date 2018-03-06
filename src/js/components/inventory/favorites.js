import {
    h
}
from 'preact'

module.exports = function (Component) {

    return class Favorites extends Component {
        
        constructor(props) {
            super(props);
        }
        
        render() {
            if (!this.props.favorites) return null
            const favorites = this.props.favorites
            //console.log('render favorites:',this.props)
            const thisModule = this
            const selectFavorite = function(e) {
                e.preventDefault();
                console.log('selectFavorite click:',thisModule.props)
                if (thisModule.props.selectFunction) {
                    const id=e.currentTarget.id
                    thisModule.props.selectFunction(id)
                }
            }
            
            const Favorite=function(props) {
                if (!props || !props.favorite) return null
                const fav = props.favorite
                if (!fav.material || !fav.favorite) return null
                        //<span class="panel-icon">
                        //<i class="fas fa-book"></i>
                        //</span>
                return (
                    <a id={fav.material.id} class="panel-block is-active" onclick={selectFavorite}>{fav.material.name}</a>
                )
            }
            
            const favs=[]
            for (var i=0; i<favorites.length; i++) {
                var favorite = favorites[i].favorite
                var material = favorites[i].material
                favs.push(<Favorite favorite={favorites[i]} />)
            }
            var itemName='itemx'
            if (this.props.selectedItem) {
                const id=this.props.selectedItem.id
                if (id) {
                    const item = app.actions.inventory.getItemFromInventoryPath(id)
                    if (item && item.name) itemName = item.name
                }
            }
            return (
                <nav class="panel">
                    <p class="panel-heading">Favorites</p>
                    <a class="panel-block is-active" onclick={this.props.addFunction}>{"Add "+itemName+" to favorites"}</a>
                    {favs}
                </nav>
            )
        }
    }
}