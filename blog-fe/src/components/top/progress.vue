<!-- 进度条 -->
<template>
  <div class="progress">
    <div class="bar" :style="{width: progressWidth,opacity: progressShow}"></div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      progressWidth: '0%',
      progressShow: 0
    }
  },
  created() {
    window.progressVue = this
    
  },
  mounted() {

  },
  methods: {

  },
  components: {

  }
}
</script>

<style scoped lang="scss">
.progress{
  height: 3px;
  width: 100%;
  position: fixed;
  top: 0px;
  left: 0px;
  z-index: 10;
  .bar{
    transition: width .5s ease 0s;
    height: 3px;
    border-radius: 2px;
    background: #007fff;
  }
}
</style>
