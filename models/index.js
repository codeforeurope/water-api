var fs = require('fs');
var mongoose = require('mongoose');
var env = process.env.NODE_ENV || 'development';
var config = require('../config/config.json')[env];
var db;

// Connect to mongo
if (config.use_env_variable) {
  db = mongoose.connect(process.env[config.use_env_variable]);
} else {
  db = mongoose.connect(config.db);
}

/**
 * initializes all models and sources them as .model-name
 **/
fs.readdirSync(__dirname).forEach(function(file) {
  if (file !== 'index.js') {
    var moduleName = file.split('.')[0];
    exports[moduleName] = require('./' + moduleName);
  }
});