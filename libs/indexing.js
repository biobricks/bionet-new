
var async = require('async');
var sublevel = require('subleveldown');
var treeIndex = require('level-tree-index');
var ElasticIndex = require('level-elasticsearch-index');
var blastLevel = require('blast-level');

module.exports = function(settings, db) {

  var inventoryTree = treeIndex(db.physical, sublevel(db.index, 't'), {
    parentProp: 'parent_id'
  });

  var elasticIndex = ElasticIndex(db.bio, {});

  elasticIndex.add('name', function(key, val) {
    val = JSON.parse(val); // TODO this should not be needed

    var o = {
      id: val.id,
      name: val.name
    };

    return o;
  });

  elasticIndex.ping(function(err) {
    if(err) return console.error("Warning: Could not connect to ElasticSearch server. Proceeding without ElasticSearch indexing.\n", err);
    elasticIndex.rebuildAll(function(err) {
      if(err) return console.error("elastic index rebuild error:", err);
      console.log("Finished elastic index rebuild");
    });
  })


  var blastIndex = blastLevel(db.virtual, {
    mode: settings.blast.mode,
    binPath: settings.blast.binPath,
    path: settings.blast.path,
    seqProp: 'sequence', // key in 'mydb' that stores the sequence data
    seqIsFile: false,
    seqFormatted: false,
    changeProp: 'updated.time',
    listen: true, // listen for changes on level db and auto update BLAST db
    debug: true
  });

  blastIndex.on('error', function(err) {
    console.error("blast-level error:", err);
  });

  // TODO disable this (this causes a rebuild on each startup)
  blastIndex.rebuild();

  function rebuild() {
    // TODO rebuild elasticSearch index as well

    inventoryTree.rebuild(function(err) {
      if(err) return console.error("inventory tree rebuild error:", err);
      console.log("Finished inventory tree rebuild");
    });
    
//    blastIndex.rebuild();
  }

  return {
    inventoryTree: inventoryTree,
    elastic: elasticIndex,
    rebuild: rebuild,
    blast: blastIndex
  };

}


