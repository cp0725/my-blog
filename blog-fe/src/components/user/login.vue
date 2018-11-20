<!--登陆-->
<template>
  <div class="login-wrap">
    <div class="main">
      <div class="title">
        <span v-if="!message.status">登陆</span>
        <span v-else class="err">{{message.tit}}</span>
        <i @click="close"></i>
      </div>
      <div class="inp-wrap">
        <input v-model="fromValue.userName" @blur="blurEvent" @focus="focusEvent('user-name', 'userName')" placeholder="请输入手机号或邮箱" type="text" maxlength="20">
        <p @click="tips('userName')" v-show="!tipsStatus.userName">请输入正确的手机号或者电子邮箱</p>
      </div>
      <div class="inp-wrap">
        <input v-model="fromValue.passWord" @blur="blurEvent" @focus="focusEvent('pass-word', 'passWord')" placeholder="请输入密码" type="password" maxlength="12">
        <p @click="tips('passWord')" v-show="!tipsStatus.passWord">密码长度为6-12位且不含中文</p>    
      </div>
      <div class="btn-wrap">
        <button @click="login">登录</button>
      </div>
      <div class="bottom">
        <span class="left">没有账号？<i @click="register">注册</i></span>
        <span class="right">忘记密码</span>
      </div>
      <img v-show="imgName=='pass-word'" src="../../assets/img/pass-word.png" alt="">
      <img v-show="imgName=='user-name'" src="../../assets/img/user-name.png" alt="">
      <img v-show="imgName=='proving-code'" src="../../assets/img/proving-code.png" alt="">
    </div>
  </div>
</template>

<script>
import {mapMutations} from 'vuex'
import util from '@/api/util.js'
import validator from '@/api/validator.js'
export default {
  data() {
    return {
      imgName: 'proving-code',
      message: {
        status: false,
        tit: ''
      },
      fromValue: {
        userName: '',
        passWord: ''
      },
      tipsStatus: {
        userName: true,
        passWord: true
      }
    }
  },
  methods: {
    ...mapMutations(['loginVueShow','registerVueShow','userInfo']),
    blurEvent(){
      this.imgName = 'proving-code'
    },
    focusEvent(type, tips){
      this.imgName = type
      this.tipsStatus[tips] = true
    },
    tips(type){
      this.tipsStatus[type] = true
    },
    close(){
      this.loginVueShow(false)
    },
    register(){
      this.loginVueShow(false)
      this.registerVueShow(true)
    },
    login(){
      this.message.status = false
      this.tipsStatus = validator(this.fromValue)
      if(!util.isEmpty(this.tipsStatus)){return}
      this.myAjax.userLogin({
        userName: this.fromValue.userName,
        passWord: this.fromValue.passWord
      }).then((data) => {
        if(data.status){
          this.userInfo(data.data)
          this.loginVueShow(false)
        }else{
          this.message.status = true
          this.message.tit = data.message
        }
      })

    }
  }
}
</script>

<style scoped lang="scss">
.login-wrap{
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  background: rgba(0, 0, 0, .2);
  z-index: 10;
  .main{
    width: 290px;
    height: 250px;
    background: #fff;
    border-radius: 2px;
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;
    padding: 30px;
    .title{
      height: 30px;
      line-height: 30px;
      padding-bottom: 22px;
      span{
        float: left;
        font-size: 18px;
        color: #333;
        font-weight: bold;
      }
      .err{
        color: red;
        font-size: 14px;
        font-weight: normal;
      }
      i{
        cursor: pointer;
        float: right;
        background: url(../../assets/img/close.png);
        display: inline-block;
        width: 16px;
        height: 16px;
        background-size: 16px;
        transition: transform 0.3s ease 0s;
        &:hover{
          transform: rotateZ(90deg);
        }
      }
    }
    .inp-wrap{
      padding-bottom: 10px;
      position: relative;
      p{
        color: red;
        font-size: 14px;
        position: absolute;
        height: 20px;
        background: #fff;
        left: 10px;
        top: 12px;
      } 
    }
    .bottom{
      padding-top: 12px;
      overflow: hidden;
      span{
        font-size: 14px;
      }
      .left{
        float: left;
        color: #8d9397;
        i{
          color: #007eff;
          cursor: pointer;
        }
      }
      .right{
        float: right;
        color: #007eff;
      }
    }
    input{
      width: 100%;
      border: #e9e9e9 1px solid;
      border-radius: 2px;
      height: 42px;
      outline: none;
      padding: 0 10px;
      box-sizing: border-box;
      font-size: 14px;
      &:focus{
        border-color: #007eff;
      }
    }
    button{
      width: 100%;
      height: 42px;
      background: #007eff;
      font-size: 14px;
      color: #fff;
      outline: none;
      border-radius: 2px;
      border: 0;
      margin-top: 6px;
      font-size: 14px;
      line-height: 42px;
    }
    img{
      position: absolute;
      width: 130px;
      left: 0;
      right: 0;
      margin: auto;
      &:nth-of-type(1){
        top: -80px;
      }
      &:nth-of-type(2){
        top: -93px;
      }      
      &:nth-of-type(3){
        top: -86px;
      }
    }
  }
}
</style>
