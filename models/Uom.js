/**
 * Taken from the WISE Code lists
 * http://www.eea.europa.eu/data-and-maps/data/waterbase-water-quality#tab-additional-information
 *
 * Code list FieldName: resultUom
 */

(function() {
    var mongoose = require('mongoose');
    var i18ngoose = require('i18ngoose');
    var User = require('./User.js').schema;

    var ObjectId = mongoose.Schema.ObjectId;
    var Schema = new mongoose.Schema({
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
    // Load plugin to schema and define languages 
    Schema.plugin(i18ngoose, {
        languages: ['de', 'en', 'nl', 'fr']
    });
    exports.schema = Schema;
    exports.model = mongoose.model('Uom', Schema);
}());
