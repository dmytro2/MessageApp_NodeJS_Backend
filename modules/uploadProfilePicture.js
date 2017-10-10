
var Account = require('./models/user.js');
var AccountModel = Account.modelName;

var config = require('../config/index.js');



/**
 * upload user profile photo in user profile
 * Request form data: 
 * {
  files: {file: picture_file},
  body: {user_id: user_id}
  }
 * user_id, picture_file}
 * POST: /uploadProfilePicture
**/
exports.uploadProfilePicture = function(req, res) { 


  if(!req.files)
    res.json({message:'no files selected'});

  let user_id = req.body.user_id;
  let pic_file = req.files.picture_file;
  console.log('UserID: '+user_id); 

  let subPathProfilePicDir = '/public/images/profile_pictures/';
  let subUrlProfilePicDir = '/images/profile_pictures/';

  pic_file.mv( '.'+subPathProfilePicDir+user_id+'.jpg', 
  function(err){
    if(err) {
      console.log(err);
      res.json({message:'error: file upload failed'});
    } 
    else{
      AccountModel.update( {_id: user_id}, { profile_picture: config.serverUrl+subUrlProfilePicDir+user_id+'.jpg'},
      function(err,obj){

        if(err){
          console.log(err);
          res.json({message: "error", Status:"No user with id : " + user_id});
        }
        else{
          if(!obj.n){ // if the message to be updated is not in database
            res.json({message: "failed. no user updated!", Status:"No user with id : " + user_id});
          }
          else{ // if the message is updated
            console.log('!!!!!!!!!!!!SUCCESS!!!!!!!!!!');
            res.json({message: "success", items: obj});
          }
        }

      });
    }

  });

}
 