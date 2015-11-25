
var express = require('express');
var router = express.Router();
var log = require('appLog');
var http = require('appHttp');
var eventMsgHandler = require('./eventMsgHandler');
var config = require('../../config');

//接收普通消息且自动回复
module.exports.receive = function(req, res,next){
    // 微信输入信息都在req.weixin上
    var message = req.weixin;
    if (message.MsgType === 'text') {
        if(message.Content == '仰望星空'){
            res.reply([
              {
                title: '仰望星空',
                description: '不悔梦归处，只恨太匆匆',
                picurl: 'http://7xokf9.com1.z0.glb.clouddn.com/abc.png',
                url: 'https://star45.github.io/'
              }
            ]);
        }else if(message.Content == '瘦子'){
            res.reply([
              {
                title: '胖子与瘦子',
                description: '不悔梦归处，只恨太匆匆',
                picurl: config.imageURL_1,
                url: 'https://star45.github.io/'
              }
            ]);
        }else{
            res.reply({
              content: '哈哈，你好啊！,我是胖子',
              type: 'text'
            });
            //你也可以这样回复text类型的信息
            //res.reply('hehe'); 
        }
    } else if (message.MsgType === 'image') {
        res.reply([
          {
            title: '仰望星空',
            description: '不悔梦归处，只恨太匆匆',
            picurl: 'http://7xokf9.com1.z0.glb.clouddn.com/abc.png',
            url: 'https://star45.github.io/'
          }
        ]);
    } else if (message.MsgType === 'voice') {
    // 回复一段音乐
        res.reply({
          type: "music",
          content: {
            title: "来段音乐吧",
            description: "一无所有",
            musicUrl: "http://mp3.com/xx.mp3",
            hqMusicUrl: "http://mp3.com/xx.mp3",
            thumbMediaId: "thisThumbMediaId"
          }
        });
    }else if (message.MsgType === 'shortvideo') {
        res.reply({
          content: '接受到了小视频',
          type: 'text'
        });
    }else if (message.MsgType === 'location') {
        //你也可以这样回复text类型的信息
        res.reply({
          content: '地理位置',
          type: 'text'
        });
    }else if (message.MsgType === 'link') {
        //你也可以这样回复text类型的信息
        res.reply({
          content: '链接',
          type: 'text'
        });
    }else if(message.MsgType == 'event'){ 
        eventMsgHandler.receive(req, res,next);
    }

}

//接收普通消息
module.exports.send = function(msg,access_token){

    log.app.info(msg.MsgType +'  access_token  '+access_token);
    if(msg.MsgType == 'text'){
        
        var url = 'https://api.weixin.qq.com/cgi-bin/message/custom/send?access_token='+access_token;
        var postData = {
            touser:" oOfF1xCKQSYk4hd71KoonXztYhI4",
            msgtype:"text",
            text:
            {
                 content:"Hello World"
            }
        }
        log.app.info('发送用户:   '+postData.touser+'发送的消息:   '+postData.text.content);
        http.sendHttpsPost(url,postData,function(err, result){
        if(result) {
            var _result = JSON.parse(result);
            log.app.info(_result);
            if(_result.errcode != 0){
                log.app.warn('发送消息出错....');
            }else{
                log.app.info('发送的消息....'+_result);
            }
        } else {
            log.app.warn(err);
        }
    });


    }else if (msg.MsgType == 'image') { 

    }else if (msg.MsgType == 'voice') {

    }else if (msg.MsgType == 'video') { 

    }else if(msg.MsgType == 'shortvideo'){//小视频消息

    }else if (msg.MsgType == 'location') { 

    }else if (msg.MsgType == 'link') { 

    }

}

