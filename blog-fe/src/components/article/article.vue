<!-- Article 文章 -->
<template>
  <div class="article">    
    <new-message @click.native="addNewArticle" :newList="newList"></new-message>
    <ul>
      <article-item v-for="item in dataList" :key="item._id" :item="item"></article-item>
    </ul>
    <bottom-loading :loadingStatus="loadingStatus" ref="loadModular"></bottom-loading>
    <add-article></add-article>
  </div>
</template>

<script>
import KEY from '@/api/keys'
import articleItem from './articleItem.vue'
import bottomLoading from '@/common/bottomLoading.vue'
import newMessage from '@/common/newMessage.vue'
import addArticle from './addArticle.vue'
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
      this.myAjax.getArticleData({
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
    addNewArticle(){
      this.newList.reverse().map(item => this.dataList.unshift(item))
      this.newList = []
    }
  },
  components: {
    articleItem,
    bottomLoading,
    newMessage,
    addArticle
  }
}
</script>

<style scoped lang="scss">
.article{
  width: 700px;
}
</style>
