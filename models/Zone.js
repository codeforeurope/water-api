(function() {
    var mongoose = require('mongoose');
    var User = require('./User.js').schema;
    var ObjectId = mongoose.Schema.ObjectId;
    var Schema = new mongoose.Schema({
        name: String,
        entered_at: {type: Date, required: true, default: Date},
        entered_by: {type: ObjectId, ref: 'User', required: true}
    });
    exports.schema = Schema;
    exports.model = mongoose.model('Zone', Schema);
}());