/**
 *针对微信的收发消息进行加密、解密
 */

var xml2js = require('xml2js');
var WXBizMsgCrypt = require('wechat-crypto');
var config = require('../../config');

module.exports.parsePost = function(req, res,callback) {
    var signature = req.query.msg_signature;
    var timestamp = req.query.timestamp;
    var nonce = req.query.nonce;
    var cryptor = new WXBizMsgCrypt(config.Token, config.EncodingAESKey, config.AppID)

    load(req, function (err, buf) {
        if (err) {
            req.end("error");
        }
        var xml = buf.toString('utf-8');
        if (!xml) {
            var emptyErr = new Error('body is empty');
            emptyErr.name = 'Wechat';
            res.end(emptyErr);
        }
        xml2js.parseString(xml, {trim: true}, function (err, result) {
            if (err) {
                err.name = 'BadMessage' + err.name;
                res.end(err);
            }
            var xml = formatMessage(result.xml);
            var encryptMessage = xml.Encrypt;
            if (signature !== cryptor.getSignature(timestamp, nonce, encryptMessage)) {
                //res.writeHead(401);
                res.end('Invalid signature');
                return;
            }
            var decrypted = cryptor.decrypt(encryptMessage);
            var messageWrapXml = decrypted.message;
            if (messageWrapXml === '') {
                //res.writeHead(401);
                res.end('Invalid corpid');
            }
            req.weixin_xml = messageWrapXml;
            xml2js.parseString(messageWrapXml, {trim: true}, function (err, result) {
                if (err) {
                    err.name = 'BadMessage' + err.name;
                    return next(err);
                }
                req.weixin = formatMessage(result.xml);
                callback(req, res);
            });
        });
    });
};

var load = function (stream, callback) {
    var buffers = [];
    stream.on('data', function (trunk) {
        buffers.push(trunk);
    });
    stream.on('end', function () {
        callback(null, Buffer.concat(buffers));
    });
    stream.once('error', callback);
};

/*!
 * 将xml2js解析出来的对象转换成直接可访问的对象
 */
var formatMessage = function (result) {
    var message = {};
    if (typeof result === 'object') {
        for (var key in result) {
            if (result[key].length === 1) {
                var val = result[key][0];
                if (typeof val === 'object') {
                    message[key] = formatMessage(val);
                } else {
                    message[key] = (val || '').trim();
                }
            } else {
                message = result[key].map(formatMessage);
            }
        }
    }
    return message;
};

var replyMsg = function(text, fromUser, toUser, req, res){ 
     var cryptor = new WXBizMsgCrypt(config.Token, config.EncodingAESKey, config.AppID)
    var xml = '<xml>'+
        '<ToUserName>'+toUser+'</ToUserName>'+
        '<FromUserName>'+fromUser+'</FromUserName>'+
        '<CreateTime>'+12345678+'</CreateTime>'+
        '<MsgType>text</MsgType>'+
        '<Content>'+text+'</Content>'+
        '</xml>';

    console.dir(xml);
    var timestamp = new Date().getTime();
    var nonce = parseInt((Math.random() * 100000000000), 10);
    var encrypt = cryptor.encrypt(xml);
    var signature = cryptor.getSignature(timestamp, nonce, encrypt);

    var msg = '<xml><Encrypt><![CDATA['+encrypt+']]></Encrypt>' +'<Nonce><![CDATA['+nonce+']]></Nonce>'+
            '<TimeStamp>'+timestamp+'</TimeStamp><MsgSignature><![CDATA['+signature+']]></MsgSignature>'+
        '</xml>';
    console.dir(msg);
    res.end(msg);

};