import { h } from 'preact';
import ashnazg from 'ashnazg';
import visualizer from './visualizer'

module.exports = function (Component) {

    return class Visualizer extends Component {

        constructor(props) {
            console.log("Visualizer compoent constructor")
            super(props);
            this.opts = {
                visualizer: props.diagram,
                outputFormat: "canvas",
                renderContainer: props.name,
                clickHandler: (props.onclick) ? props.onclick : this.onclick.bind(this)
            }
            this.visualizer = visualizer(this.opts)
            this.state = {};
            var self=this
            app.actions.inventory.getInventoryTree(function (err, children) {
                if (err) {
                    console.log("inventoryTree error:", err);
                    return
                }
                self.setState({ inventoryTree: children })
            })
        }

        onclick(id) {
            console.log('visualizer click', id)
            app.state.history.push('/inventory/'+id+"?vis=true")
        }

        render() {
            if (this.state.inventoryTree && this.props.inventoryPath) {
                var dataset = {
                    inventoryTree: this.state.inventoryTree,
                    locationPath: this.props.inventoryPath
                }
                this.visualizer.render(dataset, this.opts)
            }
            return (
                <div id={this.props.name} class="vis"></div>
            )
        }
    }
}