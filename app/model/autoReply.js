var redis = require("redis");
var client = redis.createClient(6379,'114.215.155.89')


exports.save = function(autoReply){
    client.set('autoReply-'+autoReply.id, autoReply, function(err, response) {
        if (err) {
            return false;
        }
    });  
}

exports.get = function(id,callback){
    client.get('autoReply-'+id,function(errGet,responseGet){
            callback(responseGet);
    });
}

exports.find = function(callback){
    client.get('autoReply-*', function(errGet,responseGet) {
        callback(responseGet);
    });  
}

exports.remove = function(id){
    client.remove('autoReply-'+autoReply.id, function(err, response) {
        if (err) {
            return false;
        }
    });  
}

