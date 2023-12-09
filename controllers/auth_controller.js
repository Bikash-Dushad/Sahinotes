const User = require('../models/user');
const FAST2SMS_KEY = "bh45nmQSfGAWiX8Nv6ZJHRkpFD0tE37qTPsVCzMlgY2BIdyex9mSQfCvGbs6U9pEXKiY4Rq0BjzWd2oZ";
var unirest = require('unirest');
const querystring = require('querystring');
const helperFunctions = require('../helper_function');

module.exports.signupController = (req, res)=>{
    return res.render('signup');
}

function hasNumber(str){
    let string1 = String(str);
    for(let i in  string1){
        if(!isNaN(string1.charAt(i)) && !(string1.charAt(i)=="")){
            return true;
        }
    }
    return false;
}

function checkPasswordStrength(password){
    if(password.length<3){
        return {"success": false, "message":"password is too small"};
    }
    else if(password.length>15 ){
        return {"success": false, "message":"password is too big"};
    }
    else if(hasNumber(password)==false){
        return {"success": false, "message": "password should contain atleast a digit"};
    }else{
        return {"success": true, "message": ""};
    }
}

module.exports.signup = async (req, res)=>{
    console.log(req.body);
    var name = req.body.name;
    var email = req.body.email;
    var password = req.body.password;
    var confirm_password = req.body.confirm_password;
    // password and confirm password atre not same
    try{
        if(password!=confirm_password){
            // allert user that pasword doesnot match
       console.log("password doesnot matched");
       return res.redirect('back');
   }
   else{
       if(checkPasswordStrength(password).success){
           //add users data to the database
         var user = await User.findOne({email: email});
         if(user){
           //alert user that his email id already exists
           console.log("Email id already exists");
           return res.redirect('/auth/signin');
         }else{
           var user = await User.create({name: name, email: email, password:password});
           console.log(user);
           return res.redirect('/auth/signin');
         }
       }else{
           //alert user regarding the password
           console.log(checkPasswordStrength(password).message);
       }
    }
}catch(err){
    console.log(err);
    return res.redirect('back');
}
    return res.redirect('back');
}


module.exports.signinpage = function(req, res){
    return res.render('signin');
}

module.exports.signin = async function(req, res){
    var email = req.body.email;
    var password = req.body.password;
    var user = await User.findOne({email: email});
    if(user){
        console.log(user);
        if(user.password === password){
            // const query = querystring.stringify({
            //     ,
            // });
            var currentDate = new Date();
            var expiryDate = currentDate.setHours(currentDate.getHours() + 24);
            user.expiryDate = expiryDate;
            await user.save();
            return res.redirect("/user/profile/"+user.id)
        }else{
            // alert that password doesnot matched
            console.log("password doesnot match");
            return res.redirect('back');
        }
    }else{
        //alert user that email doesnot exist . plz create
        console.log("email doesnot exist");
        return res.redirect('/auth/signup');
    }
}


module.exports.verifyMobile = async function(req, res){
    var id = req.query.user_id;
    var isExpired = await helperFunctions.isExpired(id);
    if(helperFunctions.isExpired(id)==true){
        return res.redirect('/auth/signup')
    }
    return res.render('verify_mobile');
}


module.exports.sendOtp = async function(req, res){
    var mobile = req.body.mobileNumber;
    console.log(mobile);
var id = req.body.user_id;
// var id = req.params.user_id;
var user = await User.findById(id);
user.mobile_verified = false;
var req = unirest("GET", "https://www.fast2sms.com/dev/bulkV2");
var OTP = Math.floor(Math.random() * 9000 + 1000);
console.log(OTP);
req.query({
  "authorization": FAST2SMS_KEY,
  "variables_values": OTP,
  "route": "otp",
  "numbers": mobile
});
req.headers({
  "cache-control": "no-cache"
});
req.end(async function (res) {
     if (res.error) throw new Error(res.error)
     console.log(res.body);
     //save the otp to database for 30 sec and removes it
     user.mobile_otp = OTP;
     user.mobile = mobile;
     await user.save();
     setTimeout(async function(){
        var updated_user = await User.findOne({mobile: user.mobile});
        updated_user.mobile_otp = undefined;
        if(updated_user.mobile_verified == false){
            updated_user.mobile = undefined;
        }
        await updated_user.save();
     }, 30 * 1000);
});
}

module.exports.verifyOtp = async function(req, res){
   var OTP = req.body.otp;
   var id = req.body.user_id;
    var user = await User.findById(id);
    if(user.mobile_otp && OTP == user.mobile_otp){
       user.mobile_verified = true;
       await user.save();
        console.log("mobile is verified");
    }else{
        user.mobile = undefined;
        await user.save();
        return res.redirect('back');
    }
}

module.exports.logout = async function(req, res){
    var id = req.query.user_id;
    var user = await User.findById(id);
    if(user){
        user.expiryDate = undefined;
        await user.save();
        return res.redirect("/auth/signin");
    }else{
        console.log("error in finding user");
        return;
    }
}


module.exports.sendForgotPasswordEmail = async function(req, res) {
    var email = req.query.email;
    console.log(email);
    var user = await User.findOne({email: email});
    if (user) {
        var emailBody = `<h1>Click on the link to reset password</h1> <a href="http://localhost:3000/auth/reset-password/?user_id=${user.id}">Reset password</a>`
        await helperFunctions.sendemail(user, emailBody);
        user.passwordEditInitiation = new Date();
        await user.save();
    } else {
        console.log("Email does not exist so you cannot reset password");
        // notify this to the user
        return res.redirect("back");
    }
}


module.exports.resetPassword = async function(req, res){
    var userId = req.query.user_id;
    var user = await User.findById(userId);
    if(user){
    return res.render("reset_password", {
        userId: userId
    });
}else{
    console.log("userId might be tempered");
    return res.redirect("/auth/signin");
}
}

module.exports.changePassword =async function(req, res){
    var userId = req.query.userId;
    var password = req.body.password;
    var confirmPassword = req.body.confirm_password;
    var user = await User.findById(userId);
    if(user){
        var currentDate = new Date();
        var initiationDate = user.passwordEditInitiation;
        var difference = currentDate.getMinutes() - initiationDate.getMinutes();
        if(password==confirmPassword && difference<=2){
            user.password = password;
            await user. save();
            return res.redirect("/auth/signin");
        }
    }else{
        console.log("user doesnot exist");
        return res.redirect("back");
    }
}