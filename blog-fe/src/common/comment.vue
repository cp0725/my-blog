<!-- comment 评价 -->
<template>
  <div class="comment" :class="type">
    <i class="ioc" v-if="type == 'square'"></i>
    <div class="publish">
      <div class="text-wrap">
        <img class="avatar" :src="userInfo.avatar" v-if="userInfo.avatar">
        <div :class="{text: true, placeholder: textHtml == ''}" ref="textDom" @input="textChange" contenteditable="true"></div>
        <button @click="comment" :class="{btn: true, not: commentBtn}" :disabled="commentBtn">评论</button>
      </div>
    </div>
    <ul class="comment-list">
      <li class="item" v-for="item in commentList">
        <img class="avatar" :src="item.user.avatar">
        <div class="wrap">
          <p class="title">
            <span class="name">{{item.user.nickName}}</span>
            <span class="time">{{getTimeInterval(item.date)}}</span>
          </p>
          <p class="text">{{item.text}}</p>
        </div>
      </li>
    </ul>

    <p class="mark" v-if="item.comments && item.comments.length > 0 && openCommentStatus && type == 'article' && item.comments.length != commentList.length" @click="getComment">
      展开评论
      <i class="fa fa-angle-double-down"></i> 
    </p>
    <p class="mark" v-if="item.comments && item.comments.length == 0 && commentList.length == 0 && type == 'article'" style="cursor: default;">
      快来发表第一条评论吧
      <i class="fa fa-commenting-o"></i>
    </p>

    <div :class="{spin: true, articleSpin: type == 'article'}" v-if="commentSpin">
      <i class="fa fa-spinner fa-spin"></i>
    </div>
  </div>
</template>

<script>
import {mapGetters,mapMutations} from 'vuex'
import util from '@/api/util.js'
export default {
  data() {
    return {
      textHtml: '',
      commentList: [],
      commentSpin: false,
      commentStatus: true,
      openCommentStatus: true
    }
  },
  mounted() {
    // 文章点击加载评论 广场默认加载评论
    if(this.type == 'article') return 
    this.getComment()
  },
  computed: {
    ...mapGetters(['userInfo']),
    commentBtn(){
      return this.textHtml == '' || !this.commentStatus
    }
  },
  methods: {
    ...mapMutations(['loginVueShow']),
    getComment(){
      if(this.item.comments.length == 0) return
      this.openCommentStatus = false
      this.commentSpin = true
      this.myAjax.getComment({
        // id: this.item._id,
        [this.type+'Id']: this.item._id
      }).then(data => {
        this.commentList = data.data
      }).finally(data => {
        this.commentSpin = false
      })
    },
    getTimeInterval(date){
      return util.getTimeInterval(date)
    },
    textChange(){
      this.textHtml = this.$refs.textDom.innerText
    },    
    comment(){
      if(JSON.stringify(this.userInfo) == '{}' || !this.userInfo.id){
        return this.loginVueShow(true) // 用户未登陆
      }
      this.textHtml = this.textHtml.replace(/(^\s+)|(\s+$)/g, '')
      if(this.textHtml.length == 0){
        alert('请输入')
        return
      }
      this.commentStatus = false
      this.myAjax.comment({
        user: this.userInfo.id,
        text: this.textHtml,
        [this.type+'Id']: this.item._id
      }).then(data => {
        this.textHtml = ''
        this.$refs.textDom.innerText = ''
        this.commentList.unshift(data.data)
        this.$emit('pushComment', this.item)
      }).finally(data => {
        this.commentStatus = true
      })
    }
  },
  props: ['item','type']
}
</script>

<style scoped lang="scss">
.comment{
  border-top: 1px solid #ebebeb;
  padding: 0 20px 6px 20px;
}
.article{
  border-top: 1px #ebebeb dashed;
  .publish{
    margin-top: 30px;
  }
}
.ioc{
  width: 10px;
  height: 10px;
  float: right;
  border-left: 1px solid #d9dee0;
  border-top: 1px solid #d9dee0;
  transform: rotateZ(45deg) translateY(101px) translateX(-110px);
  background: #fff;
}
.publish{
  background-color: #fafbfc;
  padding: 16px;
  margin-top: 16px;
  border-radius: 5px;
  .text-wrap{
    display: flex;
    .avatar{
      width: 50px;
      height: 50px;
      border-radius: 26px;
      margin-right: 10px;
    }
    .text{
      width: 200px;
      min-height: 50px;
      background: #fff;
      outline: none;
      flex: 1;
      border: #e5e6e7 1px solid;
      border-radius: 2px;
      padding: 6px;
      box-sizing: border-box;
      font-size: 14px;
      &:focus{
        border-color: #0371df;
      }
      &.placeholder{
        &::after{
          font-size: 14px;
          content: '发布评论...';
          color: #9ea0a1;
        }        
      }
    }
    .btn{
      width: 62px;
      height: 32px;
      font-size: 14px;
      color: #fff;
      background-color: #027fff;
      border: 0;
      border-radius: 2px;
      cursor: pointer;
      outline: none;
      margin-left: 10px;
      &.not{
        background: #8fbdf5;
        color: #fff;
        cursor: default;
        &:hover{
          background: #8fbdf5;
        }
      }
      &:hover{
        background: #0371df;
      }
    }
  }
}
.comment-list{
  padding-top: 10px;
  .item{
    display: flex;
    padding: 6px 50px;
    .avatar{
      width: 38px;
      height: 38px;
      border-radius: 26px;
      margin-right: 10px;      
    }
    .wrap{
      flex: 1;
      font-size: 12px;
      .name{
        color: #333;
        font-size: 14px;
      }
      .time{
        color: #8a9aa9;
        margin-left: 2px;
      }
      .text{
        padding: 6px 0 10px 0;
        color: #505050;
        border-bottom: 1px solid #f1f1f1;
      }
    }
    &:last-of-type .text{
      border: 0;
    }
  }
}
.mark{
  color: #909090;
  text-align: center;
  cursor: pointer;
  line-height: 50px;
  padding-bottom: 8px;
}
.spin{
  text-align: center;
  color: #c4c5c5;
  font-size: 20px;
  padding-bottom: 8px;
}
.articleSpin{
  line-height: 50px;
  height: 50px;
}
</style>
