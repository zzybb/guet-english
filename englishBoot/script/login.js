const request = require('request');
const reg1 = /(?<=SessionId=)(\w)*/g;
const reg2 = /(?<=userid=)(\d)*/g;
module.exports =  function login(userName,passWord){
    return new Promise((resolve,reject) => {
        let baseURL = "http://zhihui.guet.edu.cn/Default.aspx";
        console.log(userName,passWord);
        request.post({
            url:baseURL,
            form:{
                txtUserName: userName,
                txtPassword: passWord,
                loginend: "登录"
            }
        },function(err,response,body){
            try {
                if (!err) {
                    let cookie = response.headers["set-cookie"];
                    console.log(cookie[2]);
                    const sessionId = cookie[0].match(reg1);
                    const userId = cookie[1].match(reg2);
                    
                    resolve({
                        sessionId: sessionId,
                        userId: userId
                    });

                }else{
                    reject(err);
                }
            }catch (e) {
                reject("账户密码错误..");

            }

        })
    } )
}