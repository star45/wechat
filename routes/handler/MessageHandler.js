var log = require('appLog');

module.exports.message = function(req, res, next){ 
    // 微信输入信息都在req.weixin上
    var message = req.weixin;
    log.app.info(message);
    log.app.info('收到消息...  ');
    if (message.MsgType === 'text') {
        res.reply({
          content: '哈哈，你好啊！',
          type: 'text'
        });
        //你也可以这样回复text类型的信息
        //res.reply('hehe');
    } else if (message.MsgType === 'image') {
        // 回复高富帅(图文回复)
        res.reply([
          {
            title: '你来我家接我吧',
            description: '这是女神与高富帅之间的对话',
            picurl: 'http://nodeapi.cloudfoundry.com/qrcode.jpg',
            url: 'http://nodeapi.cloudfoundry.com/'
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
    }


}