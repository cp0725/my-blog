<template>
  <div id="app">
    <progress-bar></progress-bar>
    <top :userBtnShow="userBtnShow"></top>
    <transition name="registerFlash">
      <register v-if="registerVueShow"></register> <!--注册-->
      <login v-if="loginVueShow"></login> <!--登陆-->
    </transition>
    <div class="router-view">
      <keep-alive>
        <router-view></router-view>
      </keep-alive>
    </div>
    <set-up></set-up>
  </div>
</template>

<script>
import {mapGetters,mapMutations} from 'vuex'
import top from './components/top/top.vue'
import progressBar from './components/top/progress.vue'
import login from './components/user/login.vue'
import register from './components/user/register.vue'
import setUp from '@/common/setUp.vue'
export default {
  data(){
    return{
      userBtnShow: false
    }
  },
  created(){
    this.getUserStatus()
  },
  computed: {
    ...mapGetters(['registerVueShow','loginVueShow'])
  },
  methods: {
    ...mapMutations(['userInfo']),
    getUserStatus(){
      this.myAjax.getStatus(
      ).then(data => {
        if(data.status){
          this.userInfo(data.data)
        }
      }).finally(() => {
        this.userBtnShow = true
      })
    }
  },
  components: {
    top, login, register, progressBar, setUp
  }  
}
</script>

<style lang="scss" scoped>
.registerFlash-enter-active,.registerFlash-leave-active{
  transition: opacity 0.3s ease 0s;
}
.registerFlash-enter,.registerFlash-leave-to{
  opacity: 0;
}
.router-view{
  width: 1000px;
  margin: 0 auto;
}
</style>
