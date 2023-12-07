var User = require("./models/user");
var nodemailer = require('nodemailer');
module.exports.isExpired = async function(id){
    var user = User.findById(id);
    var currentDate = new Date();
    var expiryDate = user.expiryDate;
    if(expiryDate && currentDate < expiryDate){
        return false;
    }else{
        return true;
    }
}

module.exports.sendemail = async function(user,content){
  console.log(user)
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: "bikashghll@gmail.com",
        pass: "ur-app-password",
      },
    });
    async function main() {
      const info = await transporter.sendMail({
        from: '"Fred Foo 👻" <bikashghll@gmail.com>', 
        to: user.email, 
        subject: "Hello ✔", 
        text: "Hello world?", 
        html: content, 
      });
      console.log("Message sent: %s", info.messageId);
    }
    main().catch(console.error);
    }