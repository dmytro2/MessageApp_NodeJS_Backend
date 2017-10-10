'use strict'

var express   = require('express');
var ObjectId  = require('mongodb').ObjectID;
//var session   = require('express-session');
// var randtoken = require('rand-token');
const bcrypt  = require('bcrypt');
// var _session;

var Account = require('./models/user.js');
var AccountModel = Account.modelName;

var Message = require('./models/message.js');
var MessageModel = Message.modelName;

var fs = require('fs')

var config = require('../config/index.js');

/**
 * Creates new user
 * Created Date: 08/22/2017 7:11 PM
 * 
 * Endpoint: handle/register
 * Method: POST 
 * Request body: {user:{email,password,name}}
**/
exports.register = function(req, res) {
  //console.log(req.body);

  var email = req.body.user.email;
  var password = req.body.user.password;
  var name = req.body.user.name;
  
  checkEmailExists(email, function(result) {
    if(result.status == 'error') {
      res.json({success: false, result: {error_msg: "Sorry, failed to find the email"}});
      return;
    }
    else if(result.status == 'existing') {
      res.json({success: false, result: {error_msg: "Sorry, Email already taken"}});
      return;
    }  

    var accountId = uniqid();

    console.log('Password Will be Encrypted!!!');

    var salt = bcrypt.genSaltSync();
    var password_hash = bcrypt.hashSync(password, salt);
    // var password_hash = 
    console.log('Password was Encrypted!!!'+password_hash);

    var data = {
      id:  accountId,
      name:       name,
      email:      email,
      password:   password_hash,
      push_notification: true,
      profile_picture: '',
    };


    var newAccount = new AccountModel(data);
    newAccount.save(function(err, response) {
      if(err) {
        res.json({success: false, result: {error_msg: 'Could not create account. Please contact support at dev@amsg.co'}});
      }
      else if(!response) {
        res.json({success: false, result: {error_msg: 'Problem creating your account. Please contact support at dev@amsg.co'}});
      }
      else {
        var user_data_in_response = response;
        var user_id = user_data_in_response._id;
        user_data_in_response.password = password;

        var subUrlProfilePicDir = '/images/profile_pictures/';
        var subPathProfilePicDir = '/public/images/profile_pictures/';

        AccountModel.update( {_id: user_id}, { profile_picture: config.serverUrl+subUrlProfilePicDir+user_id+'.jpg'},
          function(err,obj){
            if(err){
              console.log(err);
              res.json({success: false, result: {error_msg: 'Could not create account. Please contact support at dev@amsg.co'}});
            }
            else{
              if(!obj.n){ // if the user to be updated is not in database
                res.json({success: false, result: {error_msg: 'Could not create account. Please contact support at dev@amsg.co'}});
              }
              else{ // if the user is updated   
                let srcFile = '.'+subPathProfilePicDir+'user_default.png';
                let destFile = '.'+subPathProfilePicDir+user_id+'.jpg';
                fs.createReadStream(srcFile).pipe(fs.createWriteStream(destFile));

                user_data_in_response.profile_picture = config.serverUrl+subUrlProfilePicDir+user_id+'.jpg';

                res.json({success: true, result: true, data: user_data_in_response});
              }
            }

          });
      }
      return;
    });
  });
}


/**
 * User login
 * Created Date: 08/20/2017 2:31 AM
 * 
 * Endpoint: handle/login
 * Method: POST 
 * Request body: {user:{email,password}}
**/
exports.login = function(req, res) {
  //console.log(req.body);

  var email = req.body.user.email;
  var password = req.body.user.password;
  
  checkEmailExists(email, function(result) {
    if(result.status == 'error') {
      res.json({success: false, result: {error_msg: "Sorry, failed to find the email"}});
      return;
    }
    else if(result.status == 'not_exist') {
      res.json({success: false, result: {error_msg: "User does not exist"}});
      return;
    }

    var password_hash = result.existing_account.password;
    console.log('Password Encrypted:'+password_hash);
    var password_verify = bcrypt.compareSync(password, password_hash);

    var user_data_in_response = result.existing_account;
    user_data_in_response.password = password;

    if(password_verify) {

      var accountId = result.existing_account._id;
           
      // console.log('USERID: '+accountId);
  
      MessageModel.find( { user_id_to: { $all: accountId } } )
        .exec(function(err, docs) {
        if(err) {
          console.log(err);
          res.json({message: "error", Status:"Error while finding message"});
          return;
        }
        res.json({success: true,  user:user_data_in_response, message: docs});
      })
    }
    else {
      res.json({success: false, result: {error_msg: "Wrong password"}});
    }
    return;
  });
}




/**
 * User logout
 * Created Date: 08/20/2017 12:56 AM
 * 
 * Endpoint: handle/auth/logout
 * Method: POST 
**/
exports.logout = function(req, res) {
  console.log(req.session);
  if(req.session) {
    req.session.destroy();
    res.json({success: true, result: true});
  }
  else {
    res.json({success: false, result: {error_msg: "session doesn't exist."}});
  }
}


function checkEmailExists(email, callback) {
  AccountModel.findOne({email: email}).exec(function(err, account) {
    if(err) {
      callback({status: 'error'});
      return;
    }
    //console.log('account>>>', account);
    if(account) {
      callback({status: 'existing', existing_account: account});
      return;
    }
    callback({status: 'not_exist'});
  });
}





var uniqid = function (pr, en) {
  var pr = pr || '', en = en || false, result;

  var seed = function (s, w) {
    s = parseInt(s, 10).toString(16);
    return w < s.length ? s.slice(s.length - w) : (w > s.length) ? new Array(1 + (w - s.length)).join('0') + s : s;
  };

  result = pr + seed(parseInt(new Date().getTime() / 1000, 10), 8) + seed(Math.floor(Math.random() * 0x75bcd15) + 1, 5);

  if (en) result += (Math.random() * 10).toFixed(8).toString();

  return result;
};