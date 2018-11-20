<!-- 添加文章 -->
<template>
  <div class="add" @click="add">
    <i class="fa fa-pencil"></i>
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
  methods: {
    add(){
      this.$router.push('/markdownEdit')
    }
  },
  components: {

  }
}
</script>

<style scoped lang="scss">
.add{
  width: 50px;
  height: 50px;
  border-radius: 50%;
  position: fixed;
  bottom: 96px;
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