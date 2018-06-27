module.exports = function(mongoose) {
    var ObjectId = mongoose.Schema.ObjectId;
    var Schema = new mongoose.Schema({
      name: String,
      operator: {type: ObjectId, ref: 'Company'}, //The watercompany that services this zone
      alternatives: Array, //Alternative names for this zones or sub-zone names used to generate this zone.
      entered_at: {type: Date, required: true, default: Date},
      entered_by: {type: ObjectId, ref: 'User', required: true},
      geometry: {
        type : {
          type: String,
          default: "Polygon"
        },
        coordinates : Array
      }
    });

    Schema.index({geometry : '2dsphere'});
    return Schema;
};
