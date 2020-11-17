<template>
    <div class="getList-body"
         v-loading="allLoading"
        :element-loading-text="allLoadingText"
    >
        <div class="base-body left-body" >
            <h1>你未做的题目</h1>
            <div class="login-userCount" v-if="!userIsLogin">

                <el-input v-model="userAccount" placeholder="请输入你的账号"></el-input>
                <div class="passWord" >
                    <el-input v-model="userPassWord" placeholder="请输入你的密码"></el-input>
                </div>

                <div class="login-button">
                    <el-button type="primary" @click="loginUser('user')">登录你的账户</el-button>
                </div>


            </div>

            <div v-else>
                <el-button type="primary" @click="getAnswer2">开始获取答案</el-button>
                <!--<el-button type="primary" @click="diffCanDo">比对能抄的题目</el-button>-->
                <h2><span style="color: red">红色</span>表示未做，<span style="color: greenyellow">绿色</span>表示已做</h2>
                <h1>未作题目数:{{userListData.length}}</h1>
                <el-table
                        :data="userListData"
                        style="width: 100%"
                        :row-class-name="tableRowClassName"
                        >
                    <el-table-column
                            prop="title"
                            label="题目名称"
                    >
                    </el-table-column>
                    <el-table-column
                            align="right">
                        <template slot-scope="scope">
                            <el-button
                                    size="mini"
                                    @click="handleEdit(scope.$index, scope.row)">抄写</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>
        <div class="base-body right-body"

        >
            <h1>目标账号已做题目</h1>
            <div class="login-userCount" v-if="!aimIsLogin">
                <el-input v-model="aimAccount" placeholder="请输入对方账号"></el-input>
                <div class="passWord">
                    <el-input v-model="aimPassWord" placeholder="请输入对方密码"></el-input>
                </div>

                <div class="login-button">
                    <el-button type="primary" @click="loginUser('other')">登录对方账户</el-button>
                </div>
            </div>
            <div v-else>
                <!--<el-button type="primary" @click="gotoPullAimTest">拉取对方已做题目</el-button>-->
                <el-button type="primary" disabled="">占位按钮</el-button>

                <h2><span style="color: red">红色</span>表示不能抄，<span style="color: greenyellow">绿色</span>表示能抄</h2>
                <h1>已作题目数:{{CanDoNum}}</h1>
                <el-table
                        :data="aimListData"
                        style="width: 100%"
                        :row-class-name="tableRowClassName"
                >
                    <el-table-column
                            type="expand"
                    >
                        <template slot-scope="props">
                            <el-form label-position="left" inline class="demo-table-expand">
                                <el-form-item :label="`第${index + 1}题:  `" v-for="(item,index) in props.row.answer" :key="index">
                                    <span>{{ item }}</span>
                                </el-form-item>
                            </el-form>
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="title"
                            label="题目名称"

                    >
                    </el-table-column>
                    <el-table-column
                            align="right">
                        <template slot-scope="scope">
                            <el-button
                                    size="mini"
                                    disabled
                                    >占位按钮</el-button>
                        </template>
                    </el-table-column>

                </el-table>
            </div>
        </div>


    </div>
</template>

<script>
    export default {
        name: "getList",
        data(){
            return {
                allLoading:false,
                userAccount:'',
                userPassWord:'',
                aimAccount:'',
                aimPassWord:'',
                IdInfo:{
                    userSession:'',
                    userId:'',
                    aimSession:'',
                    aimId:''
                },
                userIsLogin:false,
                aimIsLogin:false,
                userListData: [],
                aimListData:[],
                allLoadingText:"",
                CanDoNum:0
            }
        },
        methods:{
            loginUser(status){
                let self = this;
                let options = null;
                self.allLoading = true;
                self.allLoadingText = "登陆中...";
                if(status === 'other'){
                    options = {
                        userName:this.aimAccount,
                        passWord:this.aimPassWord
                    }
                } else {
                    options = {
                        userName:this.userAccount,
                        passWord:this.userPassWord
                    }
                }

                this.$axios.post("/login",options).then(function(res){
                    const sessionId = res.data.sessionId[0];
                    const userId = res.data.userId[0];
                    if (status === 'user'){
                        self.IdInfo.userSession = sessionId;
                        self.IdInfo.userId = userId;
                        self.userIsLogin = true;
                        self.$message.success("成功登录账户" + self.userAccount);
                    } else {
                        self.IdInfo.aimSession = sessionId;
                        self.IdInfo.aimId = userId;
                        self.aimIsLogin = true;
                        self.$message.success("成功登录账户" + self.aimAccount);
                    }
                    self.allLoading = false;
                }).catch(function(err){
                    console.log(err);
                    self.$message.error("账户/密码错误..");
                    self.allLoading = false;

                })

            },
            /**
             * 先获取我没做的题目，再获取对方已经做的题目，比对能抄的题目后再获取能抄题目的答案
             */
            getAnswer2(){  //刷全部题目用
                if (!this.aimIsLogin){
                    this.$message.error("请先登录对方账号");
                    return;
                }

                this.allLoading = true;
                this.aimListData = [];
                this.userListData = [];
                this.CanDoNum = 0;
                this.allLoadingText = "获取个人未做题目中...";
                let userList = null;
                let aimList = null;
                let diffList = null;
                this.gotoPullMyTest2().then((res)=>{

                    userList = res;
                    this.allLoadingText = "获取目标已做题目中...";
                    this.gotoPullAimTest().then((res2)=>{

                        aimList = res2;
                        diffList = this.diffCanDo(userList,aimList);
                        this.allLoadingText = "获取答案中...";
                        this.GotoGetAnswer(diffList).then((res)=>{
                            this.userListData = userList;
                            this.aimListData = res;
                            this.allLoading = false;
                            this.$message.success("提取答案成功!");
                        }).catch((err)=>{
                            this.$message.error("提取答案失败...",err);
                        });
                    }).catch(()=>{
                        this.$message.error("获取目标已做题目失败...");
                    });
                }).catch(()=>{
                    this.$message.error("获取个人未做题目失败...");
                });
            },
            getAnswer(){   //比对能抄写的函数
                //const self = this;
                if (!this.aimIsLogin){
                    this.$message.error("请先登录对方账号");
                    return;
                }

                this.allLoading = true;
                this.aimListData = [];
                this.userListData = [];
                this.CanDoNum = 0;
                this.allLoadingText = "获取个人未做题目中...";
                let userList = null;
                let aimList = null;
                let diffList = null;
                this.gotoPullMyTest().then((res)=>{

                    userList = res;
                    this.allLoadingText = "获取目标已做题目中...";
                    this.gotoPullAimTest().then((res2)=>{

                        aimList = res2;
                        diffList = this.diffCanDo(userList,aimList);
                        this.allLoadingText = "获取答案中...";
                        this.GotoGetAnswer(diffList).then((res)=>{
                            this.userListData = userList;
                            this.aimListData = res;
                            this.allLoading = false;
                            this.$message.success("提取答案成功!");
                        }).catch((err)=>{
                            this.$message.error("提取答案失败...",err);
                        });
                    }).catch(()=>{
                        this.$message.error("获取目标已做题目失败...");
                    });
                }).catch(()=>{
                    this.$message.error("获取个人未做题目失败...");
                });
            },
            gotoPullMyTest2(){
                //const self = this;
                //this.leftLoading = true;

                let curResult = [];

                return new Promise((resolve,reject)=>{
                    this.$axios.post("/getList",{
                        sessionId:this.IdInfo.userSession,
                        userId:this.IdInfo.userId
                    }).then(function(res){
                        //let userList = res.data["userList"];
                        let allList = res.data["allList"];

                        let endList = allList;

                        for (let i = 0;i < endList.length;i++){
                            let obj = {
                                title:endList[i].title,
                                status:"fail",
                                answerId:endList[i].answerId[0],
                                testId:endList[i].testId[0]

                            };
                            curResult.push(obj);
                        }

                        resolve(curResult);
                    }).catch(function(err){
                        console.log(err);
                        reject();
                        //self.leftLoading = false;
                    })
                })
            },


            gotoPullMyTest(){
                const self = this;
                //this.leftLoading = true;

                let curResult = [];

                return new Promise((resolve,reject)=>{
                    this.$axios.post("/getList",{
                        sessionId:this.IdInfo.userSession,
                        userId:this.IdInfo.userId
                    }).then(function(res){
                        let userList = res.data["userList"];
                        let allList = res.data["allList"];

                        let endList = self.diff(userList,allList);

                        for (let i = 0;i < endList.length;i++){
                            let obj = {
                                title:endList[i].title,
                                status:"fail",
                                answerId:endList[i].answerId[0],
                                testId:endList[i].testId[0]

                            };
                            curResult.push(obj);
                        }

                        resolve(curResult);
                    }).catch(function(err){
                        console.log(err);
                        reject();
                        //self.leftLoading = false;
                    })
                })
            },
            gotoPullAimTest(){
                //const self = this;


                /*if (localStorage.getItem("aimListData")){
                    this.aimListData = JSON.parse(localStorage.getItem("aimListData"));
                    this.answerSuccess = true;
                    this.diffCanDo();
                    return;
                }*/
                let getAnswerList = [];
                //this.rightLoading = true;


                return new Promise((resolve,reject)=>{
                    this.$axios.post("/getList",{
                        sessionId:this.IdInfo.aimSession,
                        userId:this.IdInfo.aimId
                    }).then(function(res){
                        let userList = res.data["userList"];
                        for (let i = 0;i < userList.length;i++){
                            let obj = {
                                title:userList[i].title,
                                answerId:userList[i].answerId[0],
                                status:"success"
                            };
                            //self.aimListData.push(obj);
                            getAnswerList.push(obj);
                        }
                        resolve(getAnswerList);

                        /*self.GotoGetAnswer(getAnswerList).then((res)=>{
                            console.log(res);
                            self.diffCanDo();//获取答案成功后进行比对
                            //self.rightLoading = false;
                            //self.leftLoading = false;
                        }).catch((err)=>{
                            //self.rightLoading = false;
                            //self.leftLoading = false;
                            console.log(err);
                        })*/
                    }).catch(function(err){
                        console.log(err);
                        reject();
                        //self.rightLoading = false;
                        //self.leftLoading = false;
                    })
                })

            },

            async GotoGetAnswer(IdList){
                const self = this;
                let requestList = [];
                let index = [];
                for (let i = 0; i < IdList.length;i++){
                    if (IdList[i]["status"] === "success"){
                        index.push(i);
                        this.CanDoNum++;
                        requestList.push(self.$axios({
                            url:'/getAnswer',
                            method:'POST',
                            data:{
                                nmdId:IdList[i]["answerId"],
                                sessionId:self.IdInfo.aimSession,
                                userId:self.IdInfo.aimId
                            }
                        }))
                    }

                }

                let result = await  new Promise((resolve,reject)=>{
                    this.$axios.all(requestList).then(self.$axios.spread(function(...callBackList){
                        for (let i = 0;i < callBackList.length;i++){
                            IdList[index[i]]["answer"] = callBackList[i].data;
                        }
                        //self.aimListData = IdList;
                        //localStorage.setItem("aimListData",JSON.stringify(IdList));//缓存
                        //self.$message.success("提取答案成功!");
                        //self.answerSuccess = true;
                        resolve(IdList);

                    })).catch((err)=>{
                        reject("提取失败",err);
                    });
                });

                return result;
            },
            diffCanDo(userList,aimList){
                if (userList.length === 0 || aimList.length === 0){
                    this.$message.warning("请把两个账号都登录，并且拉取好题目");
                    return;
                }

                const N = userList.length;
                const M = aimList.length;
                let result = [];
                let success = false;
                for(let i = 0;i < N;i++){
                    for (let j = 0;j < M;j++){
                        if (userList[i].title === aimList[j].title){
                            result.push({
                                title:userList[i].title,
                                status:"success",
                                answerId:aimList[j].answerId,
                                answer:aimList[j].answer
                            });
                            success = true;
                            break;
                        }
                    }
                    if(!success){
                        result.push({
                            title: "他也没做",
                            status:"fail",
                            answerId:'',
                            answer:["他还没做呢"]
                        })

                    }
                    success = false;
                }

                return result;
            },
            tableRowClassName(obj){
                let row = obj.row;
                if (row.status === "success"){
                    return "success-row"
                } else if (row.status === "fail"){
                    return "warning-row"
                }

                return '';

            },
            diff(userList,allList) {
                let resultList = [];
                let success = false;
                for (let i = 0; i < allList.length; i++) {
                    for (let j = 0; j < userList.length; j++) {
                        if (allList[i].title === userList[j].title) {
                            success = true;
                            break;
                        }
                    }
                    if (!success) {
                        resultList.push(allList[i]);
                    }
                    success = false;
                }
                return resultList;
            },
            handleEdit(index,row){
                let cur = this.aimListData[index];
                if (cur.status === "fail"){
                    this.$message.error("他也没做，抄不了!");
                    return;
                }

                if (cur.answer[0] === "写作题"){
                    this.$message.warning("这是写作题，无法抄");
                    return;
                }

                if (cur.answer[0] === "获取不到答案"){
                    this.$message.warning("这题获取不到答案呢");
                    return;
                }

                const self = this;
                this.allLoading = true;
                this.allLoadingText = "抄写中,请稍后...";


                let answer = cur.answer;

                this.$axios.post('/submitAnswer',{
                    answer: answer,
                    testId: row.testId,
                    sessionId: this.IdInfo.userSession,
                    userId: this.IdInfo.userId
                }).then((res)=>{
                    this.$message.success("抄写成功!!");
                    row.status = "success";
                    self.allLoading = false;
                    console.log(res);
                }).catch((err)=>{
                    this.$message.error("抄写失败...请联系管理员");
                    row.status = "fail";
                    self.allLoading = false;
                    console.log(err);
                })
            }
        }
    }
</script>

<style scoped>
    .getList-body{
        width: 100%;
        min-height: 100%;
        display: flex;

    }
    .base-body{
        width: 50%;
        align-items: stretch;
    }
    .left-body{
        border-right: 1px lightgray solid;
    }
    .login-userCount{
        width: 300px;
        margin: 0 auto;
        margin-top: 200px;
        padding: 30px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04)

    }
    .login-button{
        margin-top: 30px;
        display: flex;
        justify-content: center;
    }
    .login-userCount .passWord{
        margin-top: 30px;
    }
    /deep/.el-table .warning-row {
        background: #FF6A6A;

    }

    /deep/.el-table .success-row {
        background: greenyellow;
    }



</style>