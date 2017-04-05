(function () {
  var mongoose = require('mongoose')
  var ObjectId = mongoose.Schema.ObjectId
  var Operator = require('./Company.js').schema
  var User = require('./User.js').schema

  var Schema = new mongoose.Schema({
    operator: {type: ObjectId, ref: 'Operator'},
    name: String,
    location: {type: [Number], index: '2d'},
    type: {
      type: String,
      enum: ['Tap', 'Pump']
    },
    access: {
      type: String,
      enum: ['Free', 'Commercial']
    },
    entered_at: {type: Date, required: true, default: Date},
    entered_by: {type: ObjectId, ref: 'User', required: true}
  })
  exports.schema = Schema
  exports.model = mongoose.model('Tap', Schema)
}())
