var express = require('express'); //引入express模块
let loginHandle = require('./script/login');
let getUserList = require('./script/UpdateScore');
let getAnswer = require('./script/getAnswer');
let UpdateTime = require('./script/UpdateTime');
let submitAnswer = require('./script/submitAnswer');
let moment = require('moment');
const bodyParser = require('body-parser');
const {
    json
} = require('body-parser');
var app = express();

//post 参数解析
//parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
    extended: false
}))

//parse application/json
app.use(bodyParser.json())



app.all('*', function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*'); //访问控制允许来源：所有
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept'); //访问控制允许报头 X-Requested-With: xhr请求
    res.header('Access-Control-Allow-Metheds', 'PUT, POST, GET, DELETE, OPTIONS'); //访问控制允许方法
    res.header('X-Powered-By', 'nodeJS'); //自定义头信息，表示服务端用nodejs
    res.header('Content-Type', 'application/json;charset=utf-8');
    next();
});


//登录返回sessionId,userId
app.post('/login', function (req, res) {
    const reqBody = req.body;
    loginHandle(reqBody.userName, reqBody.passWord).then((response) => {
        res.json(200, response);
    }).catch((err) => {
        res.json(500, err);
    });
});



//返回没做过的列表
app.post('/getList', function (req, res) {
    try {
        const reqBody = req.body;
        let myListURL = "http://zhihui.guet.edu.cn/stu/user/userceshi.aspx";
        let allListURL = "http://zhihui.guet.edu.cn/stu/user/listceshi.aspx?id=40";
        let sessionId = reqBody.sessionId;
        let userId = reqBody.userId;
        let userList = null;
        let allList = null;
        let user = new getUserList(myListURL, sessionId, userId, "userList");
        let all = new getUserList(allListURL, sessionId, userId, "allList");
        Promise.all([user.init(), all.init()]).then((fullResult) => {
            userList = fullResult[0];
            allList = fullResult[1];
            console.log(allList);
            console.log("成功");


            res.status(200).json({
                userList: userList,
                allList: allList
            })
        }).catch((err) => {
            console.log("error", err);
            res.json(500, "提取失败！");
        })

    } catch (e) {
        res.json("500", "失败!")

    }


});


app.post('/getAnswer', function (req, res) {
    const nmdId = req.body.nmdId;
    const sessionId = req.body.sessionId;
    const userId = req.body.userId;
    let baseURL = "http://zhihui.guet.edu.cn/stu/user/userceshiinfor.aspx?nmb=" + nmdId;
    const cookie = `ASP.NET_SessionId=${sessionId}; T_Stu=userid=${userId}`;
    console.log(baseURL, cookie);
    try {
        getAnswer(baseURL, cookie).then((response) => {
            res.json(200, response);

        }).catch((err) => {
            res.json(200, ["获取不到答案"]);
        })

    } catch (e) {
        res.json(500, "获取失败")

    }


});



app.post('/submitAnswer', function (req, res) {
    try {
        let answer = req.body.answer;
        let testId = req.body.testId;
        let userId = req.body.userId;
        let sessionId = req.body.sessionId;
        let url = "http://zhihui.guet.edu.cn/stu/csinfor.aspx?id=" + testId;
        let firstTime = moment().format("YYYY/MM/DD HH:mm:ss");
        let endTime = moment().format("YYYY/MM/DD HH:mm:ss");
        let cookie = `ASP.NET_SessionId=${sessionId}; cstime3058=timging=${firstTime}; T_Stu=userid=${userId}; cstime1437=timging=${endTime}`;
        submitAnswer(url, cookie, answer).then((response) => {
            res.json(200, "提交成功");
        }).catch((err => {
            console.log(err);
            res.json(500, "提交失败");
        }));

    } catch (e) {
        res.json(500, "失败!")

    }

});

app.post('/updateTime', function (req, res) {
    console.log("come")
    let {
        account,
        time,
        userId
    } = req.body;
    time = (time * 60);
    try {
        UpdateTime(account, time,userId).then((response, err) => {
            res.json(200, '操作完成')
        });
    } catch (e) {
        res.json(500, "操作失败")

    }

})



//定义端口，此处所用为3000端口，可自行更改
var server = app.listen(3000, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Example app listening at http://%s:%s', host, port);
});