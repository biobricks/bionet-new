
var fs = require('fs');
var http = require('http');
var https = require('https');
var xtend = require('xtend');
var simpleQueryString = require('simple-query-string');
var oauth2 = require('simple-oauth2');

function oauthCreate(clientID, clientSecret) {

  return oauth2.create({
    client: {
      id: clientID,
      secret: clientSecret
    },
    auth: {
      tokenHost: 'https://app.pandadoc.com',
      tokenPath: '/oauth2/access_token',
      authorizePath: '/oauth2/authorize'
    },
  });
}

function redirect(res, url) {
  res.writeHead(302, {
    'Location': url
  });
  res.end();
}

function request(opts, cb) {
  opts = xtend({
    method: 'POST',
    accessToken: undefined,
    data: {},
    docID: undefined,
    action: undefined
  }, opts || {});

  if(!opts.accessToken) {
    process.nextTick(function() {
      cb(new Error("Missing opts.accessToken"));
    });
    return;
  }

  var urlPath = '/public/v1/documents';
  if(opts.docID) {
    urlPath += '/'+opts.docID;
    if(opts.action) {
      urlPath += '/'+opts.action;
    }
  }
  
  var authHeader = 'Bearer ' + opts.accessToken;

  var data = '';
  var req = https.request({
    method: opts.method.toUpperCase(),
    protocol: 'https:',
    hostname: 'api.pandadoc.com',
    port: 443,
    path: urlPath,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': authHeader
    }
  }, function(res) {
    res.setEncoding('utf8');
    res.on('data', function(curData) {
      data += curData;
    });
    res.on('end', function() {
      if(res.statusCode !== 200 && res.statusCode !== 201) {
        return cb(new Error("Got unexpected status code: " + res.statusCode) + ': ' + data);
      }

      cb(null, data);
    });
  });

  req.once('error', function(err) {
    cb(err);
  });

  if(opts.data) {
    if(typeof opts.data !== 'string') {
      opts.data = JSON.stringify(opts.data);
    }
    req.write(opts.data);
  }
  req.end();
}


function getDocumentStatus(id, accessToken, cb) {
  request({
    method: 'GET',
    accessToken: accessToken,
    docID: id
  }, function(err, data) {
    if(err) return cb(err);

    data = JSON.parse(data);
    
    cb(null, data.status);
  });
}

function getDocumentDetails(id, accessToken, cb) {
  request({
    method: 'GET',
    accessToken: accessToken,
    docID: id+'/details'
  }, function(err, data) {
    if(err) return cb(err);

    data = JSON.parse(data);
    
    cb(null, data);
  });
}

function waitForDocStatus(id, targetStatus, accessToken, cb, timeWaited) {
  timeWaited = timeWaited || 0;

  getDocumentStatus(id, accessToken, function(err, status) {
    if(err) return cb(err);

    if(status == targetStatus) {
      return cb(null, id);
    }

    if(timeWaited >= 30) {
      return cb(new Error("Timeout waiting for pandadoc server"));
    }

    setTimeout(function() {
      waitForDocStatus(id, targetStatus, accessToken, cb, timeWaited+3000);
    }, 3000);
  });
}

function sendDocument(id, message, accessToken, cb) {
  var data = {
    message: message
  };

  request({
    method: 'POST',
    accessToken: accessToken,
    docID: id,
    action: 'send',
    data: data
  }, function(err, resData) {
    if(err) return cb(err);

    resData = JSON.parse(resData);
    
    cb(null, resData);
  });  
}

/* 
  example output:

  "{\"id\":\"<doc_id_string>\",\"name\":\"Open Material Transfer Agreement\",\"status\":\"document.uploaded\",\"date_created\":\"2018-05-24T15:21:51.847167Z\",\"date_modified\":\"2018-05-24T15:21:51.847167Z\",\"uuid\":\"<uuid_string>\"}"
*/
function createDocument(recipient, stanford, formData, templateUUID, accessToken, cb) {

  // convert format from `key: value` to `[{name: key, value: value}]`
  var fields = {};
  var key;
  for(key in formData) {
    fields[key] = {
      value: formData[key]
    };
  }

  recipient.role = 'recipient';
  stanford.role = 'stanford';

  var data = {
    name: "Open Material Transfer Agreement",
    template_uuid: templateUUID,
    recipients: [recipient, stanford],
    fields: fields
  };

  request({
    method: 'POST',
    accessToken: accessToken,
    data: data
  }, function(err, result) {
    if(err) return cb(err);

    result = JSON.parse(result);

    waitForDocStatus(result.id, 'document.draft', accessToken, cb);
  });
}


function createTestDocument(templateUUID, cb) {

  var recipient = {
    email: 'test@juul.io',
    first_name: 'Tech transfer',
    last_name: 'Officer',
    role: 'recipient'
  };

  var data = {
    exhibit_b: false,
    recipient_org_name: "Fake Organization",
    recipient_org_address: "1000 Fake street, Oakland, CA 94607",
    recipient_scientist_name: "Recipient Scientist",
    recipient_scientist_title: "Doctor",
    material_description: "Test plasmid",
    shipping_address_name: "Receiving Lab Tech",
    shipping_address: "1234 Fake street, Room 214, Oakland, CA 94607",
    transmittal_fee: false,
    transmittal_fee_amount: "0",
    attribution: false,
    notify_on_redistribute: false,
    attachment_present: false
  };

  createDocument(recipient, data, templateUUID, function(err, id) {
    if(err) return cb(err);

    sendDocument(id, "This is a test OpenMTA document. Please sign it.", cb);
  });
}


function PandaDoc(settings, router, login, userCookieAuth, opts) {
  if(!settings.pandadoc) return;
  if(!(this instanceof PandaDoc)) return new PandaDoc(settings, router, login, userCookieAuth, opts);

  opts = xtend({ 
    debug: false
  }, opts || {});

  this.settings = settings;
  this.authenticated = false;

  this.oa = oauthCreate(settings.pandadoc.client_id, settings.pandadoc.client_secret);

  /*
    // format of this.token:
    {
      access_token: "<token_str>",
      token_type: "Bearer",
      expires_in: 31535999,
      scope: "read write read+write",
      refresh_token: "<refresh_token_str>",
      expires_at: "2019-06-21T11:43:23.063Z"
    }
  */
  try {
    var token = require(settings.pandadoc.access_token_filepath);
    this.token = this.oa.accessToken.create(token);  

    if(!this.token.expired()) {
      this.authenticated = true;
    }
  } catch(e) {
    console.log(e);
    // ignore errors
  }

  console.log("[pandadoc] initialized -",(this.authenticated) ? 'authenticated' : 'not authenticated');

  router.addRoute('/pandadoc/login', function(req, res, match) {
    fs.createReadStream('static/pandadoc_login.html', {encoding: 'utf8'}).pipe(res);
  });
  
  router.addRoute('/pandadoc/login-post', function(req, res, match) {

  })

  router.addRoute('/pandadoc/auth', function(req, res, match) {

    var body = '';

    req.on('data', function(data) {
      body += data;
    });
    req.on('end', function() {
      if(!body) {
        redirect(res, '/pandadoc/login');
        return;
      }
      try {
        var loginData = simpleQueryString.parse(body);
      } catch(e) {
        redirect(res, '/pandadoc/login');
        return;
      }
      
      login(res, loginData.username, loginData.password, function(err, userData, token) {
        if(err) {
          res.end("Error: " + err.message);
          return;
        };

        if(!userData.user.groups || userData.user.groups.indexOf('admin') < 0) {
          res.end("You must be an administrator to access this page");
          return;
        }

        if(!this.token) return this.reAuth(res, '/pandadoc/auth-success');
        
        if(this.token.expired()) {

          this.token.refresh(function(err, result) {
            if(err) {
              res.end("Token refresh failed: " + err.message);
              return;
            }
            this.token = result;
            this.authenticated = true;
            this.writeAccessToken(function(err) {
              if(err) console.error("Error writing access token:", err);

              redirect(res, '/panadoc/auth-success');
            });
          }.bind(this));
          return;
        }
        
        redirect(res, '/pandadoc/auth-success');

      }.bind(this));
    }.bind(this));
  }.bind(this));

  router.addRoute('/pandadoc/not-admin', function(req, res, match) {
    res.end("Only administrators can a bionet node for pandadoc access");
  });

  router.addRoute('/pandadoc/auth-success', function(req, res, match) {
    res.end('<html><body><p>Pandadoc has been successfully authenticated.</p><p><a href="/admin">Click here to continue</a>');
  });;

  router.addRoute('/pandadoc/callback*', function(req, res, match) {

    var query = simpleQueryString.parse(req.url);

    var redirect_url = '/pandadoc/auth-success';
    
    var opts = {
      code: query.code
    };

    this.oa.authorizationCode.getToken(opts).then(function(result) {

      // this token object includes both the access token and refresh token
      this.token = this.oa.accessToken.create(result);
      this.authenticated = true;

      this.writeAccessToken(function(err) {
        if(err) console.error("Error writing access token:", err);

        redirect(res, redirect_url);
      });
    }.bind(this), function(err) {

      console.error('Access Token Error', err.message);
      res.end(err.message);
    });

  }.bind(this));


  this.reAuth = function(res, redirect_path) {
    
    var authUrl = this.oa.authorizationCode.authorizeURL({
      redirect_uri: settings.pandadoc.redirect_url,
      scope: 'read+write',
      state: encodeURIComponent(redirect_path)
    });
    
    redirect(res, authUrl);
  }

  this.writeAccessToken = function(cb) {
    fs.writeFile(settings.pandadoc.access_token_filepath, JSON.stringify(this.token), {
      encoding: 'utf8'
    }, cb);
  }

  this.createDocument = function(recipient, emailMsg, data, templateUUID, cb) {
    var accessToken = this.token.token.token.access_token;

    createDocument(recipient, this.settings.pandadoc.stanford, data, templateUUID, accessToken, function(err, id) {
      if(err) return cb(err);
      
      sendDocument(id, emailMsg, accessToken, function(err) {
        if(err) return cb(err);

        cb(null, id);
      });
    });
  };

  this.getDocumentStatus = function(id, cb) {
    var accessToken = this.token.token.token.access_token;

    getDocumentStatus(id, accessToken, cb);
  };

  this.getDocumentDetails = function(id, cb) {
    var accessToken = this.token.token.token.access_token;

    getDocumentDetails(id, accessToken, cb);
  };

}




module.exports = PandaDoc;
