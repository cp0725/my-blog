<template>
  <div class="new" v-if="newList.length">
    <p>
      <i class="fa fa-commenting-o"></i>
      <span class="tit">您有{{newList.length}}条新内容点击加载...</span>
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
  props: ['newList']
}
</script>

<style scoped lang="scss">
.new{
  height: 50px;
  margin-top: 10px;
  background: #fff;
  text-align: center;
  font-size: 14px;
  line-height: 50px;  
  color: #8fbdf5;
  cursor: pointer;
  &:hover{
    color: #027fff;
  }
}
</style>
