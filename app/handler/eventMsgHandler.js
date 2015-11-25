//接收事件消息
var express = require('express');
var router = express.Router();
var log = require('appLog');
var config = require('../../config');

module.exports.receive = function(req, res){
    // 微信输入信息都在req.weixin上
    var message = req.weixin;
    if(message.Event == 'subscribe'){   //关注事件
        log.app.info('关注事件');
        res.reply({
          content: '哈哈，谢谢关注！',
          type: 'text'
        });
    }else if (message.Event == 'unsubscribe') {  //取消关注事件
        log.app.info('取消关注事件');
        res.reply({
          content: '哈哈，谢谢取消关注！',
          type: 'text'
        });
    }else if (message.Event == 'voice') {

    }else if (message.Event == 'video') { 

    }else if(message.Event == 'shortvideo'){//小视频消息

    }else if (message.Event == 'location') { 

    }else if (message.Event == 'link') { 

    }


}