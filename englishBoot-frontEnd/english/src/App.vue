<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<style>
  html,body{
    margin: 0;
    padding: 0;
    height: 100%;
    width: 100%;
  }
  body,div,dl,dt,dd,ul,ol,li,h1,h2,h3,h4,h5,h6,pre,form,fieldset,input,textarea,p
  { font:12px/1.5 tahoma,arial,\5b8b\4f53; list-style:none; margin:0; padding:0; }
  a{color:#0000CC; text-decoration:none; outline:none;}
  /* a:hover{color:#0099FF; text-shadow:1px 1px 0px #FFFFFF; text-decoration:none;} */
  img{border:none; margin:0; padding:0;}
  img,input,select,textarea,label{vertical-align:middle;}
  select{height:22px; font:13px Verdana;}
  h1{font-size:20px; font-weight:bold;}
  h2{font-size:18px; font-weight:bold;}
  h3{font-size:16px; font-weight:bold;}
  h4{font-size:14px; font-weight:bold; padding:0 10px;}
  h5{font-size:12px; font-weight:bold; padding:0 10px;}
  h5 .fr{font-weight:normal;}
  #app{
    width: 100%;
    height: 100%;
  }
</style>
