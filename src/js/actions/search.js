
import util from '../util.js'

module.exports = {

  global: function(type, query) {
    if(type === 'human') {
      return app.remote.peerSearch('searchVirtuals', query);
    } else {
      return app.remote.peerSearch('blastStream', query);
    }
  },

  // auto-detect query type
  auto: function(query, page, perPage, opts, cb) {

    query = query.trim();

    // IUPAC and BLAST+ allowed characters
    // https://www.ncbi.nlm.nih.gov/books/NBK53702/#gbankquickstart.if_i_don_t_know_the_base
    // https://blast.ncbi.nlm.nih.gov/Blast.cgi?CMD=Web&PAGE_TYPE=BlastDocs&DOC_TYPE=BlastHelp
    if(!query.match(/[^UTGACRYMKSWHBVDN-]/)) { // DNA and RNA
      // assuming this is nucleotides
      // TODO this could still be amino acids, need to clarify with user

      return app.actions.search.blast(query, page, perPage, opts, cb);
    }

    // TODO implement AA search
    // else if(!query.match(/[^ABCDEFGHIKLMNPQRSTUVWYZX*-]/)) { // Amino acids

    // TODO default to human search instead
    return app.actions.search.exact(query, page, perPage, opts, cb)

  },

  // opts:
  // `onlyAvailable`: Only return virtuals that have a physical
  blast: function(query, page, perPage, opts, cb) {

    if(page < 1) page = 1;
    if(perPage < 1) perPage = 1;

    opts = opts || {};
    opts.maxResults = perPage;
    opts.offset = perPage * (page - 1);

    // replace all non-DNA/RNA characters
    query = util.stripNonNTChars(query);

    if(!query) {
      process.nextTick(function() {
        cb(new Error("Query contains invalid nucleotide characters"));
      });
      return;
    }

    return app.remote.blast(query, opts, cb);
  },

  // match exact substrings
  exact: function(query, page, perPage, opts) {
    opts = opts || {}
    opts.offset = ((page - 1) * perPage);
//    opts.maxResults = perPage;

    return app.remote.searchVirtuals(query, opts);
  },

  // human language search using elasticsearch
  human: function(query, page, perPage, opts) {
    console.warn("human language search not yet implemented. falling back to exact text matching");
    return app.actions.search.exact(query, page, perPage, opts)
  },

  // TODO make this return a stream via callback like the others
  fakeSearch(query, page, perPage, cb) {
    var self = this;

    function fakeResults(start, length, postfix) {
      var results = [];
      var i;
      for(i=start; i < start + length; i++) {
        results.push({
          name: "This is a fake result - " + postfix + ' - ' +  i,
          description: "Yeah it's really a fake result. Very fake. I don't know if I can really say much more about it. I just feel so full of fnord."
        });
      }

      return {
        results: results,
        hits: 1000
      }
    }
    
    setTimeout(function() {
      cb(null, queryID, fakeResults(page * perPage, perPage, query));
    }, 3000);
  }

   


}
