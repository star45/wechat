var redis = require("redis");
var client = redis.createClient(6379,'114.215.155.89');

var bcrypt = require('bcrypt');    //用于密码加密
var SALT_WORK_FACTOR = 10; //密码破解需要的强度，越大破解需要时间越长

//电影数据类型
var AutoReplySchema = new mongoose.Schema({
    name:{
        unique:true,
        type:String
    },
    outContent:String,
    inContent:String,
    meta: {
        createAt: {
            type: Date,
            default: Date.now()
        },
        updateAt: {
            type: Date,
            default: Date.now()
        }
    }
});

//模式保存前执行下面函数,如果当前数据是新创建，则创建时间和更新时间都是当前时间，否则更新时间是当前时间
AutoReplySchema.pre('save',function(next){
    var autoReply = this;
    if(this.isNew){
        this.meta.createAt = this.meta.updateAt = Date.now();
    }else{
        this.meta.updateAt = Date.now();
    }
});

//实例方法，通过实例可以调用
AutoReplySchema.methods = {
    comparePassword : function(password,cb){
        //使用bcrypt的compare方法对用户输入的密码和数据库中保存的密码进行比对
        bcrypt.compare(password,this.password,function(err,isMatch){
            if(err) return cb(err);

            cb(null,isMatch);
        });
    }
};

//静态方法不会与数据库直接交互，模型方法通过模型可以调用
AutoReplySchema.statics = {
    fetch : function(cb){
        return this
            .find({})
            .sort('meta.updateAt')
            .exec(cb);      
    },
    findById : function(id,cb){
        return this
            .findOne({_id:id})
            .exec(cb);
    }
};

module.exports = AutoReplySchema;
