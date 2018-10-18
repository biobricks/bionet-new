const Visualizer = require('./Visualizer')
var treeDiagramSpec = require('./graphs/treeDiagram.json')

module.exports = class TreeVisualizer {
    constructor(opts) {
        this.opts=opts
    }

    process(dataset) {

        var tree=dataset.inventoryTree
        var pathData=dataset.locationPath

        const treeIndex = {}
        const parentIdIndex = {}
        const elementIdIndex = {}
        const graphTree = []
        const inPath = {}
        if (pathData) {
            for (var i = 0; i < pathData.length; i++) {
                var pathItem = pathData[i]
                inPath[pathItem.id] = pathItem
            }
        }
        for (var i = 0; i < tree.length; i++) {
            var element = tree[i]
            var elementData = element.value
            if (elementData.type !== 'physical') {
                elementData.level = 0
                elementData.size = 0
                elementData.layoutSize = 0
                treeIndex[elementData.id] = i
                parentIdIndex[elementData.parent_id] = i
                elementIdIndex[elementData.id] = elementData
            }
        }
        function getSizeFromLevel(_id) {
            var level = 0
            var currentLevelId = _id
            while (elementIdIndex[currentLevelId]) {
                var elementData = elementIdIndex[currentLevelId]
                elementData.size++
                currentLevelId = elementData.parent_id
                if (currentLevelId) level++
            }
            if (level > 5) level = 5
            var elementData = elementIdIndex[_id]
            if (elementData) elementData.level = 5 - level
        }
        for (var i = 0; i < tree.length; i++) {
            var element = tree[i]
            getSizeFromLevel(element.value.id)
        }
        for (var i = 0; i < tree.length; i++) {
            var element = tree[i]
            var elementData = element.value
            if (elementData.type !== 'physical') {
                var elementIndex = treeIndex[elementData.id]
                var parentIndex = treeIndex[elementData.parent_id]
                var size = (parentIdIndex[elementData.id]) ? null : elementData.level * 500
                var graphElement = {
                    "id": elementIndex,
                    "dbid": elementData.id,
                    "name": elementData.name,
                    "parent": parentIndex,
                    "size": size,
                    "fillColor": "#cdcdcd",
                    "fontWeight": "normal",
                    "fontSize": 9
                }
                if (inPath[elementData.id]) {
                    graphElement.fontSize = 12
                    graphElement.fontWeight = "bold"
                    graphElement.fillColor = "#FF0000"
                }
                graphTree.push(graphElement)
            }
        }
        return graphTree
    }

    render(dataset,cb) {
        var graphData = this.process(dataset)
        var renderSpec = treeDiagramSpec
        renderSpec.data[0].values = graphData
        var visualizer = new Visualizer()
        visualizer.render(renderSpec,this.opts,cb)
    }
}
