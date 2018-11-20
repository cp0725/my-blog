<template>
  <div class="loading" ref="loading">
    <p v-if="loadingStatus">
      <i class="fa fa-spinner fa-spin"></i>
      <span class="tit">请稍后...</span>
    </p>
    <p v-else>
      <b class="line"></b>
      <span class="tit">就这么多了</span>
      <b class="line"></b>
    </p>
  </div>
</template>

<script>
export default {
  data() {
    return {

    }
  },
  created() {

  },
  mounted() {

  },
  methods: {

  },
  components: {

  },
  props: ['loadingStatus']
}
</script>

<style scoped lang="scss">
.loading{
  height: 60px;
  margin-top: 10px;
  background: #fff;
  text-align: center;
  color: #c4c5c5;
  font-size: 20px;
  line-height: 60px;
  .fa{
    color: #027fff;
  }
  .tit{
    font-size: 14px;
  }
  .line{
    display: inline-block;
    width: 150px;
    border-top: #c4c5c5 solid 1px;
    padding-bottom: 4px;
  }
}
</style>
