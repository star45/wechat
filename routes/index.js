var express = require('express');
var router = express.Router();
var wechat = require('wechat'); 
var log = require('appLog');
var config = require('../config');
var generalMsgHandler = require('../app/handler/generalMsgHandler');

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
module.exports = router;  

