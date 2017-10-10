var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;
var Q            = require('q');

var userSchema = new Schema({
  id:      String,
  name:           String,
  password:      String, 
  timestamp:      { type: Date, default: Date.now },
  email:          String,
  push_notification:  { type: Boolean, default: true },
  profile_picture: String,
}, {collection: 'user' });

var Users = mongoose.model('Users', userSchema);

var self = module.exports = {
  modelName: Users,
  getByID: function(id) {
    var deferred = Q.defer();
    Users.findById(id, function(err, accounts) {
      if (err) {
        deferred.reject('Error while getting Users');
      }
      else {
        if (accounts) {
          deferred.resolve(accounts);
        } else {
          deferred.reject('No existing Users');
        }
      }
    });
    return deferred.promise;
  }
};