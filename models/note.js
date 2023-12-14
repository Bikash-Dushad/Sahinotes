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

const Note = mongoose.model('Note', noteSchema);

module.exports = Note;