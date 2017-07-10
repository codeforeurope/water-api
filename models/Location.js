module.exports = function(mongoose) {
    var ObjectId = mongoose.Schema.ObjectId;

    var Schema = new mongoose.Schema({
        operator: {type: ObjectId, ref: 'Operator'},
        operator_id: String,
        name: String,
        description: String,
        geometry: {
          type : {
            type: String,
            default: "Point"
          },
          coordinates : Array
        },
        type: {
          type: String,
          enum: ['Tap', 'Pump', 'Restaurant', 'Facility', 'Measurement','Plant','Unknown'],
          default: 'Unknown',
          required: true
        },
        access: {
          type: String,
          enum: ['Free', 'Commercial', 'Restricted','Unknown'],
          default: 'Unknown',
          required: true
        },
        entered_at: {type: Date, required: true, default: Date},
        entered_by: {type: ObjectId, ref: 'User', required: true}
    });
    Schema.index({geometry : '2dsphere'});
    return Schema;
};
