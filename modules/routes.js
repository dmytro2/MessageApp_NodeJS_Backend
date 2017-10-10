'use strict'

var mongoose   = require('mongoose');
var config = require('../config/index');
var _session;

mongoose.connect(config.mongodbUrl);
var db = mongoose.connection;
db.on('error', function(err){
  console.log('DB connection failed with error:', err);
});
db.once('open', function(){
  console.log('Connected to AMsgDB on Localhost.');
});

var usersCtrl = require('./users.js');
var messageCtrl = require('./message.js');
var feedsCtrl = require('./feeds.js');
var getMessageSentCtrl = require('./getMessageSent.js');
var setMessageFavouriteCtrl = require('./setMessageFavourite.js');
var getMessageFavouriteCtrl = require('./getMessageFavourite.js');
var deleteMessageCtrl = require('./deleteMessage.js');
var getUniqueLinkCtrl = require('./getUniqueLink.js');
var setPushNotificationCtrl = require('./setPushNotification.js');
var updateUserProfileCtrl = require('./updateUserProfile.js');
var uploadProfilePictureCtrl = require('./uploadProfilePicture.js');
module.exports = function(router) {
  // middleware to use for all requests
  router.use(function(req, res, next) {
    // do logging
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

  //handle test
  router.get('/handle', function(req, res) {
    res.json({message: 'Hello AMsg Node!'});
  });
  //get
  router.get('/', function(req, res) {
    _session = req.session;
    console.log('_session>>>', _session);
    if(_session.accountId) {
      res.json({message: 'accountId: '+_session.accountId+' & authToken: '+_session.authToken});
      return;
    }
    res.json({message: 'Please login first!'});
  });
  //post
  router.post('/', function(req, res) {
    _session = req.session;
    _session.accountId = 'account 2';
    _session.authToken = 'authToken 2';
    res.end(req.session.id);
  });
  //handle/register
  router.route('/handle/register')
    .post(usersCtrl.register);
  router.route('/handle/login')
    .post(usersCtrl.login);
  router.route('/handle/auth/logout')
    .post(usersCtrl.logout);



  //Message Endpoints
  router.route('/feed/:user_id_to')
    .get(feedsCtrl.getFeeds); // get message received 
  router.route('/getMessageSent/:user_id_from')
    .get(getMessageSentCtrl.getMessageSent); // get message sent 
  router.route('/getMessageFavourite/:user_id_to')
    .get(getMessageFavouriteCtrl.getMessageFavourite); // get Message Favourite
  router.route('/deleteMessage/:message_id') // delete message
    .get(deleteMessageCtrl.deleteMessage);
  router.route('/message')
    .post(messageCtrl.add);


  //Set Message as Favourite Endpoints
  
  router.route('/setMessageFavourite/')
    .post(setMessageFavouriteCtrl.setMessageFavourite); // set message as favourite 

  //get unique link to send message 
  router.route('/getUniqueLink/:user_id_to')
    .get(getUniqueLinkCtrl.getUniqueLink); // get Message Favourite

  //update push notification setting in user profile
  router.route('/setPushNotification')
    .post(setPushNotificationCtrl.setPushNotification); 

  //update user profile (name, email, password)
  router.route('/updateUserProfile')
    .post(updateUserProfileCtrl.updateUserProfile); 

  //update user profile picture
  router.route('/uploadProfilePicture')
    .post(uploadProfilePictureCtrl.uploadProfilePicture); 

};