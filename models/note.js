const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const noteSchema = new Schema({
    name: { type: String, required: true },
    about: { type: String},
    fileLocation: { type: String, required: true},
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User'}
},
{
    timestamps: true
});

const User = mongoose.model('User', userSchema);

module.exports = User;