import path from 'path'
import ashnazg from 'ashnazg'

// parses a version like 1.12.3 into a number like 10000012000003
function parseVersion(str) {
  if(!str) throw new Error("Failed to parse version string: " + str);

  var fields = str.split('.');
  if(fields.length != 3) {
    throw new Error("Failed to parse version string: " + str);
  }

  var n;
  fields = fields.map(function(s) {
    n = parseInt(s);
    if(n > 999999) {
      throw new Error("Failed to parse version string: " + str);
    }
    return n;
  });

  return fields[0] * 1000000000000 + fields[1] * 1000000 + fields[2];
}



module.exports = {

  requireAsync: function(filename, cb) {
    if(!filename) throw new Error("No filename specified");
    if(!filename.match(/\.js$/i)) {
      filename += '.js';
    }

    var filePath = '/static/build/lazy_modules/'+filename;
    var moduleName = path.basename(filename, '.js');

    var el = document.createElement('SCRIPT');

    el.async = true;
    el.src = filePath;
    
    // don't re-add script tag if it has already been added
    var els = document.getElementsByTagName('SCRIPT');
    var i;
    for(i=0; i < els.length; i++) {

      if(els[i].src === el.src) {
        cb(null, require(moduleName));
        return;
      }
    }    

    el.addEventListener('load', function(e) {
      try {
        var module = require(moduleName)
        cb(null, module);
      } catch(e) {
        cb(null, e); 
      }
    });

    el.addEventListener('error', function(err) {
      cb(err);
    });

    el.addEventListener('abort', function() {
      cb(new Error("Loading JS file '" + filename + "' was aborted"));
    });

    document.body.appendChild(el);
  },


  user: {
    isInGroup: function(user, group) {
      if(!group) {
        group = user;
        user = app.state.global.user;
      }

      if(!user || !user.userData) return false;
      if(!user.userData.groups || !user.userData.groups.length) return false;
      if(user.userData.groups.indexOf(group) >= 0) return true;

      return false;
    }

  },

  whenConnected: function(cb) {
    if(app.state.global.connection && app.state.global.connection.state === 'connected') {
      cb('connected');
    } else {
      ashnazg.listen('global.connection.state', function(state) {
        if(state === 'connected') {
          cb(state);
        }
      });
    }
  },

  whenLoggedIn: function(cb) {
    if(app.state.global.user) {
      cb(app.state.global.user);
    } else {
      ashnazg.listen('global.connection.user', function(user) {
        cb(user);
      });
    }
  },

  // If the string contains any characters that aren't
  // DNA/RNA characters as allowed by BLAST+ return false. Otherwise true.
  // if strict is true then treat lower case characters as invalid
  isNT: function(str, strict) {

    if(!strict) {
      str = str.toUpperCase();
    }

    // IUPAC and BLAST+ allowed characters
    // https://www.ncbi.nlm.nih.gov/books/NBK53702/#gbankquickstart.if_i_don_t_know_the_base
    // https://blast.ncbi.nlm.nih.gov/Blast.cgi?CMD=Web&PAGE_TYPE=BlastDocs&DOC_TYPE=BlastHelp
    if(str.match(/[^UTGACRYMKSWHBVDN-]/)) {
      return false;
    }
    return true;
  },
  
  // strip non-nucleotide chars
  stripNonNTChars: function(str, strict) {
    if(!strict) {
      str = str.toUpperCase();
    }    

    return str.replace(/[^UTGACRYMKSWHBVDN-]+/g, '');
  },

  // get free genes status from a virtual

  /*
    Notes on status progress:
    
    ordered -> build_ready (all fragments arrived or abandoned (they cannot build it) -> building (being assembled) -> build_complete (if this is "Good_sequence" then it is complete. any other value means not complete. complete means: is the assembly and cloning successful?, if not build_attempts array length is how many attempts including in-progress attempt)
    
  */
  getFreegenesStatus(v) {
    var s = v.freegenes;
    if(!s.status) return null;

    if(parseVersion(s.version) >= parseVersion('2.0.0')) {

      var state = s.status.current_status;

      if(state === 'submitted') {
        return 'optimizing';
      }
      if(state === 'ordered') {
        return 'synthesizing';
      }
      if(state === 'synthesis_abandoned') {
        return {status: 'synthesizing', error: "After multiple attempts the sequence could still not be synthesized."};
      }

      if(state === 'received' || state === 'building' || state === 'cloning_failure') {
        return 'cloning';
      }

      if(state === 'sequencing' || state === 'sequence_failure') {
        return 'sequencing';
      }

      if(state === 'cloning_abandoned') {
        return {status: 'cloning', error: "After multiple attempts the sequence could not be cloned."};
      }

      if(state === 'sequence_confirmed') {
        return 'shipping';
      }

    } else {


      if(s.abandoned) {
        return 'failed';
      }
      
      if(s.build_complete && s.build_complete.match(/good[-_]sequence/i)) {
        return 'shipping';
      } 

      if(s.building) {
        return 'cloning';
      }

      if(s.build_ready) {
        return 'sequencing';
      }

      if(s.ordered) {
        return 'synthesizing';
      }

      // TODO we don't have a way to differentiate 'optimizing' with 'received'

      return 'optimizing';
    }
  }
}
