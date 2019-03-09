const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  //name: {type: String, required: true},
  password: String,
  email: {type: String, required: true},
  role: {type: String, enum: ['admin', 'user', 'guest'], default: 'guest'},
  canView: {type: Boolean, default: false},
  downloaded: [{type: Schema.Types.ObjectId, ref: 'File'}],
  uploaded: [{type: Schema.Types.ObjectId, ref: 'File'}],
  relation: String
})

module.exports = mongoose.model('User', userSchema);