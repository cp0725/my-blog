<template>
  <div class="header">
    <div class="header-main">
      <img src="../../assets/img/logo.png" alt="船长的博客">
      <div class="nav-wrap">
        <router-link to="/home" class="nav-tab">首页</router-link>
        <router-link to="/article" class="nav-tab">文章</router-link>
        <router-link to="/square" class="nav-tab">广场</router-link>
        <!-- <router-link to="/words" class="nav-tab">留言</router-link> -->
        <!-- <router-link to="/about" class="nav-tab">关于本站</router-link> -->
      </div>
      <ul v-show="userBtnShow">
        <li v-if="!userInfo.userName" @click="loginVueShow(true)">登陆</li>
        <li v-if="!userInfo.userName" @click="registerVueShow(true)">注册</li>
        <li v-if="userInfo.userName">
          <img :src="userInfo.avatar" class="avatar">
          <span>{{userInfo.nickName}}</span>
        </li>
        <li v-if="userInfo.userName" @click="userReturn">退出</li>
      </ul>
    </div>
  </div>
</template>

<script>
import {mapGetters,mapMutations} from 'vuex'
export default {
  data() {
    return {
    }
  },
  created() {

  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  methods: {
    ...mapMutations(['loginVueShow','registerVueShow']),
    userReturn(){ // 退出
      this.myAjax.userReturn({
        userName: this.userInfo.userName,
        id: this.userInfo.id
      }).then(data => {
        if(data.status){
          location.reload()
        }
      })
    }
  },
  components: {

  },
	props: ['userBtnShow']
}
</script>

<style lang="scss" scoped>
.header{
  height: 60px;
  background: #fff;
  border-bottom: 1px solid #f1f1f1;
  .header-main{
    width: 1000px;
    margin: 0 auto;
    height: 60px;
    display: flex;
    justify-content: space-between;
    img{
      margin-top: 12px;
      height: 36px;
    }
    span{
      margin-left: 10px;
    }
    .nav-wrap{
      line-height: 60px;
      flex-grow: 1;
      .nav-tab{
        color: #71777c;
        padding: 0 20px;
      }
      .router-link-active{
        color: #0371df;
      }
      &:hover{
        color: #0371df;
      }
    }
    ul{
      display: flex;
      li{
        color: #0371df;
        font-size: 16px;
        display: flex;
        align-items: center;
        cursor: pointer;
      }
      li:nth-of-type(1)::after{
        content: '';
        width: 1px;
        height: 16px;
        background: #d5d6dc;
        margin: 0 10px;
      }
      li:nth-of-type(1) img{
        margin: 0;
        width: 38px;
        height: 38px;
        border-radius: 19px;
      }
    }
  }
}
</style>