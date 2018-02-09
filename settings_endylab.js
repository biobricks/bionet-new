/*
  This is the example configuration file for bionet
  Copy this file to settings.js and edit as needed.
*/

var path = require('path');

var settings = {

  // name of lab to create on first run
  lab: "name of my lab",

  hostname: 'localhost', // bind to this hostname or IP (assumes all if undefined)
  port: 8000, // bind to this port

  // Port for low-level access to db via multilevel.
  dbPort: 13377, 

  // The url where this app is accessed
  // Used for generating email links
  // and as the universally unique peer name
  baseUrl: 'http://localhost:8000',

  // set debug to true for lots of helpful debug info on console
  // debug mode enables sending of emails and instead prints them to console
  debug: false, 

  loginToken: {
    secret: "MY UNIQUE SECRET", // must be a unique secret
    expiration: 14 // login token expiration in days
  },

  // If set, this master password is required to sign up
  // if falsy, only admins can create users
  //  must be set in www/settings.js
  // or the UI will not reflect the change
  userSignupPassword: 'code',

  mailer: {
    type: "smtp", // can also be "direct" or "console"
    host: "localhost", // only needed for type: "smtp"
    port: 25, // only needed for type: "smtp"
    tls: false,
    from_address: "noreply@example.org",
    subjectPrefix: "[bionet.myhost.org]", // system email subjects are prefixed with this
    requestFulfillerEmail: "someone@example.org" // Email where requests for biomaterials are sent
  },

  // ----------
  // File paths
  // Note: All file paths are converted to absolute paths on app startup
  // ----------

  // where static files are located
  staticPath: 'static',

  // Where files uploaded/generated by users are stored
  userFilePath: 'user_static',

  blast: {
    mode: 'blastdb', // keep on-disk blast databases
    binPath: undefined, // where are BLAST+ binaries. Must be in PATH if undefined
    path: 'blast' // where to store BLAST databases (relative to app root)
  },

  // which ElasticSearch server to use
  elasticSearch: {
    hostname: 'localhost',
    port: 9200
  },

  // Settings related to label printing
  labDevice: {

    // Where label image files are stored.
    // Relative to userFilePath
    labelImageFilePath: 'labels',

    // hostname where we should listen for printer client connections
    // (this is optional: falls back to settings.hostname if not specified)
    serverHost: "localhost",

    // port where we should listen for printer client connections
    serverPort: 4200,

    // path to the host ssh private key
    hostKey: path.join(__dirname, 'labdevice', 'hostkey'),

    // path to directory containing the public keys of authorized labdevice clients
    clientKeys: path.join(__dirname, 'labdevice', 'client_keys')
  },

  dataTypes: 
    [{
      name: "lab",
      title:"Lab",
      xUnits:1,
      yUnits:5,
      fields: {
        Description: 'text'
      }
    },{
      name: "-80 freezer",
      title:"-80C Freezer",
      xUnits:1,
      yUnits:5,
      fields: {
        Description: 'text',
        Shelf: 'text',
        Rack: 'text',
        Box: 'text'
      }
    },{
      name: "-20 freezer",
      title:"-20C Freezer",
      xUnits:1,
      yUnits:5,
      fields: {
        Description: 'text',
        Shelf: 'text',
        Rack: 'text',
        Box: 'text'
      }
    },{
      name: "-4 fridge",
      title:"4C Fridge",
      xUnits:1,
      yUnits:5,
      fields: {
        Description: 'text',
        Shelf: 'text',
        Rack: 'text',
        Box: 'text'
      }
    },{
      name: "freezer rack",
      title:"Rack",
      xUnits:5,
      yUnits:4,
      fields: {
        Description: 'text'
      }
    },{
      name: "8 x 12 freezer box",
      title:"8x12 Box",
      xUnits:12,
      yUnits:8,
      fields: {
        Description: 'text'
      }
    },{
      name: "9 x 9 freezer box",
      title:"9x9 Box",
      xUnits:9,
      yUnits:9,
      fields: {
        Description: 'text'
      }
    },{
      name: "freezer box",
      title:"Box",
      fields: {
        Description: 'text'
      }
    },{
      name: "shelving unit",
      title:"Shelving Unit",
      fields: {
        Description: 'text'
      }
    },{
      name: "shelf",
      title:"Shelf",
      xUnits:4,
      yUnits:1,
      fields: {
        Description: 'text'
      }
    },{
      name: "cabinet",
      title:"Cabinet",
      fields: {
        Description: 'text'
      }
    },{
      name: "drawer",
      title:"Drawer",
      fields: {
        Description: 'text'
      }
    },{
      name: "organism",
      title:"Organism",
      virtual: true,
      fields: {
        Genotype: 'text',
        Sequence: 'text'
      }
    },{
      name: "vector",
      title:"Vector",
      virtual: true,
      fields: {
        Description: 'text',
        Sequence: 'text'
      }
    },{
      name: "single-stranded",
      title:"Single-Stranded",
      virtual: true,
      fields: {
        Description: 'text',
        Sequence: 'text'
      }
    },{
      name: "double-stranded",
      title:"Double-Stranded",
      virtual: true,
      fields: {
        Description: 'text',
        Sequence: 'text'
      }
    },{
      name: "chemical stock",
      title:"Chemical Stock",
      virtual: true,
      fields: {
        Description: 'text'
      }
    }],


   // the relative URL at which symbol files 
   // for the label generator are available
   symbolPath: '/static/symbols',
 
   // If false, anyone can create users
   // if true, only admins can create users (ToDo not implemented yet)
   // !!!IMPORTANT!!! 
   // IF true userSignupPassword must also be set
   // or it will still be possible for anyone to create users
   // the setting in this file only affects the UI and provides no security
   restrictUserSignup: true,

   // DHT channel name used to discovering other nodes 
   // comment this out to disable discovery
   dhtChannel: 'bionet-nodes',

  // Latitude and longtitude of the node's lab
  physicalPosition: [2.2, 2.2], 

  // Where requested biomaterials should be sent
  physicalAddress: [
    "Name of Lab",
    "ATT: Name of Lab Manager",
    "Address line 1",
    "Address line 2",
    "State or region",
    "Zip or postal code",
    "Country"
  ],

   labLayout: {}
};

module.exports = function(argv) {
  argv = argv || {};

  settings.labDevice.labelImageFilePath = path.resolve(path.join(settings.userFilePath, settings.labDevice.labelImageFilePath));
   
  settings.staticPath = path.join(__dirname, settings.staticPath);
  settings.userFilePath = path.join(__dirname, settings.userFilePath);

  settings.debug = argv.debug || settings.debug;
  if(settings.debug) {
    // don't actually end emails in debug mode
    settings.mailer.type = 'console';
  }

  var m = settings.baseUrl.match(/ttp:.*:(\d+)/);
  if(m) {
    settings.externalPort = parseInt(m[1]);
  } else {
    if(settings.baseUrl.match(/^https/)) {
      settings.externalPort = 443;
    } else {
      settings.externalPort = 80;
    }
  }

  return settings;
};