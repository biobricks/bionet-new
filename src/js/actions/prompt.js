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
    reset: function() {
        app.changeState({
            global: {
                prompt: null
            }
        });
        
    }
}