/**
 * Taken from the WISE Code lists
 * http://www.eea.europa.eu/data-and-maps/data/waterbase-water-quality#tab-additional-information
 *
 * Code list FieldName: observedPropertyDeterminandCode
 */

module.exports = function(mongoose) {
    var ObjectId = mongoose.Schema.ObjectId;

    var Schema = new mongoose.Schema({
        code: {
          type: String,
          unique: true
        },
        standard: {
          type: String,
          enum: ['CAS', 'EC', 'ICSC', 'RTECS', 'UN', 'UNII', 'EEA', 'NA'],
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
    Schema.index({standard: 1, value:1},{unique: true});
    return Schema;
};
