var express = require('express');
var router = express.Router();
var log = require('appLog');
var http = require('appHttp');
var redis = require("redis");
var config = require('../config');
var config = require('../app/handler/consoleHandler');

router.get('/',function(req,res){
     res.render('index', { title: '控制台' });
});

router.post('/autoReply',function(res,req){
    var autoReply = {
        in_content:'',
        out_content:''
    }
    
});
