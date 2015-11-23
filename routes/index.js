var express = require('express');
var router = express.Router();
var wechat = require('wechat'); 
var log = require('appLog');
var config = require('../config');
var messageHandler = require('./handler/MessageHandler');

var encryption = require('./utils/encryption');
var generalMsgHandler = require('./handler/generalMsgHandler');

/* GET home page. */
router.get('/', function(req, res, next) {	
  res.render('index', { title: 'Express' });
});

var config = {
  token: config.Token,
  appid: config.AppID,
  encodingAESKey: config.EncodingAESKey
}; 
router.post('/wechat', wechat(config, function (req, res, next) {
    generalMsgHandler.receive(req, res, next);
}));  

/**
router.post('/wechat', function(req, res) {
    encryption.parsePost(req, res,function(req, res){
        generalMsgHandler.receive(req, res);
    });
    res.send('success');
});
*/
module.exports = router;  

