#!/usr/bin/env node

var fs = require('fs');
var path = require('path');
var colors = require('colors');
var browserify = require('browserify');
var watchify = require('watchify');
var hmr = require('browserify-hmr');
var minimist = require('minimist');
var beep = require('beepbeep');
var glob = require('glob');

// TODO
// Use factor-bundle to avoid having the same code in multiple bundles.
// See: https://github.com/browserify/browserify/issues/1607
// It would be nice but it seems like it's not possible to require
// the resulting split bundles from each-other
//var factorBundle = require('factor-bundle');

function getTime() {
  var d = new Date;
  var t = [d.getHours(), d.getMinutes(), d.getSeconds()];
  t = t.map(function(i) {
    return (i < 9) ? '0'+i : i;
  })
  return t[0] + ':' + t[1] + '.' + t[2];
}

function build(opts) {
  opts = opts || {};

  var output = opts.output || path.join(__dirname, '..', 'static', 'build', 'bundle.js');

  function onBuildEnd(msg) {
    console.log("Completed".green + ((msg) ? (': ' + msg) : ''));
  }

  function onBuildStart() {

    process.stdout.write("Build started at " + getTime() + "... ");

    var outStream = fs.createWriteStream(output);

    if(!opts.dev) {
      outStream.on('close', onBuildEnd);
    }

    b.bundle()

      .on('error', function(err) {
        beep();
        if(err instanceof SyntaxError && err.message.match(/while parsing file/)) {
          // Format syntax error messages nicely
          var re = new RegExp(err.filename+'\:? ?');
          var msg = err.message.replace(re, '');
          msg = msg.replace(/ while parsing file\:.*/, '');
          console.error();
          console.error("\nError: ".red + msg.underline);
          console.error();
          console.error("Filename:", err.filename);
          console.error();
          console.error(err.loc);
          console.error();
          console.error(err.codeFrame);
          console.error();
        } else {
          console.error(err);
        }
      })
    
      .pipe(outStream);
  }

  var b = browserify({
    entries: [opts.source || path.join(__dirname, '..', 'src', 'js', 'index.js')],
    cache: {},
    packageCache: {}
  })


  // tell browserify that modules for lazy loading are external
  try {
    var lazies = glob.sync(path.join(__dirname, '..', 'src', 'js', 'lazy_modules', '*.js'))

    var i;
    for(i=0; i < lazies.length; i++) {
      b.external(path.basename(lazies[i], '.js'));
    }
    
  } catch(err) {
    console.error(err);
  }

/*
  var b = browserify({
    entries: [opts.source || path.join(__dirname, '..', 'src', 'js', 'index.js'), path.join(__dirname, '..', 'src', 'js', 'lazy_modules', 'foo.js')],
    cache: {},
    packageCache: {}
  })

  b.plugin(factorBundle, {
    outputs: [path.join(__dirname, '..', 'static', 'build', 'bundle.js'), path.join(__dirname, '..', 'static', 'build', 'lazy_modules', 'foo.js')]  
  });

//  b.external('foo');
*/

  if(opts.dev) {
    console.log("Watching for changes...".yellow);
    b.plugin(watchify);
  }

  if(opts.hot) {
    console.log("Hot module reloading enabled".yellow);
    b.plugin(hmr);
  }

  b.on('update', function(time) {
    onBuildStart();  
  });

  if(opts.dev) {
    b.on('log', onBuildEnd);
  }

  b.transform('babelify', {
    presets: [
      'es2015'
    ],
    plugins: [
      ['transform-react-jsx', {pragma: 'h'}],
      'transform-object-rest-spread',
      'transform-class-properties'
    ]
  });

  b.transform('browserify-markdown');
  var alias = opts.alias || {
      "react": "preact-compat",
      "react-dom": "preact-compat"
  } 
  b.transform('aliasify', {
    aliases: alias,
    global: true
  });
  b.transform('sassify');

  onBuildStart();
}

if (require.main === module) {

  var argv = minimist(process.argv.slice(2), {
    alias: {
      d: 'dev'
    },
    boolean: [
      'dev',
      'hot'
    ],
    default: {}
  });
  
  build(argv);

} else {

  module.exports = {
    build: build,
      
    buildtest: function(opts) {
        opts = opts || opts;
        opts.output = path.join(__dirname, '..', 'static', 'build', 'index.test.js');
        opts.source = path.join(__dirname, '..', 'tests', 'index.js');
        opts.test = true;
        opts.alias = {
          'react-dom/server': 'preact-render-to-string',
          'react-addons-test-utils': 'preact-test-utils',
          'react-addons-transition-group': 'preact-transition-group',
          'react': 'preact-compat-enzyme',
          'react-dom': 'preact-compat-enzyme',
          'react-test-renderer/shallow': "preact-test-utils",
          'react-test-renderer': "preact-test-utils"
        }
      return build(opts);
    },

    watch: function(opts) {
      opts = opts || opts;
      opts.dev = true;
      return build(opts);
    },

    hot: function(opts) {
      opts = opts || opts;
      opts.dev = true;
      opts.hot = true;
      return build(opts);
    }
  }

}
