module.exports = {
    display: function(message, component, cb) {
 
        app.changeState({
            prompt : {
                message:message,
                callback:cb, // TODO saving function ref to state not allowed
                component:component, // TODO saving html to state not allowed
                active:true
            }
        })
    },
    setTitle: function(title) {
        console.log('prompt title:',title)
        app.changeState({
            prompt : {
                message:title
            }
        })
    },
    callback: function(e) {
        if (app.state.prompt.callback) app.state.prompt.callback(e)
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
