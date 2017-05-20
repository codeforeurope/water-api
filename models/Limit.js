/**
 * Legal limits
 * This is basically a set of observation from labels on the bottle
 */

module.exports = function(mongoose) {
    var ObjectId = mongoose.Schema.ObjectId;

    var Schema = new mongoose.Schema({
        name: String,
        authority: {type: ObjectId, ref: 'Company'}, //Company/Vendor that produces this bottled water
        limits: [{type: ObjectId, ref: 'Observation'}], //Array of water quality indicators from the bottle label
        sources: Array, //url references to sources for this information
        entered_at: {type: Date, required: true, default: Date}
    });

    return Schema;
};
