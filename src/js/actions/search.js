
module.exports = {

  // auto-detect query type
  auto: function(query, page, perPage, cb) {

    query = query.trim();

    // IUPAC and BLAST+ allowed characters
    // https://www.ncbi.nlm.nih.gov/books/NBK53702/#gbankquickstart.if_i_don_t_know_the_base
    // https://blast.ncbi.nlm.nih.gov/Blast.cgi?CMD=Web&PAGE_TYPE=BlastDocs&DOC_TYPE=BlastHelp
    if(!query.match(/[^UTGACRYMKSWHBVDN-]/)) { // DNA and RNA
      // assuming this is nucleotides
      // TODO this could still be amino acids, need to clarify with user

      return app.actions.search.blast(query, page, perPage, cb);
    }

    // TODO implement AA search
    // else if(!query.match(/[^ABCDEFGHIKLMNPQRSTUVWYZX*-]/)) { // Amino acids

    // TODO default to human search instead
    return app.actions.search.exact(query, page, perPage, cb)

  },

  blast: function(query, page, perPage, cb) {
    if(page < 1) page = 1;
    if(perPage < 1) perPage = 1;

    return app.remote.blast(query, {
      maxResults: perPage,
      offset: perPage * (page - 1)
    }, cb);
  },

  // match exact substrings
  exact: function(query, page, perPage, cb) {
    return cb(new Error("not yet implemented"));
  },

  // human language search using elasticsearch
  human: function(query, page, queryID, cb) {
    return cb(new Error("not yet implemented"));
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
