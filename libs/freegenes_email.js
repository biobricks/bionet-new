var path = require('path');

var templateDir = path.join('..', 'email_templates');

function templateReplace(text, varName, value) {
  return text.replace(new RegExp('<%\s?'+varName+'\s?%>', 'g'), value);
}

function template(templateName, pairs, cb) {
  var template = fs.readFile(path.join(templateDir, templateName), {encoding: 'utf8'}, function(err, data) {
    if(err) return cb(err);

    var key;
    for(key in pairs) {
      data = templateReplace(data, key, pairs[key]);
    }

    cb(null, data);

  });


}

module.exports = function(settings, db, freegenesMailer) {

  // first email
  // triggered when virtual is created with a freegenes property
  this.virtual_create_trigger = function(virtual, cb) {

    var email = virtual.freegenes.author.email;

    var pairs = {
      name: virtual.freegenes.author.name,
      material_name: virtual.freegenes.info.documentation.gene_name,
      virtual_url: settings.base_url + '/virtual/' + virtual_id
    };

    template('freegenes_virtual_created.txt', pairs, function(err, data) {
      if(err) return cb(err);

      db.queueEmail({
        mailer: 'freegenes'
        to: email, 
        subject: "Synthesis request accepted", 
        text: data
      }, cb);

    });
      
  };

  // second email
  // triggered when status:'sequence_confirmed'
  // meaning it has been built and is ready for requesting
  this.virtual_built = function(virtual, cb) {

    var email = virtual.freegenes.author.email;

    var pairs = {
      name: virtual.freegenes.author.name,
      virtual_url: settings.base_url + '/virtual/' + virtual_id
    };

    template('freegenes_virtual_built.txt', pairs, function(err) {
      if(err) return cb(err);

      db.queueEmail({
        mailer: 'freegenes'
        to: email, 
        subject: "Synthesis completed", 
        text: data
      }, cb);

    });

  };

  this.request_material = function() {
    // third: when we have sent the docusign email
  };

  this.remote_tto_has_signed = function() {
    // fourth: email _to_ freegenes (and stanford) when the TTO has signed
  };


  this.local_tto_has_signed = function() {
    // fifth: email _to_ freegenes when the Stanford TTO has signed
  };

  this.request_fulfilled = function() {
    // sixth: when it ships
  };

};
