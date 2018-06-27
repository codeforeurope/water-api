module.exports = function(mongoose) {
    var ObjectId = mongoose.Schema.ObjectId;
    var Schema = new mongoose.Schema({
        code: {
            type: String,
            required: true,
            index: {unique: true}
        },
        name: {
            type: String,
            required: true
        },
        url: String,
        country: String,
        type: {
          type: String,
          enum: ['Access', 'Provider', 'Infrastructure', 'Vendor', 'Unknown', 'Government', 'Quality'],
          default: 'Unknown',
          required: true
        },
        entered_at: {type: Date, required: true, default: Date},
        entered_by: {type: ObjectId, ref: 'User', required: true}
    });
    return Schema;
};
