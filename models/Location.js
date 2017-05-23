module.exports = function(mongoose) {
    var ObjectId = mongoose.Schema.ObjectId;

    var Schema = new mongoose.Schema({
        operator: {type: ObjectId, ref: 'Operator'},
        name: String,
        geometry: {
          type : {
            type: String,
            default: "Point"
          },
          coordinates : Array
        },
        type: {
          type: String,
          enum: ['Tap', 'Pump', 'Facility', 'Measurement'],
        },
        access: {
          type: String,
          enum: ['Free', 'Commercial', 'Restricted'],
        },
        entered_at: {type: Date, required: true, default: Date},
        entered_by: {type: ObjectId, ref: 'User', required: true}
    });
    return Schema;
};
