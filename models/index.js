var fs = require('fs');
var mongoose = require('mongoose');
var i18ngoose = require('mongoose-i18n-localize');

var env = process.env.NODE_ENV || 'development';
var config = require('../config/config.json')[env];
var db;

mongoose.Promise = require('bluebird');

// Connect to mongodb
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
    var temp = require('./' + moduleName)(mongoose);

    // Attach i18n plugin to all models
    temp.plugin(i18ngoose, {
        locales: ['de', 'en', 'nl', 'fr']
    });

    exports[moduleName] = {
      schema: temp,
      model: mongoose.model(moduleName, temp)
    };
  }
});
