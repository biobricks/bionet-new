/*

  This library is used to create a JSON-RPC 2.0 API
  from an existing rpc-multistream API.

  Readable streams are converted arrays or objects or strings.
  Writeable streams are not supported.

  The returned value is an array of what would have been the callback arguments.

  TODO support converting readable streams that output Buffers
*/

var async = require('async');
var stream = require('stream');
var jayson = require('jayson');

// inject a new first argument into a JSON-RPC call object
function injectFirstArg(obj, arg) {
  if(!obj.params) {
    obj.params = [arg];
  } else {
    obj.params = [arg].concat(obj.params);
  }

  return obj;
}

// convert normal js error to JSON-RPC error object
function jsonError(err, code) {
  return {code: code || 500, message: err.message || "Unknown error"};
}

function streamToArray(s, cb) {
  var onlyStrings = true;
  var data = [];
  s.on('data', function(d) {
    data.push(d);
    if(typeof d !== 'string') {
      onlyStrings = false;
    }
  });
  s.on('end', function() {
    if(onlyStrings) {
      cb(null, data.join(''));
    } else {
      cb(null, data);
    }
  })
  s.on('error', cb);
}

function mundanifyResult(res, cb) {
  if(res instanceof stream.Readable) {
    streamToArray(res, cb);
  }
  if(res instanceof Array) {
    async.eachOf(res, function(item, i, next) {
      if(item instanceof stream.Readable) {
        streamToArray(item, function(err, item) {
          if(err) return next(err);
          
          res[i] = item;
          next();
        });
      } else {
        next();
      }
    }, function(err) {
      if(err) return cb(err);
      cb(null, res);
    });
  }
}

function mundanifyFunction(f, group) {
  return function(args, cb) {
    var res;

    if(group) {
      var userData = args[0];

      if(!userData) {
        return cb(jsonError(new Error("You must be logged in to access this function"), 401));
      }
      if(userData.group !== group) {
        return cb(jsonError(new Error("You must be in the " + group + " group to access this function"), 401));
      }
    }

    if(f._rpcOpts) { // is this an rpc-multistream syncStream function?
      if(f._rpcOpts.type === 'w') {
        return cb(new Error("Functions returning a write stream over the JSON-RPC 2.0 API"));
      }

      res = f.apply(null, args);
      mundanifyResult(res, function(err, cbArgs) {
        if(err) return cb(jsonError(err));

        cb(null, [cbArgs]);
      })

    } else {

      args[args.length] = function() {
        if(arguments.length && arguments[0]) {
          return cb(jsonError(arguments[0]));
        }

        var cbArgs = Array.prototype.slice.call(arguments, 1); // convert to array

        
        mundanifyResult(cbArgs, function(err, cbArgs) {
          if(err) return cb(jsonError(err));

          cb(null, cbArgs);
        });

      };
      f.apply(null, args);
    }
  }
}


function mundanify(loginMethod, methods, o, group) {

  o = o || {};

  var fname;
  for(fname in methods) {
    if(!group && typeof methods[fname] === 'object') {
      mundanify(loginMethod, methods[fname], o, fname);
      continue;
    }

    o[fname] = mundanifyFunction(methods[fname], group);
  }

  if(loginMethod) {
    o.login = function(args, cb) {
      loginMethod.apply(null, args.concat([function(err) {
        if(err) return cb(jsonError(err));

        cb.apply(null, arguments);
      }]));
    }
  };

  return o;
}

// return a plain http error
function httpError(res, err, code) {
  res.setHeader("Content-Type", "text/plain");
  res.statusCode = code || 500;
  if(typeof err === 'string') {
    res.end(err);
  } else if(typeof err === 'object' && err.message) {
    res.end(err.message);
  } else {
    res.end("Unknown error");
  }
}

function rpcRoute(jsonRPCMiddleware, myAuth, authFunc) {

  return function(req, res, match) {

    var data = '';
    req.on('data', function(d) {
      data += d;
    })

    req.on('error', function(err) {
      httpError(res, err);
    });

    req.on('end', function() {
      if(!data) {
        httpError(res, "Bad request: Missing request body", 400);
        return;
      }
      data = JSON.parse(data);
      if(!data) {
        httpError(res, "Bad request: Invalid JSON", 400);
        return;
      }    

      function postAuth(err, userData) {        
        if(err) {
          data = injectFirstArg(data, null);
        } else {
          data = injectFirstArg(data, userData);
        }
        
        req.body = data;
        jsonRPCMiddleware(req, res);
      }

      if(authFunc) {
        if(data.method === 'login') {
          data = injectFirstArg(data, res);
          req.body = data;
          jsonRPCMiddleware(req, res);
          return;
        }
        if(typeof authFunc !== 'function') {
          myAuth(req, data, postAuth);
          return;
        }

        myAuth(req, function(err, tokenData) {
          authFunc(err, tokenData, postAuth);
        });

      } else {
        req.body = data;
        jsonRPCMiddleware(req, res); 
      }

    });
  }
};

function makeMiddleware(loginFunc, rpcMethods) {
  return jayson.server(mundanify(loginFunc, rpcMethods)).middleware();
}

module.exports = {
  route: rpcRoute,
  middleware: makeMiddleware
};
