/**
 * Bottled water product
 * This is basically a set of observation from labels on the bottle
 */

(function() {
    var mongoose = require('mongoose');
    var ObjectId = mongoose.Schema.ObjectId;
    var Vendor = require('./Company.js').schema;
    var Observation = require('./Observation.js').schema;
    var User = require('./User.js').schema;

    var Schema = new mongoose.Schema({
        vendor: {type: ObjectId, ref: 'Vendor'}, //Company/Vendor that produces this bottled water
        observations: [{type: ObjectId, ref: 'Observation'}], //Array of water quality indicators from the bottle label
        volume: Number, //The content volume in liters of the bottle
        sources: Array, //url references to sources for this information
        entered_at: {type: Date, required: true, default: Date},
        entered_by: {type: ObjectId, ref: 'User', required: true}
    });
    exports.schema = Schema;
    exports.model = mongoose.model('Product', Schema);
}());
