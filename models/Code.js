/**
 * Taken from the WISE Code lists
 * http://www.eea.europa.eu/data-and-maps/data/waterbase-water-quality#tab-additional-information
 *
 * Code list FieldName: observedPropertyDeterminandCode
 */

(function() {
    var mongoose = require('mongoose');
    var i18ngoose = require('i18ngoose');
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
    // Load plugin to schema and define languages 
    Schema.plugin(i18ngoose, {
        languages: ['de', 'en', 'nl', 'fr']
    });
    exports.schema = Schema;
    exports.model = mongoose.model('Code', Schema);
}());
