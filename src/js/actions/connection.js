

var self = module.exports = {

  setState: function(state, msg, retryDelay) {
    var connection;

    if(state) {
        app.changeState({
          global: {
            connection: {
              state: 'connected'
            }
          }
        });
    } else {
      if(state === undefined) {
        app.changeState({
          global: {
            connection: {
              state: 'initializing'
            }
          }
        });
      } else {
        app.changeState({
          global: {
            connection: {
              state: 'retrying',
            }
          },
          pnotify: {
            time: retryDelay
          }
        });
      }
    }
  }

  
};
