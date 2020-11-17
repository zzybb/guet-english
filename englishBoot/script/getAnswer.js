const request = require('request');
const cheerio = require('cheerio');


module.exports = function getAnswer(url,cookie){
    const options = setOptions(url,cookie);
    return new Promise((resolve,reject)=>{
        request(options,function (error, response, body) {
            if (!error && response.statusCode !== 500) {
                let answer = parseHTML(body);
                resolve(answer);
            }else{
                reject("提取失败！");
            }
        })
    })
};


function parseHTML(body) { //解析所有页面，并返回他的所有下一页
    const $ = cheerio.load(body);
    let result = [];
    let allTd = $(".mobanhang.clear");
    let InVailIndexList = findInVailIndex($(".mobanlist"),$);//找到无效行列表，主要用于处理会有空白行导致填入答案时顺序不一样的情况
    let j = 0;
    for (let i = 0; i < InVailIndexList.length;i++){ //合并无效行与正确答案
        if (InVailIndexList[i]){
            result[i] = "无效行";
            continue;
        }

        if( allTd[j] === undefined){
            continue;
        }
        let cur = allTd[j++]["children"][1]["children"];
        result[i] = cur.length === 0 ? "写作题" : cur[0]["data"];//allTd[i]["children"][1]["children"][0]["data"];
    }

    return result;
}

function findInVailIndex(list,$){
    let result = {
        length:0
    };
    list.each(function(i){
        let children = $(this).children(".mobanhang");
        if (children[0]["attribs"]["style"] === "display:none"){
            result[i] = true;
        }else{
            result[i] = false;
        }
        result["length"]++;
    });

    return result;


}




function setOptions(url,cookie) {
    return { //设置options
        url: url,
        method: 'GET',
        headers: {
            "Cookie": cookie,
        }
    }
}

