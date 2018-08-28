
module.exports = function(db, users, accounts) {

  return function(loginData, cb) {

    creds = {
      username: loginData.username,
      password: loginData.password
    };

    
    users.verify('basic', creds, function(err, ok, id) {
      if(err) return cb(err)
      if(!ok) return cb(new Error("Invalid username or password"));
      
      users.get(id, function(err, user) {
        if(err) return cb(err);

        db.ensureUserData(users, user, accounts, function(err, user) {
          if(err) return cb(err);            
          
          // TODO don't hard-code group
          cb(null, id, {user: user, group: 'user'});
        });
      });
    });

  }
}


