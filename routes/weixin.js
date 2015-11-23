var express = require('express');
var router = express.Router();
var log = require('appLog');
var http = require('appHttp');
var redis = require("redis");
var client = redis.createClient(6379,'114.215.155.89');
var config = require('../config');


/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('欢迎来到微信主页');
});

router.get('/getToken', function(req, res, next) {
  res.send('获取Token');
  var url = 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid='+config.AppID+'&secret='+config.AppSecret;
	
	http.sendHttps(url,function(err, result){
        if(result) {
            var _result = JSON.parse(result);
            log.app.info(_result);
            if(_result.errcode == 0){
                log.app.warn('获取token出错....');
            }else{
				config.access_token = _result.access_token;
				config.expires_in = _result.expires_in;
                saveAccess_Token(_result.access_token,_result.expires_in);
            }
        } else {
            log.app.warn(err);
        }
    });
});
//获取微信服务器IP地址
router.get('/getCallbackIp', function(req, res, next) {
  res.send('获取微信服务器IP地址');
  getAccess_Token(function(result){ 
    var url = 'https://api.weixin.qq.com/cgi-bin/getcallbackip?access_token='+result;
    http.sendHttps(url,function(err, result){
        if(result) {
            var _result = JSON.parse(result);
            log.app.info(_result);
            if(_result.errcode == 0){
                log.app.warn('获取微信服务器IP地址出错....');
            }else{
                console.log(_result.ip_list);
            }
        } else {
            log.app.warn(err);
        }
    });
  });
});

var saveAccess_Token = function(access_token,expires_in){ 
    //get
    client.set('access_token', access_token, function(err, response) {
        if (err) {
            console.log('保存access_token到redis出错, error:' + err);
            return false;
        }
    });
    client.set('expires_in', expires_in, function(err, response) {
        if (err) {
            console.log('保存expires_in到redis出错, error:' + err);
            return false;
        }
    });
}
var getAccess_Token = function(callback){ 
    client.get('access_token',function(errGet,responseGet){
            console.log('access_token的值  :'+responseGet);
            callback(responseGet);
    });
}
module.exports = router;
