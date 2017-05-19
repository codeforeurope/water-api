/**
 * Legal limits
 * This is basically a set of observation from labels on the bottle
 */

(function() {
    var mongoose = require('mongoose');
    var ObjectId = mongoose.Schema.ObjectId;
    var Company = require('./Company.js').schema;
    var Observation = require('./Observation.js').schema; // We can use the Observation model for this
    var User = require('./User.js').schema;

    var Schema = new mongoose.Schema({
        name: String,
        authority: {type: ObjectId, ref: 'Company'}, //Company/Vendor that produces this bottled water
        limits: [{type: ObjectId, ref: 'Observation'}], //Array of water quality indicators from the bottle label
        sources: Array, //url references to sources for this information
        entered_at: {type: Date, required: true, default: Date}
    });
    exports.schema = Schema;
    exports.model = mongoose.model('Limit', Schema);
}());
