const mongoose = require('mongoose')
const Schema = mongoose.Schema

const fileSchema = new Schema({
  title: String,
  author: String,
  series: String,
  language: String,
  description: {type: String, maxlength: 2000},
  review: {type: Schema.Types.ObjectId, ref: 'Review'},
  isCopyright: {type: Boolean, required: true, default: true},
  downloadLink: String,
  filename: String
})

module.exports = mongoose.model('File', fileSchema);