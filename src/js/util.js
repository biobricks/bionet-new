import ashnazg from 'ashnazg'

module.exports = {
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
  }
}
