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



module.exports.getAllNotes = async function(req, res){    
   try{
    var user_id = req.query.user_id;
    var user = await User.findById(user_id);
    var allNotes = [];
    for(var i=0; i<user.notesList.length; i++){
        var noteReturn = {};
        var noteId = user.notesList[i];
        var note = await Note.findById(noteId);
        noteReturn.name = note.name;
        noteReturn.about = note.about;
        noteReturn.fileLocation = note.fileLocation;
        allNotes.push(note);
    }
    return res.status(200).send({success: true, data: allNotes});
}catch(err){
    return res.status(500).send({success: false, data: "some error happened"})
}
}

module.exports.likeNote = async function(req, res){
    var userId = req.query.userId;
    var noteId = req.query.noteId;
    var user = await User.findById(userId);
    var note = await Note.findById(noteId);

    if(note.likedUsers.includes(userId)){
        note.likedUsers.filter(function(x){
            return x!= userId;
        });
        await note.save();
        user.likedUsers.filter(function(x){
            return x!= noteId;
        });
        await user.save();
        return res.status(200).send({success: true, data: "Disliked"});
    }else{
        note.likedUsers.push(userId);
        user.likedNotes.push(noteId);
        await note.save();
        await user.save();
        return res.status(200).send({success: true, data: "liked"});
    }
}
