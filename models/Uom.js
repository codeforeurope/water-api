/**
 * Taken from the WISE Code lists
 * http://www.eea.europa.eu/data-and-maps/data/waterbase-water-quality#tab-additional-information
 *
 * Code list FieldName: resultUom
 */

module.exports = function(mongoose) {
    var ObjectId = mongoose.Schema.ObjectId;

    var Schema = new mongoose.Schema({
        code: {type: String, unique: true},
        value: {
            type: String,
            i18n:true
        },
        label: {
            type: String,
            i18n:true
        },
        definition: {
            type: String,
            i18n:true
        },
        entered_at: {type: Date, required: true, default: Date},
        entered_by: {type: ObjectId, ref: 'User', required: true}
    });

    return Schema;
};
