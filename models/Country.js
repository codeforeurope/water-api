module.exports = function(mongoose) {
    var ObjectId = mongoose.Schema.ObjectId;
    var Schema = new mongoose.Schema({
        value: String,
        label: String,
        definition: String,
        entered_at: {type: Date, required: true, default: Date},
        entered_by: {type: ObjectId, ref: 'User', required: true}
    });
    return Schema;
};
