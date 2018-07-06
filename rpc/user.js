var Readable = require('stream').Readable;

var uuid = require('uuid').v4;
var async = require('async');
var through = require('through2');
var rpc = require('rpc-multistream'); // rpc and stream multiplexing
var validations = require('../common/validations.js');

function del(curUser, db, dbName, key, cb) {
  if(!dbName || dbName === 'user' || dbName === 'index') return cb(new Error("not allowed"));
  if(!db[dbName]) return cb(new Error("database '"+dbname+"' does not exit"));
  if(!key) return cb(new Error("Missing key"));
  
  var tkey = db.translateKey(key, db[dbName]);
    
  db.db.get(tkey, function(err, o) {
    if(err) return cb(err);
    var now = (new Date).getTime();
    var dKey = (Number.MAX_SAFE_INTEGER - now).toString() + uuid();
    db.deleted.put(dKey, {
      db: dbName,
      key: tkey,
      deletedAt: now,
      deletedBy: curUser.user.username,
      data: JSON.parse(o)
    }, function(err) {

      if(err) return cb(err);
      
      db[dbName].del(key, cb);
      
    });
  });
}

module.exports = function(settings, users, accounts, db, index, mailer, p2p, pandadoc) { 

  return {
    secret: function(curUser, cb) {
      cb(null, "Sneeple are real!");
    },

    // TODO remove this when implementing private data
    testStream: rpc.syncReadStream(function() {

      return db.physical.createReadStream();
    }),

    // get user's workbench physical
    getWorkbench: function(curUser, cb) {
      if(!curUser.user.workbenchID) return cb(new Error("User workbench missing"));

      db.physical.get(curUser.user.workbenchID, cb);
    },

    workbenchTree: function(curUser, cb) {
      if(!curUser.user.workbenchID) return cb(new Error("User workbench missing"));

      index.inventoryTree.childrenFromKey(curUser.user.workbenchID, cb);
    },

    // get user's workbench physical
    getFavLocations: function(curUser, cb) {
      if(!curUser.user.favLocationsID) return cb(new Error("User favorite locations missing"));

      db.physical.get(curUser.user.favLocationsID, cb);
    },

    favLocationsTree: function(curUser, cb) {
      if(!curUser.user.favLocationsID) return cb(new Error("User favorite locations missing"));

      index.inventoryTree.childrenFromKey(curUser.user.favLocationsID, function(err, children) {
        if(err) return cb(err);

        var out = [];

        async.eachSeries(children, function(child, cb) {
          if(!child.value.material_id) return cb();

          db.physical.get(child.value.material_id, function(err, m) {
            if(err) { // if the physical no longer exists, remove the favorite
              return db.physical.del(child.value.material_id, function(err) {
                cb();
              })
            }
            out.push({
              favorite: child.value,
              material: m
            });
            cb();
          });
        }, function(err) {
          if(err) return cb(err);
          cb(null, out);
        })
      });
    },

    saveFavLocation: function(curUser, m, imageData, doPrint, cb) {
      if(!curUser.user.favLocationsID) return cb(new Error("User favorite locations missing"));
      
      m.parent_id = curUser.user.favLocationsID;
      
      db.saveMaterial({
        type: '_ref',
        name: '_ref_' + uuid(),
        parent_id: curUser.user.favLocationsID,
        material_id: m.id
      }, curUser, 'p', cb);
    },

    
    getChildren: function(curUser, id, cb) {
      index.inventoryTree.childrenFromKey(id, cb);
    },
    
    saveInWorkbench: function(curUser, m, imageData, doPrint, cb) {
      if(!curUser.user.workbenchID) return cb(new Error("User workbench missing"));
      
      if (Array.isArray(m)) {
        for (var i = 0; i < m.length; i++) {
          m[i].parent_id = curUser.user.workbenchID;
          db.savePhysical(curUser, m[i], imageData, doPrint, cb);
        }
      } else {
        m.parent_id = curUser.user.workbenchID;
        db.savePhysical(curUser, m, imageData, doPrint, cb);
      }
    },

    getID: function(curUser, cb) {
      db.idGenerator.next(cb);
    },

    listDeleted: rpc.syncReadStream(function(curUser) {
      return db.deleted.createReadStream();
    }),

    // really delete all the deleted stuff
    clearDeleted: function(curUser, cb) {
      var s = db.deleted.createKeyStream();

      var d = through.obj(function(key, enc, next) {
        db.deleted.del(key, next);
      })
      s.pipe(d);

      d.on('end', cb);
      d.on('error', cb);
    },
    
    undelete: function(curUser, key, cb) {

      db.deleted.get(key, function(err, o) {
        if(err) return cb(err);
        if(!o.key) return cb(new Error("Unable to undelete: Original key missing."))
        // TODO check if a physical already exists with this name
//        console.log("UNDELETING:", o);
        db.db.put(o.key, JSON.stringify(o.data), function(err) {
          if(err) return cb(err);
          
          db.deleted.del(key, cb);
        });
      });
    },

    delPhysical: function(curUser, id, cb) {
      console.log('delPhysical:',id);
      del(curUser, db, 'physical', id, cb);
    },

    delVirtual: function(curUser, id, cb) {
      db.instancesOfVirtual(id, function(err, physicals) {
        if(err) return cb(err);

        if(physicals && physicals.length) {
          return cb(new Error("You must delete all physical instances before deleting a virtual"));
        }

        // TODO undelete
        db.virtual.del(id, cb);
      });
    },

    physicalAutocomplete: function(curUser, query, cb) {

      query = query.trim().toLowerCase();
      var a = [];

      // TODO this is a super inefficient way of autocompleting
      var s = db.physical.createReadStream();
      
      s.on('data', function(data) {
        if(!data.value.name.toLowerCase().match(query)) return;
        if(data.value.hidden) return; // skip hidden physicals

        a.push(data.value);
      });

      s.on('error', function(err) {
        return cb(err);
      });

      s.on('end', function() {
        return cb(null, a);
      });

    },

    // add a physical to user's cart
    addToCart: function(curUser, physical_id, name, cb) {
      
      var o = {
        user: curUser.user.username,
        physical_id: physical_id,
        created: db.unixEpochTime()
      }
      
      var ucDB = db.userCart(o.user);
      
      // TODO if we ever switch from enforicing unique physical names
      //      then this needs to change
      ucDB.put(name, o, cb);
    },
    
    // stream a user's cart
    cartStream: rpc.syncReadStream(function(curUser, cb) {
      
      const cartStream = Readable({ objectMode: true });
      cartStream._read = function() {}

      var ucDB = db.userCart(curUser.user.username);
      var s = ucDB.createReadStream();

      // TODO 
      // It would be much more efficient if we simply cached the
      // path info and the whole physical object in the cart db
      // but then it might become out of sync with the real location.
      // Probably better to play it safe for now and optimize later.

      var out = s.pipe(through.obj(function(data, enc, next) {
        if(!data || !data.value || !data.value.physical_id) return next();
        
        db.physical.get(data.value.physical_id, function(err, o) {
          if(err) {
            if(err.notFound) return next();
            return cb(err);
          }
            cartStream.push({
              physical: o,
              path: {}
            })
            next();
        });
      }));

      s.on('close', function() {
        cb();
      });

      out.on('error', function(err) {
        cb(err);
        console.error("cart stream error:", err);
      });
      
      return cartStream;
    }),

    delFromCart: function(curUser, physical_id, cb) {
      var ucDB = db.userCart(curUser.user.username);

      db.physical.get(physical_id, function(err, o) {
        if(err) return cb(err);

        ucDB.del(o.name, cb)
      });
    },

    emptyCart: function(curUser, cb) {
      var ucDB = db.userCart(curUser.user.username);
      var s = ucDB.createKeyStream();

      var out = s.pipe(through.obj(function(key, enc, next) {
        
        ucDB.del(key, function(err) {
          if(err) return cb(err);
          next();
        })

      }));
      
      s.on('close', function() {
        cb();
      });
      
      out.on('error', function(err) {
        cb(err);
      });
    },

    clearRequests: rpc.syncReadStream(function(curUser) {
      var s = db.request.createReadStream();
      s.on('data', function(o) {
        db.request.del(o.key, function() {});
      });
    }),

    getRequests: rpc.syncReadStream(function(curUser) {
      return db.request.createReadStream();
    }),
    
    getType: function(curUser, name, cb) {
      name = name.toLowerCase().trim().replace(/\s+/g, ' ')
      process.nextTick(function() {
        var i;
        for(i=0; i < settings.dataTypes.length; i++) {
          if(settings.dataTypes[i].name === name) {
            cb(null, settings.dataTypes[i]);
            return;
          }
        }
        var err = new Error("No type with the specified name exists");
        err.notFound = true;
        cb(err);
      })
    },

    createAutocomplete: function(curUser, type, q, cb) {
      var results = {
        types: [],
        virtuals: []
      };
      if(!q) return cb(null, results);
      q = q.toLowerCase().trim()

      if(!q.length) return cb(null, results);

      q = q.replace(/\s+/g, '.*')
      q = new RegExp(q);

      // type not already specified so return type hits
      if(!type) {
        var i;
        for(i=0; i < settings.dataTypes.length; i++) {
          if(settings.dataTypes[i].name.match(q)) {
            results.types.push(settings.dataTypes[i]);
          }
        }
      } else {
        type = type.name.toLowerCase().trim()
      }
      
      var s = db.virtual.createReadStream({valueEncoding: 'json'});
      
      var out = s.pipe(through.obj(function(data, enc, cb) {

        if((data.value.name && data.value.name.toLowerCase().match(q))) {
          if(!type || (type && data.value.type === type)) {
            if(results.virtuals.length <= 10) {
              results.virtuals.push(data.value) 
              if(results.virtuals.length >= 10) {
                s.destroy();
                return;
              }
            }
          }
        }
        cb()
      }));

      s.on('close', function() {
        cb(null, results);
      });

      out.on('end', function() {
      });
      
      out.on('error', function(err) {
        cb(err); // TODO handle better
        console.error("search stream error:", err);
      });
    },

    saveVirtual: function(curUser, m, cb) {
      console.log('saveVirtual, m=',JSON.stringify(m))
      db.saveMaterial(m, curUser, 'v', function(err, id) {
        if(err) return cb(err);
        
        return cb(null, id);
      });
    },

    savePhysical: function(curUser, m, imageData, doPrint, cb) {
      db.savePhysical(curUser, m, imageData, doPrint, cb);
    },

    elasticSearch: function(curUser, query, cb) {

      index.elastic.search('name', {
        query: {
          "match_phrase_prefix": {
            "name": {
              "query": query
            }
          }
        }}, function(err, result) {

          if(err) return cb(err);

          cb(null, result.hits.hits);
        });
      
    },

    // get the entire physical inventory tree
    // TODO implement a server side filter for the physicals tree
    inventoryTree: function(curUser, cb) {
      index.inventoryTree.children(null, {
        ignore: function(obj) {
          // ignore paths with parts beginning with _
          var pathParts = obj.path.split('.');
          var i;
          for(i=0; i < pathParts.length; i++) {
            if(pathParts[i].match(/^_/)) {
              return true;
            }
          }
          return false;
        }
      }, cb);
    },
      
    getParentPath: function(curUser, id, cb) {
        index.inventoryTree.path(id, {pathArray:true}, function(err, path) {
            if (path && path.length > 0) {
                index.inventoryTree.getFromPath(path[0], function(err,key,value) {
                    if (cb) cb(err, key, value)
                })
            } else {
                cb('Error, path not found')
            }
        })
        //return index.inventoryTree.parentPathFromPath(path)
    },

    getLocationPath: function (curUser, id, cb) {
      
      if (id[0] !== 'p') {
        cb(new Error("getLocationPath only works for physicals"));
      }
      
      var curdb = db.physical;
      var results = [];

      // TODO this should be done with the level-tree-index API
      var getParentLocation = function (id) {
        curdb.get(id, {
          valueEncoding: 'json'
        }, function (err, p1) {
          if (err) {
            return cb(err, null);
          }
          results.push(p1);
          if (p1.parent_id) {
            getParentLocation(p1.parent_id);
          } else {
            return cb(null, results);
          }
        });
      }
      getParentLocation(id);
    },
      
    getPath: function(curUser, id, cb) {
        index.inventoryTree.path(id, null, function(err, path) {
            if (cb) cb(err,path)
        })
    },
      
    getImmediateChildren: function(curUser, path, key, cb) {
        //console.log('getImmediateChildren, path:%s, key:%s, cb:',path, key, cb)
        const children=[]
        const s = index.inventoryTree.stream(path, {depth:1})
        s.on('data', function(child) {
            children.push(child.value)
        })
        s.on('error', function(err) {
            if (cb) cb(err)
        })
        s.on('end', function() {
            if (cb) cb(null, key, children)
        });
    },
      
    getLocationPathChildren: function (curUser, id, cb, cb2) {
        if (id[0] !== 'p') {
            cb(new Error("getLocationPathChildren only works for physicals"));
        }
        const thisModule = this
        /*
        const getChildren=function(parentItem, cb) {
            const children=[]
            const s = index.inventoryTree.stream(parentItem.path, {depth:1})
            s.on('data', function(child) {
                children.push(child.value)
            })
            s.on('error', function(err) {
                if (cb) cb(err)
            })
            s.on('end', function() {
                if (cb) cb(null, parentItem.key, children)
            });
        }
        */
        
        index.inventoryTree.path(id, function(err,parentPath) {
            if (err) {
                if (cb) cb(err)
                return
            }
            if (!parentPath) {
                if (cb) cb(new Error('Null parent path returned for '+id))
                return
            }
            const pathItems = []
            const s = index.inventoryTree.parentStream(parentPath)
            s.on('data', function(item) {
                pathItems.push(item)
            })
            s.on('error', function(err) {
                if (cb) cb(err)
            })
            s.on('end', function() {
                if (cb2) cb2('getLocationPathChildren, path %s, pathItems:',parentPath, pathItems)
                var pc = 0
                const pathArray = []
                for (var i=0; i<pathItems.length; i++) {
                    pathArray.push(pathItems[i].value)
                    thisModule.getImmediateChildren(pathItems[i].path, pathItems[i].key, function(err,id,children) {
                        if (cb2) cb2('getLocationPathChildren getChildren:',id,children,(children)?children.length:0)
                        if (err) {
                            console.log('getLocationPathChildren, getChildren err:',err)
                            s.destroy()
                            cb(err)
                            return
                        }
                        if (children && children.length>0) {
                            for (var i=0; i<pathArray.length; i++) {
                                if (pathArray[i].id===id) {
                                    pathArray[i].children = children
                                    break
                                }
                            }
                        }
                        if (++pc >= pathItems.length) {
                            cb(null,pathArray)
                        }
                    })
                }
            });
        })
      },
    
    // TODO use indexes for this
    getVirtualBy: function(curUser, field, value, cb) {

      var s = db.virtual.createReadStream({valueEncoding: 'json'});
      var found = false;
      var out = s.pipe(through.obj(function(data, enc, next) {
        if(!data || !data.value || !data.value[field]) return next()
        // TODO let people use foo.bar.baz paths as field
        if(data.value[field] == value) {
          found = true;
          cb(null, data.value);
          s.destroy();
        } else {
          next();
        }
      }));
      
      s.on('end', function() {
        if(!found) {
          found = true;
          cb(null, null);
        }
      });

      s.on('error', function(err) {
        if(!found) {
          found = true;
          cb(err);
        }
      });
    },

    // TODO use indexes for this!
    getBy: function(curUser, field, value, cb) {
      return db.getBy(field, value, cb);
    },

    // TODO doesn't work
    recentChanges: rpc.syncReadStream(function() {
      var s = recentDB.createReadStream({valueEncoding: 'utf8'});

      var count = 0;
      var out = s.pipe(through(function(data, enc, cb) {

        db.bio.get(data.value, function(err, p) {
          if(!err && p) {
            this.push(JSON.stringify(p));
            count++;
          }
          if(count < 50) {
            cb();
          }
        }.bind(this));
      }));
      
      out.on('error', function(err) {
        // TODO handle
        console.error("recent changes stream error:", err);
      });
      return out;
    }),

    search: function(curUser, q, cb) {

      var s = db.bio.createReadStream({valueEncoding: 'json'});

      var ret = [];

      var out = s.pipe(through.obj(function(data, enc, next) {
        if((data.value.name && data.value.name.toLowerCase().match(q.toLowerCase())) || (data.value.description && data.value.description.toLowerCase().match(q.toLowerCase()))) {
          // skip stuff beginning with underscore
          if(data.value.name && data.value.name[0] === '_') {
            return;
          }
          // this.push(data.value);
          ret.push(data.value);
        }
        
        next();
      }));
      
      s.on('error', function(err) {
        cb(err);
      });
      s.on('end', function() {
        console.log("SENDING:", ret);
        cb(null, ret);
      });
    },

    getUsers: rpc.syncReadStream(function() {
      return users.list();
    }),

    // TODO this should only be available to admin users
    getUser: function(curUser, id, cb) {
      users.get(id, cb);
    },

    delUser: function(curUser, id, cb) {
      users.get(id, function(err, user) {
        if(err) return cb(err);

        users.remove(id, cb);
      });
    },

    // TODO this should only be available to admin users
    saveUser: function(curUser, id, userData, cb) {

      if(userData.password) {
        if(userData.password !== userData.password_confirm) {
          return cb(new Error("Passwords do not match"));
        }
      }

      users.get(id, function(err, user) {
        if(err) return cb(err);

        if(userData.email) user.email = userData.email;
        if(!userData.password) {
          users.put(id, user, cb);
          return;
        }
        users.removeLogin(id, 'basic', function(err) {
          // TODO this error will leave the user unable to log in
          // This is bad. This operation really should be atomic
          if(err) return cb(err); 

          users.addLogin(id, 'basic', {
            username: id, password: 
            userData.password}, function(err) {
              if(err) return cb(err);
              
              users.put(id, user, cb);
            })
        });    

      });

    },

    // get a list of connected peers
    getPeers: function(curUser, cb) {
      if(!p2p) return cb(new Error("p2p not supported by this node"));

      process.nextTick(function() {
        cb(null, p2p.connector.peers);
      });
    },


    // TODO switch to using a stream as output rather than a callback
    peerSearchOld: function(curUser, query, cb) {
      if(!p2p) return cb(new Error("p2p not supported by this node"));

      function onError(err) {
        // do we really care about remote errors? probably not
      }

      // for each connected peer
      p2p.connector.peerDo(function(peer, next) {

        // run a streaming blast query
        var s = peer.remote.searchAvailable(query);

        s.on('error', onError);

        s.on('data', function(data) {
          cb(null, {
            id: peer.id,
            name: peer.name,
            position: peer.position,
            distance: peer.distance
          }, data);
        });

        // TODO time out the search after a while

        next();

      }, function(err) {
        if(err) return cb(err);
      });
    },

    // TODO switch to using a stream as output rather than a callback
    peerBlast: function(curUser, query, cb) {
      var streams = [];

      function onError(err) {
        // do we really care about remote errors? probably not
      }

      function onResult(peerInfo, result) {
        cb(peerInfo, result);
      }

      if(index.blast) {
        streams.push({
          stream: index.blast.query(query)
        });
      }

      // for each connected peer
      peerConnector.peerDo(function(peer, next) {

        // run a streaming blast query
        var s = peer.remote.blast(query)

        s.on('error', onError);

        s.on('data', function(data) {
          cb(null, peer.info, data);
        });
        streams.push(s);

        next();

      }, function(err) {
        if(err) return cb(err);
      });
    },


    changeRequestTrashed: function(curUser, id, trashed, cb) {
      db.request.get(id, function(err, data) {
        if(err) return cb(err);
        
        data.trashed = trashed;

        db.request.put(id, data, cb);
      });
    },

    changeRequestStatus: function(curUser, id, status, cb) {
      db.request.get(id, function(err, data) {
        if(err) return cb(err);
        
        data.status = status;

        db.request.put(id, data, cb);
      });
    },

    // TODO not currently used
    requestMaterial: function(curUser, peerID, id, cb) {
      if(!p2p) return cb(new Error("Node does not support p2p"));
      var peer = p2p.connector.peers[peerID];
      if(!peer || !peer.remote) return cb(new Error("No such peer: "+peerID));

      peer.remote.requestMaterialRemote(id, curUser.user.email, settings.physicalAddress, cb);
    },

    freegenesCreatePlate: function(curUser, parent_id, name, cb) {
      var m = {
        name: name,
        parent_id: parent_id
      };
      db.savePhysical(m, null, null, cb);
    },

    freegenesCreatePart: function(curUser, virtual_id, parent_id, name, cb) {
      var m = {
        name: name,
        parent_id: parent_id,
        virtual_id: virtual_id
      };
      db.savePhysical(m, null, null, cb);
    },

    getPandadocStatus: function(curUser, cb) {
      if(!settings.pandadoc) {
        process.nextTick(function() {
          cb(null, "disabled");
        });
        return;
      }
      if(!pandadoc.authenticated) {
        process.nextTick(function() {
          cb(null, "enabled");
        });
        return;
      }
      process.nextTick(function() {
        cb(null, "authenticated");
      });
    },

    // This is a function used by other programs 
    // to test that authenticated RPC calls are working.
    foo_user: function(curUser, cb) {
      cb(null, "bar_user");
    }

  };
}
