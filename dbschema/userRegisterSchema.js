const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
  userName: { type: 'String', required: true, },
  password: { type: 'String', required: true },
  email: { type: 'String', required: true, unique: true }
}, { collection: 'users' });
module.exports = mongoose.model('UserSchema', UserSchema)
