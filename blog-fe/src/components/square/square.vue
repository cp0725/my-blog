<!-- square广场 -->
<template>
  <div class="square">
    <release @pushData="pushData"></release>
    <new-message @click.native="addNewSquare" :newList="newList"></new-message>
    <ul>
      <square-item v-for="item in dataList" :item="item" :key="item._id"></square-item>
    </ul>
    <bottom-loading :loadingStatus="loadingStatus" ref="loadModular"></bottom-loading>
  </div>
</template>

<script>
import KEY from '@/api/keys'
import release from './release'
import squareItem from './squareItem'
import bottomLoading from '@/common/bottomLoading.vue'
import newMessage from '@/common/newMessage.vue'
export default {
  data() {
    return {
      dataList: [],
      newList: [],
      loadingStatus: true,
      requestEnd: true
    }
  },
  created() {
    this.getData()
  },
  activated(){ // keep-alive组件钩子
    this.listenScroll()
  },
  deactivated(){ // keep-alive组件钩子
    window._dc.$off('listenScroll')
  },
  methods: {
    listenScroll(){
      const loadingDom = this.$refs.loadModular.$refs.loading
      window._dc.$on('listenScroll', event => {
        const H = loadingDom.offsetTop  -  document.documentElement.scrollTop - window.innerHeight + loadingDom.clientHeight
        if(H < 10 && this.requestEnd && this.loadingStatus){
          this.getData()
        }
      })
    },
    getData(){
      this.requestEnd = false
      const length = this.dataList.length
      this.myAjax.squareGetData({
        size: KEY.pageConfig.size,
        startDate: length == 0 ? false : this.dataList[0].date,
        endDate: length == 0 ? false : this.dataList[length -1].date
      }).then(data => {
        if(data.status){
          this.loadingStatus = data.data.length == KEY.pageConfig.size
          this.dataList = this.dataList.concat(data.data)
          this.newList = data.new
        }
      }).finally(data => {
        this.requestEnd = true
      })
    },
    pushData(value){
      this.dataList.unshift(value.data)
    },
    addNewSquare(){
      this.newList.reverse().map(item => this.dataList.unshift(item))
      this.newList = []
    }
  },
  components: {
    release, 
    squareItem,
    bottomLoading,
    newMessage
  }
}
</script>

<style scoped lang="scss">
.square{
  width: 700px;
}
</style>