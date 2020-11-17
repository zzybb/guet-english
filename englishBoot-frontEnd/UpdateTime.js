var request = require('request');
var zjs = 0;
var index = 0;
function Req(){
    if (index === 10000){
    	return;
    }

    console.log("时间" + zjs + "秒start!");
    request('http://zhihui.guet.edu.cn/stu/webuc/lookjx.aspx?jxid=1027&u=73059&tcid=42&name=19032304026&ram=0.8949813938652462&zjs=' + zjs, function (error, response, body) {
    	
        if (!error && response.statusCode === 200) {
            console.log("OJK");
            zjs += 5;
            index++;
            Req();
        }
    })
}

Req();

