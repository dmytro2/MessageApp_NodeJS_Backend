var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;
var Q            = require('q');

var accountSchema = new Schema({
  accountId:      String,
  parentId:       String,
  name:           String,
  authToken:      String, 
  packageId:      String,
  webhookUrl:     String,
  enabled:        { type: Number, default: 1 },
  status:         { type: String, default: 'active' },
  timestamp:      { type: Date, default: Date.now },
  email:          String,
  phoneNumber:    String,
  password:       String,
  firstName:      String,
  lastName:       String,
  streetAddress:  String,
  stateAddress:   String,
  cityAddress:    String,
  zipCodeAddress: String
}, {collection: 'accounts' });

var Accounts = mongoose.model('Accounts', accountSchema);

var self = module.exports = {
  modelName: Accounts,
  getByID: function(id) {
    var deferred = Q.defer();
    Accounts.findById(id, function(err, accounts) {
      if (err) {
        deferred.reject('Error while getting Accounts');
      }
      else {
        if (accounts) {
          deferred.resolve(accounts);
        } else {
          deferred.reject('No existing Accounts');
        }
      }
    });
    return deferred.promise;
  }
};