const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, minLength: 3, maxLength: 20},
    mobile: { type: String},
    email_otp: { type: String},
    mobile_otp: { type: String},   
},
{
    timestamps: true
});

const User = mongoose.model('User', userSchema);

module.exports = User;