var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var log = require('appLog');

var routes = require('./routes/index');
var weixin = require('./routes/weixin');

var config = require('./config');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/weixin', weixin);

/**
app.post('/wechat', function(req, res) {
	console.log('接受的信息  ');
	var cryptor = new WXBizMsgCrypt(config.Token, config.EncodingAESKey, config.AppID)

	parsePost('wechat',cryptor, req, res,function(type,msg, req, res){
		log.app.info(msg);
	   res.send('受到消息');
		
	});
	
});
*/

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});

module.exports = app;
var parsePost = function(type, cryptor, req, res,callback) {
    var signature = req.query.msg_signature;
    var timestamp = req.query.timestamp;
    var nonce = req.query.nonce;
    var cryptor = cryptor;

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
				console.log("哈哈哈  "+type+ req.weixin+ req+ res)
				callback(type,req.weixin, req, res);
				
                
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
