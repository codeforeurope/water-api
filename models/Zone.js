module.exports = function(mongoose) {
    var ObjectId = mongoose.Schema.ObjectId;

    var Schema = new mongoose.Schema({
      name: String,
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
