
import auth from 'rpc-multiauth';
import {createHash} from 'crypto';
import emailValidator from "email-validator";

function hashPassword(email, password) {
  var h = createHash('sha1');
  return h.update(email+password).digest('hex');
}

// TODO Salt and hash password + encrypt with nonce.
//      SSL takes if someone misconfigures without SSL
//      then it should still be secure assuming
//      the cache is bricked (currently we don't brick the cache)
// TODO hash master password also

var self = module.exports = {

  set: function(user, token) {
    if(user) {
      app.changeState({
        global: {
          user: {
            userData: user,
            token: token
          }
        }
      });
    } else {
      app.changeState({
        global: {
          user: null
        }
      });
    }
  },

  create: function(username, email, password, opts, cb) {
    opts = opts || {};

    username = username.trim();
    password = password.trim();
    if(opts.masterPassword) {
      opts.masterPassword = opts.masterPassword.trim();
    }
    
    app.remote.createUser(username, email, password, {masterPassword: opts.masterPassword}, cb);

  },
  
  login: function(userOrEmail, password, cb) {

    if(emailValidator.validate(userOrEmail)) {
      // TODO if email, look up user by email
      throw new Error("TODO login by email not implemented");
    }

    auth.login(app.remote, {
      username: userOrEmail,
      password: password
    }, function(err, token, user) {
      if(err) return cb(err);

      app.actions.user.set(user.user, token);
      
      cb();
    });
  },

  list: function() {
    return app.remote.getUsers();
  },

  get: function(username, cb) {
    app.remote.getUser(username, cb)
  },

  save: function(username, userdata, cb) {
    app.remote.saveUser(username, userdata, cb)
  },

  del: function(username, cb) {
    app.remote.delUser(username, cb)
  },

  logout: function(cb) {
    app.rpc.logout(cb);
  },

  passwordReset: function(usernameOrEmail, cb) {
    app.remote.requestPasswordReset(usernameOrEmail, cb);    
  }
};
