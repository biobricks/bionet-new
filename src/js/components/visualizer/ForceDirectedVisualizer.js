const Visualizer = require('./Visualizer')
var forceDirectedDiagramSpec = require('./graphs/forceDirectedDiagram.json')

module.exports = class ForceDirectedVisualizer {
    constructor(opts) {
        this.opts=opts
    }

    process(tree) {
        const treeIndex = {}
        const parentIdIndex = {}
        const elementIdIndex = {}
        const networkGraph = {
            nodes: [],
            links: []
        }
        for (var i = 0; i < tree.length; i++) {
            var element = tree[i]
            var elementData = element.value
            if (elementData.type !== 'physical') {
                treeIndex[elementData.id] = i
                parentIdIndex[elementData.parent_id] = i
                elementIdIndex[elementData.id] = elementData
            }
        }
        function getDepth(_id) {
            var depth = 0
            var currentLevelId = _id
            while (elementIdIndex[currentLevelId]) {
                var elementData = elementIdIndex[currentLevelId]
                currentLevelId = elementData.parent_id
                if (currentLevelId) depth++
            }
            if (depth > 7) depth = 7
            var elementData = elementIdIndex[_id]
            if (elementData) elementData.depth = depth
        }
        for (var i = 0; i < tree.length; i++) {
            var element = tree[i]
            getDepth(element.value.id)
        }
        for (var i = 0; i < tree.length; i++) {
            var element = tree[i]
            var elementData = element.value
            if (elementData.type !== 'physical') {
                var elementIndex = treeIndex[elementData.id]
                var parentIndex = treeIndex[elementData.parent_id]
                var node = {
                    "name": elementData.name,
                    "index": elementIndex,
                    "depth": elementData.depth
                }
                networkGraph.nodes.push(node)
                if (parentIndex !== undefined) {
                    var link = {
                        "source": parentIndex,
                        "target": elementIndex,
                        "value": 1
                    }
                    networkGraph.links.push(link)
                }
            }
        }
        return networkGraph
    }

    render(dataset,cb) {
        var graphData = this.process(dataset)
        var renderSpec = forceDirectedDiagramSpec
        renderSpec.data[0].values = graphData
        renderSpec.data[1].values = graphData
        renderSpec.width=2000
        renderSpec.height=2000
        var visualizer = new Visualizer()
        visualizer.render(renderSpec,this.opts,cb)
    }
}
