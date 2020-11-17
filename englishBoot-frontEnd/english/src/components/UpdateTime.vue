<template>
    <div
        id="Update-time-body"
        v-loading="allLoading"
        :element-loading-text="allLoadingText"
    >
        <el-input v-model="account" placeholder="请输入你的账号"></el-input>
        <el-input v-model="password" placeholder="请输入你的密码"></el-input>
        <el-input
            v-model="time"
            placeholder="请输入你的要刷多久(分钟)"
        ></el-input>
        <el-button @click="loginUser">开始刷！</el-button>
    </div>
</template>

<script>
    export default {
        name: "UpdateTime",
        data(){
            return {
                account:'',
                time:'',
                password:'',
                allLoading:false,
                allLoadingText:"时间正在加速....."
            }
        },
        methods:{
            loginUser(){
                let self = this;
                self.allLoading = true;
                self.allLoadingText = "登陆中...";
                let options = {
                    userName:this.account,
                    passWord:this.password
                }
                
                this.$axios.post("/login",options).then(function(res){
                    const sessionId = res.data.sessionId[0];
                    const userId = res.data.userId[0];
                    self.gotoUpdate(sessionId,userId);
                    
                }).catch(function(err){
                    console.log(err);
                    self.$message.error("账户/密码错误..");
                    self.allLoading = false;
                })

            },
            gotoUpdate(sessionId,userId){
                let self = this;
                self.allLoadingText="时间正在加速.....";
                self.allLoading = true;
                
                if(self.time < 1){
                    self.$message.warning("时间必须大于1分钟!");
                    return;
                }
                let options = {
                    account:parseInt(this.account),
                    time: this.time === '' ? 0 : this.time,
                    userId
                    
                }
                this.$axios.post("/updateTime",options).then(function(res){
                    console.log(res)
                    self.allLoading = false;
                    self.$message.success("操作完成!");
                }).catch(function(err){
                    console.log(err);
                    self.$message.error("操作失败....");
                    self.allLoading = false;

                })
            }
            

        },
    }
</script>

<style scoped>
#Update-time-body {
    width: 300px;
    margin: 0 auto;
}
</style>