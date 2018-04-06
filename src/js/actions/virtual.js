
import util from '../util.js'
import xtend from 'xtend'

module.exports = {

  delete: function(id, opts, cb) {
    if(typeof opts === 'function') {
      cb = opts;
      opts = {}
    }

    opts = xtend({
      withVirtuals: false // TODO not yet implemented
    }, opts || {});
 
    app.remote.delVirtual(id, cb);
  }

}
