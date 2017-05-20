/**
 * Taken from the WISE Code lists
 * http://www.eea.europa.eu/data-and-maps/data/waterbase-water-quality#tab-additional-information
 *
 * Code list FieldName: observedPropertyDeterminandCode
 */

module.exports = function(mongoose) {
    var ObjectId = mongoose.Schema.ObjectId;

    var Schema = new mongoose.Schema({
        standard: {
          type: String,
          enum: ['CAS', 'EC', 'ICSC', 'RTECS', 'UN', 'UNII', 'EEA'],
        },
        value: String,
        label: {
            type: String,
            i18n:true
        },
        definition: {
            type: String,
            i18n:true
        },
        entered_at: {type: Date, required: true, default: Date}
    });

    return Schema;
};
