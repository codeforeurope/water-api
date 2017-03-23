/**
 * Taken from the WISE Code lists
 * http://www.eea.europa.eu/data-and-maps/data/waterbase-water-quality#tab-additional-information
 *
 * Code list FieldName: resultUom
 */
(function () {
  var mongoose = require('mongoose')
  var Schema = mongoose.Schema
  var ObjectId = Schema.ObjectId
  var schema = new Schema({
    id: ObjectId,
    value: String,
    label: String,
    definition: String,
    entered_at: {type: Date, required: true, default: Date}
  })
  schema.pre('init', function (next) {
    console.log('construct UOM')
    next()
  })
  exports.schema = schema
  exports.model = mongoose.model('Uom', schema)
}())
