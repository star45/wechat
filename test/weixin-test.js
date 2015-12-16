var redis = require("redis");
var client = redis.createClient(6379,'114.215.155.89');
var wechatCode = require('../common/WeChatErrCode');

for(var i in wechatCode){
    console.log(i+"      "+wechatCode[i]);
    // client.set('wechatCode'+i, wechatCode[i], function(err, response) {
    //     if (err) {
    //         console.log('保存expires_in到redis出错, error:' + err);
    //         return false;
    //     }
    // });
}


