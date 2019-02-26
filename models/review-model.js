const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
  user: {type: Schema.Types.ObjectId, ref: 'User'},
  comment: {type: String, maxlength: 500}
})

module.exports = mongoose.model('Review', reviewSchema);