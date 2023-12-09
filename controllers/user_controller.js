const nodemailer = require("nodemailer");

module.exports.profilePage = (req, res) => {       // This is controller. matlab jo kam karwana hai
    return res.render('profile');
}

module.exports.sendemail = function(req, res){
}

module.exports.forgotPassword = function(req, res) {
    return res.render('forgot_password');
}