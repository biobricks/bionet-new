

var self = module.exports = {

  set: function(user) {
    app.changeState({
      user: user || undefined
    });
  }
};
