
var fs = require('fs');
var retricon = require('retricon-without-canvas');

module.exports = function(labName, filePath) {
  
  fs.stat(filePath, function(err, stats) {
    if(!err);

    var out = fs.createWriteStream(filePath, {encoding: 'binary'});

    retricon(labName, {
        pixelSize: 16,
        bgColor: null
    }).pngStream().pipe(out);
    
  });

};
