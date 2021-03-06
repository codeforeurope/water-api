module.exports = function(mongoose) {
    /**
     * Bottled water product
     * This is basically a set of observation from labels on the bottle
     */
    var ObjectId = mongoose.Schema.ObjectId;
    var Schema = new mongoose.Schema({
        code: {type: String, required: true},
        name: {type: String, required: true},
        vendor: {type: ObjectId, ref: 'Company'}, //Company/Vendor that produces this bottled water
        observations: [{type: ObjectId, ref: 'Observation'}], //Array of water quality indicators from the bottle label
        volume: Number, //The content volume in liters of the bottle
        sources: Array, //url references to sources for this information
        entered_at: {type: Date, required: true, default: Date},
        entered_by: {type: ObjectId, ref: 'User', required: true}
    });
    return Schema;
};
