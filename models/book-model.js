const aws = require('aws-sdk')
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const bookSchema = new Schema({
  title: String,
  author: String,
  series: String,
  language: String,
  difficulty: {type: String, enum: ['Beginner', 'Intermediate', 'Expert']},
  description: {type: String, maxlength: 2000},
  review: {type: Schema.Types.ObjectId, ref: 'Review'}
})

module.exports = mongoose.model('Book', bookSchema);


//