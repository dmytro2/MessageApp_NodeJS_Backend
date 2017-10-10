'use strict';

var config = {
  port: process.env.PORT || 3000,
  bind: process.env.BIND || '47.91.236.188',
  mongodbUrl: process.env.MONGODB || 'mongodb://localhost:27017/AMsgDB',
  serverUrl: process.env.serverUrl ||  'http://47.91.236.188:3000'
};
module.exports = config;