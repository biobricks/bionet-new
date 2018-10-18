import { h } from 'preact';
import ashnazg from 'ashnazg';
import { Link } from 'react-router-dom';
import { ForceGraph2D, ForceGraph3D, ForceGraphVR } from 'react-force-graph';

module.exports = function (Component) {

  return class NodeGraph extends Component {

    constructor(props) {
      super(props);
      this.state = {};
    }

    render() {
      
      let graphInput = {
        nodes: [
          {
            "id": "1",
            "name": "Lab",
            "val": 20
          },
          {
            "id": "2",
            "name": "Freezer 1",
            "val": 5
          },
          {
            "id": "3",
            "name": "Freezer 2",
            "val": 5
          }
        ],
        links: [
          {
            "source": "1",
            "target": "2"
          },
          {
            "source": "1",
            "target": "3"
          }
        ]
      };
      
      return (
        <div className="NodeGraph">
          <div id="2D Graph">
            <ForceGraph2D 
              graphData={graphInput} 
              style={{'height': '600px'}}
              linkDirectionalArrowLength={3.5}
              linkDirectionalArrowRelPos={1}
              linkCurvature={0.25}
            />
          </div>
          <div id="3D Graph">
            <ForceGraph3D 
              graphData={genRandomTree()} 
              style={{'height': '600px'}}
            />
          </div>
        </div>
      );
    }

  }
}

function genRandomTree(nodeCount=3000) {
  return {
    nodes: [...Array(nodeCount).keys()].map(i => ({ id: i })),
      links: [...Array(nodeCount).keys()]
    .filter(id => id)
    .map(id => ({
      source: id,
      target: Math.round(Math.random() * (id-1))
    }))
  };  
}