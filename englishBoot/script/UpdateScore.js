const request = require('request');
const cheerio = require('cheerio');

module.exports = class getUserList {
    constructor(url,session_id, user_id,status) {
        this.sessionId = session_id;
        this.user_id = user_id;
        this.baseURL = url;
        this.status = status;
        this.myCompletedList = [];
        this.index = 0;
        this.page = null;

    }

    async init() {
        let options = this.setOptions(this.baseURL);
        await this.pullFirstRequest(options);//先异步获取第一页和总页数
        return await this.getOtherPage(this.page);//等待其他页整合好再返回数组
    }

    async getOtherPage(otherPage){
        if (this.index === otherPage.length){
            return this.myCompletedList;
        }

        const self = this;
        let options = null;
        if (self.status === "userList"){
            options = self.setOptions(`${self.baseURL}?page=${otherPage[self.index]}`);
        } else if (self.status === "allList")  {
            options = self.setOptions(`${self.baseURL}&page=${otherPage[self.index]}`);
        }else{
            console.log("参数错误");
            return ;
        }

        return await self.getOtherRequest(options)
    }

    getOtherRequest(options){
        return new Promise((resolve,reject)=>{
            const self = this;
            request(options, function (error, response, body) {
                if (!error && response.statusCode === 200) {
                    self.parseHTML(body);
                    self.index++;
                    resolve(self.getOtherPage(self.page));
                }
            })
        })
    }


    pullFirstRequest(options){ //解析第一个页面
        return new Promise((resolve,reject) => {
            const self = this;
            request(options, function (error, response, body) {
                if (!error && response.statusCode === 200) {
                    let otherPage = self.parseHTML(body);
                    resolve(otherPage);
                }
            })
        })
    }


    setOptions(url) {
        return { //设置options
            url: url,
            method: 'GET',
            headers: {
                "Cookie": `ASP.NET_SessionId=${this.sessionId}; T_Stu=userid=${this.user_id}`,
            }
        }
    }

    parseHTML(body) { //解析所有页面，并返回他的所有下一页
        const $ = cheerio.load(body);
        let allTd = $('td[align=left]');
        let pageObj = $('a[class=sabrosus]');
        let regAnswer = /(?<=(nmb=))(\d*)/g;
        let regTestId = /(?<=(id=))(\d*)/g;
        let answer = null;
        let testId = null;
        if (this.status === "userList"){ //只有已做的练习里才有答案
            answer = $('a[href^=userceshiinfor]');
        }

        if (this.status === "allList"){  //拿所有题目的时候我需要获取题目的ID，便于提交使用
            testId = $('a[target=_blank]');

        }
        for (let i = 0; i < allTd.length; i++) {
            let answerId = "";
            let testIdItem = "";
            if (answer){
                answerId = answer[i]["attribs"]["href"].match(regAnswer);
            }
            if (testId){
                testIdItem = testId[i]["attribs"]["href"].match(regTestId);
            }
            let newString = this.spliceString(allTd[i].children[0]["data"]);
            this.myCompletedList.push({
                title:newString,
                answerId: answerId,
                testId:testIdItem
            });
        }

        if (this.page === null){
            this.page = this.getPageObj(pageObj);
        }
    }


    getPageObj(pageObj) {
        let pageRequest = new Set();
        let reg1 = /(?<=(page=))(\d*)/g;//拿page=后面那个数字
        for (let i = 0; i < pageObj.length; i++) {
            let num = pageObj[i].children[0]["parent"]["attribs"]["href"].match(reg1)[0];
            pageRequest.add(num);
        }

        return Array.from(pageRequest);
    }

    spliceString(s) {
        s = s.trim();
        return s;
    }

}






