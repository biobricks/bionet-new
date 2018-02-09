
var through = require('through2');
var rpc = require('rpc-multistream'); // rpc and stream multiplexing
var validations = require('../common/validations.js');

module.exports = function(settings, users, accounts, db, index, mailer, p2p) { 
  return {

    getPeerInfo: function(curUser, cb) {
      cb(null, {
        id: settings.baseUrl,
        hostname: settings.hostname,
        port: settings.port,
        name: settings.lab,
        position: settings.physicalPosition
      });
    },

    getStatus: function(curUser, cb) {
      var peers = [];
      var o, peerId, peer;
      for(peerId in p2p.connector.peers) {
        peer = p2p.connector.peers[peerId];
        if(!peer.connected) continue;
        o = {};
        
        o.name = peer.name;
        o.url = peer.url;
        o.who_initiated_connection = peer.incoming ? 'they did' : 'we did';
        peers.push(o);
      }

      
      cb(null, {
        name: settings.lab || 'unnamed node',
        hostname: settings.hostname,
        port: settings.port,
        baseUrl: settings.baseUrl,
        peers: peers
      });
    },

    foo: function(curUser, user, cb) {
      cb(null, "foo says hi");
    },

    checkMasterPassword: function(curUser, password, cb) {

      if(password != settings.userSignupPassword) {
        return cb("Invalid master password");
      }
      cb();
    },
    
    createUser: function(curUser, username, email, password, opts, cb) {
      if(typeof opts === 'function') {
        cb = opts;
        opts = {};
      }

      vOpts = {
        humanReadable: true
      };

      if(curUser) {
        // TODO put this check in re-usable function
        // admins don't need a check for master password
        if(curUser.user.groups && curUser.user.groups.indexOf('admin') >= 0) {
          vOpts.ignore = ['masterPassword'];
        } else {
          if(settings.userSignupPassword) {
            if(opts.masterPassword != settings.userSignupPassword) {
              return cb("Invalid master signup password");
            }
          }
        }
      }

      var errors = validations.serverCheck({
        username: username,
        email: email,
        password: password,
        masterPassword: opts.masterPassword
      }, validations.signup, vOpts)
      if(errors) {
        return cb(new Error(errors));
      }
      
      var user = {
        username: username,
        email: email
      };

      accounts.create(users, user, password, mailer, function(err) {
        if(err) {
          return cb(err);
        }

        db.ensureUserData(users, user, accounts, cb)
     });
    }, 

    searchAvailable: rpc.syncReadStream(function(curUser, q, cb) {
      var s = db.physical.createReadStream({valueEncoding: 'json'});

      return s.pipe(through.obj(function(data, enc, next) {
//        if(!data.value.isPublic) return next();
//        if(!data.value.isAvailable) return next();

        if((data.value.name && data.value.name.toLowerCase().match(q.toLowerCase())) || (data.value.description && data.value.description.toLowerCase().match(q.toLowerCase()))) {
          // skip stuff beginning with underscore
          if(data.value.name && data.value.name[0] === '_') {
            return;
          }

          this.push(data.value);
        }
        
        next();
        
      }));
    }),

    verifyUser: function(curUser, code, cb) {
      accounts.verify(users, code, cb);
    }, 

    requestPasswordReset: function(curUser, emailOrName, cb) {
      accounts.requestPasswordReset(users, mailer, emailOrName, cb);
    }, 

    checkPasswordResetCode: function(curUser, resetCode, cb) {
      accounts.checkPasswordResetCode(users, resetCode, cb);
    },

    completePasswordReset: function(curUser, resetCode, password, cb) {
      accounts.completePasswordReset(users, resetCode, password, cb);
    },

    blast: rpc.syncReadStream(function(curUser, query) {
      if(!index.blast) throw new Error("BLAST queries not supported by this node");
      return index.blast.query(query);
    }),

    // TODO should have some kind of validation / security / rate limiting
    requestMaterialRemote: function(curUser, id, requesterEmail, physicalAddress, cb) {

      db.physical.get(id, function(err, m) {
        if(err) return cb(err);

        mailer.sendMaterialRequest(m, requesterEmail, physicalAddress, cb);
      });
    }

  }
}
