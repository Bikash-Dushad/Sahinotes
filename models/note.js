const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const noteSchema = new Schema({
    name: { type: String, required: true },
    about: { type: String},
    fileLocation: { type: String, required: true},
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    likedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user'}]
},
{
    timestamps: true
});

const Note = mongoose.model('Note', noteSchema);

module.exports = Note;