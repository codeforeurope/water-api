/**
 * Report from a company regarding waterquality in a zone
 * This is basically a set of observation from labels on the bottle
 */

module.exports = function(mongoose) {
    var ObjectId = mongoose.Schema.ObjectId;

    var Schema = new mongoose.Schema({
        name: {type: String, required: true},
        description: String,
        year: {type: Date, required: true, default: Date},
        authority: {type: ObjectId, ref: 'Company'},//Authority responsible for the report
        zones: [{type: ObjectId, ref: 'Zone'}], //Zone for which the report is valid
        observations: [{type: ObjectId, ref: 'Observation'}], //Array of water quality indicators in the report
        sources: Array, //url references to sources for this information
        entered_at: {type: Date, required: true, default: Date},
        entered_by: {type: ObjectId, ref: 'User', required: true}
    });
    return Schema;
};
