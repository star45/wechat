var request = require('request');
var fs = require('fs');


function copyFile(){
    request('http://7xj0za.com2.z0.glb.qiniucdn.com/c9452840-8dc3-11e5-977e-7946b0871c65')
        .pipe(fs.createWriteStream('D:/Temp/abc.png'));

}

function testJson(){

    var menus = {
        "button":[
            {
                "type":"click",
                "name":"今日歌曲",
                "key":"V1001_TODAY_MUSIC"
            },
            {
                "name":"菜单",
                "sub_button":[
                    {
                        "type":"view",
                        "name":"搜索",
                        "url":"http://www.soso.com/"
                    },
                    {
                        "type":"view",
                        "name":"视频",
                        "url":"http://v.qq.com/"
                    },
                    {
                        "type":"click",
                        "name":"赞一下我们",
                        "key":"V1001_GOOD"
                    }]
            }]
    }
    console.log(menus.button.length);

}


testJson();