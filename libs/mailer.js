
module.exports = function(opts, base_url) {
  
  this.opts = opts || {};
  this.mailer = null;

  if(!this.opts.from_address) {
    throw new Error("settings.mailer.from_address must be set");
  }

  if(opts.type == 'direct') {
    this.mailer = require('nodemailer').createTransport();
  } else if(opts.type == 'smtp') {
    var smtpTransport = require('nodemailer-smtp-transport');
    this.mailer = require('nodemailer').createTransport(smtpTransport({
      host: opts.host || "localhost",
      port: opts.port || 25,
      ignoreTLS: !opts.tls
    }));
  } else { // console output only
    this.mailer = {
      sendMail: function(data, cb) {
        console.log("Not actually sending email:");
        console.log("  From: " + data.from);
        console.log("  To: " + data.to);
        console.log("  Subject: " + data.subject);
        console.log("  Content: \n" + (data.html || data.text));
        cb(null, null);
      }
    }
  }
  
  // send an email
  this.send = function(data, cb) {
    if(!data.subject || (!data.text && !data.html) || !data.to) {
      return cb("Attempting to send email with missing .subject, (.text or .html) or .to");
    }
    console.log("SENDING TO:", JSON.stringify(data.to, null, 2));

    var subject = (this.opts.subjectPrefix) ? this.opts.subjectPrefix + ' ' + data.subject : data.subject;
    this.mailer.sendMail({
      from: this.opts.from_address,
      to: data.to,
      subject: subject,
      text: data.text,
      html: data.html
    }, function(err, info) {
      if(err) return cb(err);
      return cb(null, info);
    });        
  };

  this.sendVerification = function(user, code, cb) {
    if(!user || !user.email || !code) {
      return cb("Cannot send email verification email: Missing user, user.email or verification code");
    }

    this.send({
      to: user.email,
      subject: "Verify your account",
      text: "Welcome to the bionet!\n\nTo verify your email please visit this URL: \n\n" + base_url+'/verify-email/'+code + "\n\n"
    }, function(err, info) {
      if(err) return cb(err);
      return cb(null, info);
    });
  };

  this.sendMaterialRequest = function(m, requestID, requesterEmail, physicalAddress, name, org, msg, cb) {
    if(!m || !m.name) {
      return cb("Cannot send email verification email: Missing material or material name");
    }

    // TODO validate and sanitize user input

    var txt = "You have received a request for materials from "+name+" <"+requesterEmail+"> from the lab/institute: "+org+"\n\n";
    txt += "The material request is for: "+m.name+"\n\n";
    txt += "Link to virtual: "+base_url+"/virtual/show/"+m.id+"\n\n";
    txt += "Link to request: "+base_url+"/request/"+requestID+"\n\n";
    txt += "Shipping address:\n\n"+physicalAddress+"\n\n";
    if(msg && msg.trim()) {
      txt += "The requester included the following message: \n\n"+msg+"\n\n";
    }

    this.send({
      to: opts.requestFulfillerEmail,
      subject: "Material request",
      text: txt
    }, function(err, info) {
      if(err) return cb(err);


      txt = "You have requested a biomaterial from the bionet\n\n";
      txt += "The requested biomaterial: "+m.name+"\n\n";
      txt += "Link to biomaterial info: "+base_url+"/virtual/show/"+m.id+"\n\n";
      txt += "You can use the following URL to check the status of your request: \n\n"
      txt += "  "+base_url+"/request/"+requestID+"\n\n";

      this.send({
        to: requesterEmail,
        subject: "[bionet] Biomaterial request confirmation",
        text: txt
      }, function(err, info) {

        return cb(null, info);
      });
    }.bind(this));
  };


  this.sendPasswordReset = function(user, code, cb) {
    if(!user || !user.email || !code) {
      return cb("Cannot send password reset email: Missing user, user.email or reset code");
    }
    
    this.send({
      to: user.email,
      subject: "Password reset request",
      text: "A password reset has been requested.\n\nTo reset your password please visit this link: \n\n" + base_url+'/password-complete-reset/'+code + "\n\n"
    }, function(err, info) {
      if(err) return cb(err);
      return cb();
    });
    
  };
  
};
