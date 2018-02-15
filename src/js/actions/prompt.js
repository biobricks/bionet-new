module.exports = {
    display: function(message, cb) {
        app.changeState({
            global: {
                prompt: {
                    message:message,
                    cb:cb
                }
            }
        });
    },
    initRender: function(component) {
        this.component = component
    },
    render: function(element) {
        return this.component
    },
    reset: function() {
        app.changeState({
            global: {
                prompt: null
            }
        });
        
    }
}