/**
 * Taken from the WISE Code lists
 * http://www.eea.europa.eu/data-and-maps/data/waterbase-water-quality#tab-additional-information
 *
 * Code list FieldName: CountryCode
 */

module.exports = function(mongoose) {
    var ObjectId = mongoose.Schema.ObjectId;

    var Schema = new mongoose.Schema({
        value: String,
        label: String,
        definition: String,
        entered_at: {type: Date, required: true, default: Date},
        entered_by: {type: ObjectId, ref: 'User', required: true}
    });

    return Schema;
};
