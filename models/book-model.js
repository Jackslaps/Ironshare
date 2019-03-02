const aws = require('aws-sdk')
const uuid = require('uuid');

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const fileSchema = new Schema({
  title: String,
  author: String,
  series: String,
  language: String,
  difficulty: {type: String, enum: ['Beginner', 'Intermediate', 'Expert']},
  description: {type: String, maxlength: 2000},
  review: {type: Schema.Types.ObjectId, ref: 'Review'},
  isCopyright: {type: Boolean, required: true, default: true}
})

module.exports = mongoose.model('File', fileSchema);


//