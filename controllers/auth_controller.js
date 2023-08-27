const User = require('../models/user');

module.exports.signupController = (req, res)=>{
    return res.render('signup');
}

function hasNumber(str){
    let string1 = String(str);
    for(let i in string1){
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
            return res.redirect('/user/profile');
        }else{
            // alert that password doesnot matched
            console.log("password doesnot match");
            return res.redirect('back');
        }
    }else{
        console.log("email doesnot exist");
        return res.redirect('/auth/signup');
    }
}
