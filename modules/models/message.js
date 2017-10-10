var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;
var Users        = require('./user.js');
var Q            = require('q');

var messageSchema = new Schema({
	user_id_from:  { type: String, ref: 'Users' },
	user_id_to:  { type: String, ref: 'Users' },
	user_name_to: { type: String, default: '' },
	text:    { type: String, default: '' },
	isFavourite:  { type: Boolean, default: 0 },
	timestamp: { type: Date }
}, {collection: 'message'});

var Message = mongoose.model('Message', messageSchema);

var self = module.exports = {
	modelName: Message,
	getByID: function(id) {
		var deferred = Q.defer();
		Message.findById(id, function(err, feeds) {
			if (err) {
				deferred.reject('Error while getting Message');
			}
			else {
				if (feeds) {
					deferred.resolve(feeds);
				} else {
					deferred.reject('No existing Message');
				}
			}
		});
		return deferred.promise;
	}
};