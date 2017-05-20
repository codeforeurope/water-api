/**
 * Contains individual observations regarding water quality
 * Can also be from the label of bottled water (official producer values)
 *
 */

module.exports = function(mongoose) {
    var ObjectId = mongoose.Schema.ObjectId;

    var Schema = new mongoose.Schema({
        value: Number,
        uom: {type: ObjectId, ref: 'Uom'},
        code: {type: ObjectId, ref: 'Code'},
        entered_at: {type: Date, required: true, default: Date},
        entered_by: {type: ObjectId, ref: 'User', required: true}
    });

    return Schema;
};
