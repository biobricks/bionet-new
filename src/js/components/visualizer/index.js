const vega = require('vega')
const fs = require('fs');

module.exports = function (opts) {
    /*
        'tree-map': require('./TreeMapVisualizer'),
        'circle-diagram': require('./CircleDiagramVisualizer'),
    */
    var visTypes = {
        'tree': require('./TreeVisualizer'),
        'bionet-container': require('./BionetContainerVisualizer'),
        'force-directed': require('./ForceDirectedVisualizer')
    }
    if (visTypes[opts.visualizer]) {
        return new visTypes[opts.visualizer](opts)
    } else {
        return null
    }
}
