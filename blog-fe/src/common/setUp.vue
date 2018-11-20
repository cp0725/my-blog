<template>
  <div class="set-up" @click="setUp"> <!-- v-show="scrollTop > 50" -->
    <i class="fa fa-caret-up"></i>
  </div>
</template>

<script>
export default {
  name: 'setUp',
  data() {
    return {
      scrollTop: 0
    }
  },
  created() {
    window._dc.$on('listenScroll', event => {
      this.scrollTop = document.documentElement.scrollTop
      // console.log(this.scrollTop)
    })
  },
  methods: {
    setUp(){
      document.documentElement.scrollTop = 0
    }
  },
  components: {

  }
}
</script>

<style scoped lang="scss">
.set-up{
  width: 50px;
  height: 50px;
  border-radius: 50%;
  position: fixed;
  bottom: 30px;
  right: 30px;
  background: #027fff;
  text-align: center;
  line-height: 50px;
  color: #fff;
  font-size: 20px;
  cursor: pointer;
  &:hover{
    background: #0371df;
  }
}

</style>
