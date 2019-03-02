const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {type: String, required: true},
  password: {type: String, required: true},
  email: {type: String, required: true},
  role: {type: String, enum: ['Admin', 'User', 'Guest', 'Banned'], default: 'Guest'},
  canView: {type: Boolean, default: false},
  downloaded: [{type: Schema.Types.ObjectId, ref: 'Book'}],
  uploaded: [{type: Schema.Types.ObjectId, ref: 'Book'}]
})

module.exports = mongoose.model('User', userSchema);