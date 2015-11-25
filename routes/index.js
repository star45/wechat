var express = require('express');
var router = express.Router();
var log = require('appLog');
var config = require('../config');
var encryption = require('../app/utils/encryption');
var generalMsgHandler = require('../app/handler/generalMsgHandler');

/* GET home page. */
router.get('/', function(req, res, next) {	
  res.render('index', { title: 'Express' });
});
  

router.post('/wechat', function(req, res) {
    encryption.parsePost(req, res,function(req, res){
        generalMsgHandler.receive(req, res);
    });
    res.send('success');
});

module.exports = router;  

