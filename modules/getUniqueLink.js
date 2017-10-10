var express = require('express');
var ObjectId = require('mongodb').ObjectID;

var Message = require('./models/message.js');
var MessageModel = Message.modelName;


/**
 * get unique link by userID who will receive message
 * Request Param: {user_id_to}
 * GET: /getUniqueLink/[user_id_to]
**/
exports.getUniqueLink = function(req, res) {
  	var user_id_to = req.params.user_id_to;
  
	// MessageModel.find( {
	//  user_id_to: req.params.user_id_to,
	//  isFavourite: true
	//  } )
 //  	.exec(function(err, docs) {
	// 	if(err) {
	// 		console.log(err);
	// 		res.json({message: "error", Status:"Error while finding message"});
	// 		return;
	// 	}
	// 	res.json({message: "success", items: docs});
	// })
	res.json({message: "success", link: "amsgapp://"+user_id_to});
}