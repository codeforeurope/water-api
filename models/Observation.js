/**
 * Contains individual observations regarding water quality
 * Can also be from the label of bottled water (official producer values)
 *
 */

(function() {
    var mongoose = require('mongoose');
    var ObjectId = mongoose.Schema.ObjectId;
    var Uom = require('./Uom.js').schema;
    var Code = require('./Code.js').schema;
    var User = require('./User.js').schema;

    var Schema = new mongoose.Schema({
        value: Number,
        uom: {type: ObjectId, ref: 'Uom'},
        code: {type: ObjectId, ref: 'Code'},
        entered_at: {type: Date, required: true, default: Date},
        entered_by: {type: ObjectId, ref: 'User', required: true}
    });
    exports.schema = Schema;
    exports.model = mongoose.model('Observation', Schema);
}());
