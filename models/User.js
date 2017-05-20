module.exports = function(mongoose) {
    var Schema = new mongoose.Schema({
        name: String,
        email: String,
        token: String,
        entered_at: {type: Date, required: true, default: Date}
    });
    return Schema;
};