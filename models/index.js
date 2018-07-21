var fs = require('fs');
var mongoose = require('mongoose');
var i18ngoose = require('mongoose-i18n-localize');
mongoose.Promise = require('bluebird');

var env = process.env.NODE_ENV || 'development';
var config = require('../config/config.json')[env];

// Connect to mongodb
mongoose.connect(config.db, { useNewUrlParser: true }).then(
  () => {
    /**
     * initializes all models and sources them as .model-name
     **/
    fs.readdirSync(__dirname).forEach(function(file) {
      if (file !== 'index.js') {
        var moduleName = file.split('.')[0];
        var temp = require('./' + moduleName)(mongoose);

        // Attach i18n plugin to all models
        temp.plugin(i18ngoose, {
            locales: config.locales
        });

        exports[moduleName] = {
          schema: temp,
          model: mongoose.model(moduleName, temp)
        };
      }
    });
  },
  err => {
    console.log("Mongoose error:" + err.message);
    return done();
  }
);
