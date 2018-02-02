import ashnazg from 'ashnazg'

module.exports = {
  user: {
    isInGroup: function(user, group) {
      if(!group) {
        group = user;
        user = app.state.global.user;
      }

      if(!user || !user.userData) return false;
      if(!user.userData.groups || !user.userData.groups.length) return false;
      if(user.userData.groups.indexOf(group) >= 0) return true;

      return false;
    }

  },

  whenConnected: function(cb) {
    if(app.state.global.connection && app.state.global.connection.state === 'connected') {
      cb('connected');
    } else {
      ashnazg.listen('global.connection.state', function(state) {
        if(state === 'connected') {
          cb(state);
        }
      });
    }
  },

  whenLoggedIn: function(cb) {
    if(app.state.global.user) {
      cb(app.state.global.user);
    } else {
      ashnazg.listen('global.connection.user', function(user) {
        cb(user);
      });
    }
  }
}
