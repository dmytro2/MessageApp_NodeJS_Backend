var express = require('express');
var ObjectId = require('mongodb').ObjectID;

var Message = require('./models/message.js');
var MessageModel = Message.modelName;
var Users = require('./models/user.js');

var user_fields = '_id name lastname';

/**
 * get message list by userID who received message
 * Request Param: {user_id_to}
 * GET: /feed/[user_id_to]
**/
exports.getFeeds = function(req, res) {
  	var user_id_to = req.params.user_id_to;
  
	MessageModel.find( { user_id_to: { $all: user_id_to } } )
  	.exec(function(err, docs) {
		if(err) {
			console.log(err);
			res.json({success: false, Status:"Error while finding message"});
			return;
		}
		res.json({success: true, message: docs});
	})
}