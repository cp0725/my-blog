<!--注册-->
<template>
  <div class="login-wrap">
    <div class="main">
      <div class="title">
        <span v-if="!message.status">注册</span>
        <span v-else class="err">{{message.tit}}</span>
        <i @click="close"></i>
      </div>
      <div class="inp-wrap">
        <input v-model="fromValue.nickName" @blur="blurEvent" @focus="focusEvent('user-name', 'nickName')" placeholder="请输入用户名" type="text" maxlength="7">
        <p @click="tips('nickName')" v-show="!tipsStatus.nickName">用户名为2-7位任意字符</p>
      </div>      
      <div class="inp-wrap">
        <input v-model="fromValue.userName" @blur="blurEvent" @focus="focusEvent('user-name', 'userName')" placeholder="请输入手机号或邮箱" type="text" maxlength="20">
        <p @click="tips('userName')" v-show="!tipsStatus.userName">请输入正确的手机号或者电子邮箱</p>
      </div>
      <div class="inp-wrap">
        <input v-model="fromValue.verifyCode" @blur="blurEvent" @focus="focusEvent('user-name', 'verifyCode')" placeholder="请输入验证码" type="text" maxlength="6">
        <p @click="tips('verifyCode')" v-show="!tipsStatus.verifyCode">验证码为6位数字</p>
        <span class="down" v-if="downTime != 60 && downTime != 0">{{downTime}}秒后重试</span>
        <span @click="validator" v-else>获取验证码</span>
      </div>      
      <div class="inp-wrap">
        <input v-model="fromValue.passWord" @blur="blurEvent" @focus="focusEvent('pass-word', 'passWord')" placeholder="请输入密码" type="password" maxlength="12">
        <p @click="tips('passWord')" v-show="!tipsStatus.passWord">密码长度为6-12位且不含中文</p>
      </div>
      <div class="inp-wrap">
        <input v-model="fromValue.passWord2" @blur="blurEvent" @focus="focusEvent('pass-word', 'passWord2')" placeholder="请确认密码" type="password" maxlength="12">
        <p @click="tips('passWord2')" v-show="!tipsStatus.passWord2">两次密码输入不一致</p>     
      </div>
      <div class="btn-wrap">
        <button @click="register">注册</button>
      </div>
      <div class="bottom">
        <span @click="login">已有账号请登录</span>
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
import keys from '@/api/keys.js';
export default {
  data() {
    return {
      imgName: 'proving-code',
      message: {
        status: false,
        tit: ''
      },
      fromValue: {
        nickName: '',
        userName: '',
        verifyCode: '',
        passWord: '',
        passWord2: ''
      },
      tipsStatus: {
        nickName: true,
        userName: true,
        verifyCode: true,
        passWord: true,
        passWord2: true
      },
      downTime: 60
    }
  },
  methods: {
    ...mapMutations(['registerVueShow','loginVueShow','userInfo']),
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
      this.registerVueShow(false)
    },
    login(){
      this.registerVueShow(false)
      this.loginVueShow(true)
    },
    countDown(){
      this.downTime = 60
      const T = setInterval(() => {
        this.downTime -= 1
        if(this.downTime <= 0){
          clearInterval(T)
        }
      }, 1000)
    },
    validator(){
      this.message.status = false
      this.tipsStatus.userName = validator({userName: this.fromValue.userName}).userName
      if(!this.tipsStatus.userName){return}
      this.myAjax.verificationCode({
        userName: this.fromValue.userName
      }).then(data => {
        if(data.status){
          this.countDown()
        }else{
          this.message.status = true
          this.message.tit = data.message          
        }
      })
    }, 
    register(){
      this.message.status = false
      this.tipsStatus = validator(this.fromValue)
      if(!util.isEmpty(this.tipsStatus)){return}
      this.myAjax.userRegister({
        nickName: this.fromValue.nickName,
        userName: this.fromValue.userName,
        verifyCode: this.fromValue.verifyCode,
        passWord: this.fromValue.passWord,
        avatar: keys.avatar()
      }).then((data) => {
        if(data.status){
          this.userInfo(data.data)
          this.registerVueShow(false)
        }else{
          this.message.status = true
          this.message.tit = data.message
        }
      })
    }
  },
  components: {

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
    height: 390px;
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
      span{
        position: absolute;
        right: 10px;
        top: 12px;
        font-size: 14px;
        height: 14px;
        color: #007eff;
        cursor: pointer;
      }
      .down{
        color: #ccc;
        cursor: text;
      }
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
      font-size: 14px;
      text-align: center;
      color: #007eff;
      cursor: pointer;
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
