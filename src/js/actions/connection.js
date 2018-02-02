

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
  },

  // maybe move to util?
  isConnected: function() {
    if(app.state 
       && app.state.global 
       && app.state.global.connection 
       && app.state.global.connection.state === 'connected') {
      return true;
    } else {
      return false;
    }
  }
};
