var index = require('./index');
var weixin = require('./weixin');
var console = require('./console');

module.exports = function(app){
    app.use('/', index);
    app.use('/weixin', weixin);
    app.use('/console', weixin);
}