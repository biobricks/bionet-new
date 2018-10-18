const Visualizer = require('./Visualizer')
var bionetContainerSpec = require('./graphs/bionetBox.json')

module.exports = class BionetContainerVisualizer {

    constructor(opts) {
        this.opts=opts
    }

    process(_data) {
        function getIndex(x, y) {
            return x + ',' + y;
        }

        function spanMulti(child, childCells) {
            let index = getIndex(child.parent_x, child.parent_y)
            childCells[index] = child;
            return
        }

        function getChildInstances(item) {
            let children = (item) ? item.children : null;
            let childCells = {};
            if (children) {
                for (let i = 0; i < children.length; i++) {
                    let child = children[i];
                    let index = getIndex(child.parent_x, child.parent_y)
                    childCells[index] = child;
                }
            }
            return childCells
        }

        function generateCellArray(childCells, cols, rows, activeId) {
            const cellArray = [];
            var cellId = 1
            cellArray.push({
                id: cellId,
                name: 'box'
            })
            var parentId = cellId
            cellId++

            for (let col = 1; col <= cols; col++) {
                cellArray.push({
                    id: cellId++,
                    name: 'col ' + col,
                    parent: parentId
                })
            }

            var fontSize = (cols > 5) ? 12 : 24
            for (let col = 1; col <= cols; col++) {
                var colId = col + parentId
                for (let row = 1; row <= rows; row++) {
                    let index = getIndex(col, row)
                    var cellLeaf = {
                        id: cellId++,
                        parent: colId,
                        size: 100,
                        fontSize: fontSize,
                        strokeWidth: 1,
                        xspan: 1,
                        yspan: 1,
                        class: 'e',
                        color: 'white',
                        strokeColor: '#bbb'
                    }
                    var cellData = childCells[index]
                    if (cellData) {
                        cellLeaf.dbid = cellData.id
                        cellLeaf.name = cellData.name
                        cellLeaf.class = "o"
                        //cellLeaf.url = 'https://endylab.stanford.edu/inventory/' + cellData.id
                        if (cellData.id === activeId) {
                            cellLeaf.zindex = 2
                            //cellLeaf.color="#FF0000"
                            cellLeaf.color = cellData.color
                            cellLeaf.strokeWidth = 4
                            cellLeaf.strokeColor = "#404040"
                        } else {
                            cellLeaf.zindex = 1
                            cellLeaf.color = cellData.color
                        }
                        if (cellData.parent_x_span > 1 || cellData.parent_y_span > 1) {
                            cellLeaf.xspan = cellData.parent_x_span
                            cellLeaf.yspan = cellData.parent_y_span
                        }
                    }
                    cellArray.push(cellLeaf)
                }
            }
            return cellArray
        }
        var locationPath=_data.locationPath
        var cindex = locationPath.length-1
        var container = locationPath[cindex]
        if (container.type === 'physical') {
            cindex--
            container = locationPath[cindex]
        }
        var activeId = (cindex > 0) ? locationPath[cindex - 1].id : ""
        var childCells = getChildInstances(container)
        var xu = (container.layoutWidthUnits) ? container.layoutWidthUnits : container.xUnits
        var yu = (container.layoutHeightUnits) ? container.layoutHeightUnits : container.yUnits
        var graphData = generateCellArray(childCells, xu, yu, activeId)
        return graphData
    }

    render(dataset, cb) {
        var graphData = this.process(dataset)
        var renderSpec = bionetContainerSpec
        renderSpec.data[1].values = graphData
        var visualizer = new Visualizer()
        visualizer.render(renderSpec, this.opts, cb)
    }
}
