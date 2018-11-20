<template>
  <li class="article-wrap">
    <div class="img-wrap" v-if="item.image" @click="openArticle">
      <img class="img" :src="item.image">
    </div>
    <div class="text-wrap">
      <h1 class="title" @click="openArticle">{{item.title}}</h1>
      <p class="text-main" @click="openArticle">{{item.text}}</p>
      <div class="user-wrap">
        <div class="laud">
          <span v-if="likeLoad" class="likeLoad">
            <i class="fa fa-spinner fa-spin"></i>
          </span>
          <span @click="like" v-else :class="{own: myLike()}">
            <i  class="fa fa-thumbs-o-up"></i>
            <b>{{item.likes && item.likes.length || '点赞'}}</b>
          </span>
          <span @click="comment">
            <i class="fa fa-commenting-o"></i>
            <b>{{item.comments && item.comments.length || '评论'}}</b>
          </span>
          <span @click="read">
            <i class="fa fa-eye"></i>
            <b>{{item.read || '阅读量'}}</b>
          </span>
        </div>
        <div class="portrait">
          <span>{{getTimeInterval(item.date)}}</span>
          <span class="interval">·</span>
          <span>{{item.user.nickName}}</span>
          <img class="img" :src="item.user.avatar">
        </div>
      </div>
    </div>
  </li>
</template>

<script>
import {mapGetters,mapMutations} from 'vuex'
import util from '@/api/util.js'

export default {
  data() {
    return {
      likeLoad: false
    }
  },
  created() {
  },
  mounted() {

  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  methods: {
    ...mapMutations(['loginVueShow']),
    getTimeInterval(){
      return util.getTimeInterval(this.item.date)
    },
    myLike(){
      return this.item.likes.filter(item => item == this.userInfo.id).length
    },
    like(){
      if(JSON.stringify(this.userInfo) == '{}' || !this.userInfo.id){
        return this.loginVueShow(true) // 用户未登陆
      }
      this.likeLoad = true
      this.myAjax.articleLikes({
        articleId: this.item._id
      }).then(data => {
        if(data.status){
          this.item.likes = data.likes
        }
      }).finally(data => {
        this.likeLoad = false
      })
    },
    comment(){
      this.openArticle()
    },
    read(){
      this.openArticle()
    },
    openArticle(){
      // 新窗口打开
      this.$router.push('/articleRead/' + this.item._id) 
      // push({router:, params:})
    }
  },
  components: {


  },
  props: ['item']
}
</script>

<style scoped lang="scss">
.article-wrap{
  display: flex;
  height: 138px;
  margin-top: 16px;
  padding: 20px;
  background: #fff;
  box-shadow: 0 1px 2px 0 rgba(0,0,0,.05);
}
.img-wrap{
  display: flex;
  height: 100%;
  width: 200px;
  margin-right: 16px;
  overflow: hidden;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  .img{
    max-height: 100%;
  }
}
.text-wrap{
  display: flex;
  flex-direction: column;
  justify-content: space-between; 
  .title{
    font-size: 18px;
    font-weight: 600;
    color: #333;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    /*! autoprefixer: off */
    -webkit-box-orient: vertical;
    /* autoprefixer: on */
    cursor: pointer;
  }
  .text-main{
    overflow: hidden;
    font-size: 13px;
    line-height: 20px;
    color: #999;
    text-overflow: ellipsis;
    letter-spacing: 1px;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    /*! autoprefixer: off */
    -webkit-box-orient: vertical;
    /* autoprefixer: on */
    cursor: pointer;
  }
  .user-wrap{
    display: flex;
    justify-content: space-between; 
    color: #8a9aa9;
    .laud{
      display: flex;
      align-items: center;
      span{
        cursor: pointer;
        display: inline-block;
        margin-right: 20px;
        min-width: 30px;
        &:hover{
          color: #bcbec1;
        }
      }
      .own{
        color: #007fff;
        &:hover{
          color: #3c9af9;
        }
      }
      .likeLoad{
        cursor: default;
      }
    }
    .portrait{
      display: flex;
      align-items: center;
      color: #8a9aa9;
      .img{
        width: 30px;
        height: 30px;
        border-radius: 20px;
        margin-left: 3px;
      }
      .interval{
        font-size: 20px;
      }
      span{
        margin-right: 6px;
      }
    }
  }
}

</style>