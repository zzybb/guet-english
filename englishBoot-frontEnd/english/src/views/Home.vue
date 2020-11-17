<template>
  <div class="home">
    <h1 class="header">桂电英语课刷题系统V0.1</h1>
    <div class="selected-item">
      <div class="item" @click="gotoMakeScore">
        <span>我要刷题</span>
      </div>
      <div class="item" @click="gotoUpdateTime">
        <span>我要刷在线时间</span>
      </div>

    </div>
    <ul class="ul-ok">
      <li>√ 看自己还没做的题</li>
      <li>√ 刷已经<b>过期</b>的题</li>
      <li>√ 重复刷只能<b>提交一次</b>的题</li>
      <li>√ 一键抄写别人的题</li>
      <li>√ 1分钟刷20小时的在线时间</li>
    </ul>

    <h1 class="bottom">桂电666实验室为您的英语课保驾护航!</h1>
  </div>
</template>

<script>
// @ is an alias to /src

export default {
  name: 'home',
  data(){
    return {

    }
  },
  methods:{
    gotoMakeScore(){
      this.$router.push({name:'getScore'})
    },
    gotoUpdateTime(){
      this.$router.push({name:'UpdateTime'})
    }
  }

}
</script>
<style scoped>
  .header{
    width: 360px;
    display: block;
    margin: 0 auto;
    margin-top: 200px;
  }
  .selected-item{
    width: 600px;
    margin: 0 auto;
    margin-top: 40px;
    display: flex;
    justify-content: space-between;
  }
  .selected-item .item{
    display: flex;
    justify-content: center;
    align-items: center;
    width: 250px;
    height: 300px;

    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    cursor: pointer;
  }

  .selected-item .item span{
    font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;

  }
  .ul-ok{
    width: 200px;
    margin: 0 auto;
    margin-top: 100px;
  }
  .bottom{
    width: 400px;

    margin: 0 auto;
    margin-top: 30px;
  }
</style>
