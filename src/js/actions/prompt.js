module.exports = {
    display: function(message, component, cb) {
        app.changeState({
            prompt : {
                message:message,
                callback:cb,
                component:component,
                active:true
            }
        })
    },
    initRender: function(component) {
        app.state.prompt.component = component
    },
    initCallback: function(cb) {
        app.state.prompt.callback = cb
    },
    callback: function(e) {
        if (app.state.prompt.callback) app.state.prompt.callback(e)
    },
    render: function(element) {
        return app.state.prompt.component
    },
    reset: function() {
        app.changeState({
            prompt : {
                message:null,
                callback:null,
                component:null,
                active:false
            }
        })
    }
}