const vega = require('vega')
const fs = require('fs');

module.exports = class Visualizer {
    constructor() { }

    renderSvg(spec, opts, cb) {
        var view = new vega.View(vega.parse(spec))
            .renderer('none')
            .initialize();
        view.toSVG()
            .then(function (svg) {
                fs.writeFile(opts.outputFile, svg, 'utf8', function () {
                    cb(null)
                });
            })
            .catch(function (err) {
                cb(err)
            });
    }

    renderPng(spec, opts, cb) {
        var view = new vega.View(vega.parse(spec))
            .renderer('none')
            .initialize();
        view.toCanvas()
            .then(function (canvas) {
                // process node-canvas instance
                // for example, generate a PNG stream to write
                var stream = canvas.createPNGStream();
                // todo - writefile to stream
                fs.writeFile(opts.outputFile, stream, 'utf8', function () {
                    cb(null)
                });
            })
            .catch(function (err) {
                cb(err)
            });
    }

    renderCanvas(spec, opts, cb) {

        if (!spec) {
            cb(new Error('No render spec'))
            return
        }
        if (typeof document == "undefined") {
            this.renderSvg(spec, opts, cb)
            return
        }

        var self = this

        var width = 500
        var height = 500
        var rendererName = 'canvas'
        var renderContainer = '#' + opts.renderContainer
        var containerElement = document.getElementById(opts.renderContainer)

        if (containerElement) {
            width = containerElement.clientWidth
            width = (width===0) ? 300 : width
            height = containerElement.clientHeight
            height = (height===0) ? 300 : height
            if (opts.visualizer === 'bionet-container') height = width
            else if (opts.visualizer === 'tree') height = 300
        }
        spec.width = width
        spec.height = height
        var view = new vega.View(vega.parse(spec))
            .initialize(renderContainer)
            .renderer(rendererName)
            .resize()
            .run()
            .hover()
            .runAfter(function (view) {
                self.view = view
                if (opts.clickHandler) {
                    view.addEventListener('click', function (event, item) {
                        opts.clickHandler(item.datum.dbid)
                    })
                }
            })
    }

    render(spec, opts, cb) {
        var renderFormats = {
            "svg": this.renderSvg.bind(this),
            "png": this.renderPng.bind(this),
            "canvas": this.renderCanvas.bind(this)
        }
        var renderer = renderFormats[opts.outputFormat]
        if (renderer) {
            renderer(spec, opts, cb)
        } else {
            cb(new Error('unsupported renderer:' + opts.outputFormat))
        }
    }
}
