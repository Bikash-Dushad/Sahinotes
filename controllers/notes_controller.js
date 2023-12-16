const Note = require('../models/note');
const fs = require('fs');
const User = require('../models/user')

module.exports.uploadNotes = (req, res) => {       // This is controller. matlab jo kam karwana hai
   console.log(req.files);
   console.log(req.body);
   if(req.files){
    var file = req.files.note;
    var filename = file.name;
    var fileLocation = __dirname+"/../assets/uploads/"+req.body.userId+"/"+filename;
    console.log(fs.existsSync(fileLocation));
    if(fs.existsSync(fileLocation)){
        console.log("file already exists");
        return res.redirect('back');
    }else{
        file.mv(fileLocation, async function(err){
            if(err){
                console.log("Error in saving fie");
                return res.redirect('back');
            }else{
                console.log("File saved successfully");
               var newNote = await Note.create({
                    name:filename,
                    about: req.body.about,
                    fileLocation: fileLocation,
                    author: req.body.userId
                })
                var user = await User.findById(req.body.userId);
                await user.notesList.push(newNote.id)
                await user.save();
                return res.redirect('back');
            }
        })
    }
   
   }else{
   console.log('files was not uploaded properly!');
   return res.redirect('back');
}
}



module.exports.getAllNotes = function(req, res){    
    var user_id = req.query.user_id
}
