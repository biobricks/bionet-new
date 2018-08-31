
import util from '../util.js'
import xtend from 'xtend'

module.exports = {

  del: function(id, opts, cb) {
    if(typeof opts === 'function') {
      cb = opts;
      opts = {}
    }

    opts = xtend({
      withPhysicals: false // TODO not yet implemented
    }, opts || {});
 
    app.remote.delVirtual(id, function(err) {
      cb(err);
    });
  }

}
