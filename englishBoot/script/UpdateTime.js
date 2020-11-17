
var request = require('request');

module.exports = function (name, time,userId) {
    return new Promise((response, reject) => {
        var zjs = 0;
        var index = 0;
        Req(name, time, response,index,zjs,userId)
    })
}


function Req(name, time, rep,index,zjs,userId) {
    if (index === time) {
        rep()
        return;
    }

    console.log("时间" + zjs + "秒start!");
    request(`http://zhihui.guet.edu.cn/stu/webuc/lookjx.aspx?jxid=1028&u=${userId}&tcid=42&name=${name}&ram=0.8949813938652462&zjs=${zjs}`, function (error, response, body) {

        if (!error && response.statusCode === 200) {
            console.log("OK");
            zjs += 5;
            index += 5;
            Req(name, time, rep,index,zjs,userId);
        }
    })
}