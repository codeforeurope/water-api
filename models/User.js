(function() {
    var mongoose = require('mongoose');

    var Schema = new mongoose.Schema({
        name: String,
        email: String,
        token: String,
        entered_at: {type: Date, required: true, default: Date}
    });
    exports.schema = Schema;
    exports.model = mongoose.model('User', Schema);
}());