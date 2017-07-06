/**
 * Contains individual observations regarding water quality
 * Can also be from the label of bottled water (official producer values)
 *
 */

module.exports = function(mongoose) {
    var ObjectId = mongoose.Schema.ObjectId;

    var Schema = new mongoose.Schema({
        value: Number,
        min: Number,
        max: Number,
        samples: Number,
        uom: {type: ObjectId, ref: 'Uom', required: true},
        code: {type: ObjectId, ref: 'Code', required: true},
        type: {
          type: String,
          enum: ['Report', 'Norm', 'Location', 'Zone', 'Unknown', 'Label'],
          default: 'Unknown',
          required: true
        },
        entered_at: {type: Date, required: true, default: Date},
        entered_by: {type: ObjectId, ref: 'User', required: true}
    });

    return Schema;
};
