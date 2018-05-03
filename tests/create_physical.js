var uuid = require('uuid').v4;
var connect = require('./common/connect.js');
var test = require('tape')

/*
  Test basic delete and undelete of a single physical.
*/

test('create physical', function (t) {
  
  t.plan(1)

  connect(function(err, done, remote, userData, token) {
    if(err) throw err;


    remote.saveVirtual({
      name: "TestVirtual"
    }, function(err, virtual_id) {
      if(err) throw err;

      console.log("Virtual created:", virtual_id);

      remote.savePhysical({
        virtual_id: virtual_id
      }, null, null, function(err, id, m) {
        if(err) throw err;

        remote.savePhysical({
          virtual_id: virtual_id
        }, null, null, function(err, id, m) {
          if(err) throw err;

          console.log("Saved:", id, m);
         
          done();
        });        
      });
    });

  });
});
