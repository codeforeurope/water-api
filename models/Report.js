/**
 * Report from a company regarding waterquality in a zone
 * This is basically a set of observation from labels on the bottle
 */

(function() {
    var mongoose = require('mongoose');
    var ObjectId = mongoose.Schema.ObjectId;
    var Authority = require('./Company.js').schema;
    var Observation = require('./Observation.js').schema;
    var Zone = require('./Zone.js').schema;
    var User = require('./User.js').schema;

    var Schema = new mongoose.Schema({
        authority: {type: ObjectId, ref: 'Authority'}, //Authority responsible for the report
        zone: {type: ObjectId, ref: 'Zone'}, //Zone for which the report is valid
        observations: [{type: ObjectId, ref: 'Observation'}], //Array of water quality indicators in the report
        entered_at: {type: Date, required: true, default: Date},
        entered_by: {type: ObjectId, ref: 'User', required: true}
    });
    exports.schema = Schema;
    exports.model = mongoose.model('Report', Schema);
}());