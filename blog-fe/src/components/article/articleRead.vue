<template>
  <div class="article-read">
    <div class="title-wrap">
      <h1 class="tit">{{info.title}}</h1>
      <div class="author">
        <div class="portrait">
          <img :src="info.user ? info.user.avatar : ''">
        </div>
        <div class="info">
          <p class="name">{{info.user ? info.user.nickName : ''}}</p>
          <p class="time">
            <span>{{getTimeFormat(info.date)}}</span>
            <span>字数 {{fileLength}}</span>
            <span>阅读 {{info.read}}</span>
            <span>评论 {{info.comments ? info.comments.length : 0}}</span>
            <span>点赞 {{likesNum}}</span>
          </p>
        </div>
      </div>
    </div>
    <div ref="file" class="md-style" v-html="file"></div>
    <div class="praise-wrap">
      <p @click="praise">
        <i v-if="likeLoad" class="fa fa-spinner fa-spin"></i>
        <i v-if="likesNum == 0 && !likeLoad" class="fa fa-thumbs-o-up"></i>
        <i v-if="likesNum != 0 && !likeLoad">{{likesNum}}</i>
        <span>{{myLike ? '已赞' : '点赞'}}</span>
      </p>
    </div>
    <comment @pushComment="pushComment" :item="info" type="article"></comment>
  </div>
</template>

<script>
import {mapGetters,mapMutations} from 'vuex'
import util from '@/api/util.js'
import comment from '@/common/comment'
import {mavonEditor} from 'mavon-editor'
const MDit = mavonEditor.getMarkdownIt()
export default {
  data() {
    return {
      file: '',
      info: {},
      fileLength: 0,
      likeLoad: false
    }
  },
  beforeRouteEnter(to, from, next){
    next(vm => {
      vm.getArticle(to.params.id)
    })
  },  
  created() {

  },
  mounted() {

  },
  computed: {
    ...mapGetters(['userInfo']),
    likesNum(){
      return this.info.likes ? this.info.likes.length : 0
    },
    myLike(){
      if(!this.info.likes) return
      let status = false
      this.info.likes.map(item => {
        if(item == this.userInfo.id){
          status = true
        }
      })
      return status
    }
  },
  methods: {
    ...mapMutations(['loginVueShow']),
    getTimeFormat(date){
      return util.getTimeFormat(date)
    },
    getArticle(id){
      this.myAjax.getArticleInfo({
        id
      }).then(data => {
        this.info = data.data._doc || {}
        this.file = MDit.render(data.data.file)
        this.$nextTick(() => {
          this.fileLength = this.$refs.file.innerText.length
        })
      })
    },
    pushComment(){
      this.info.comments.push(this.userInfo.id)
    },
    praise(){
      if(JSON.stringify(this.userInfo) == '{}' || !this.userInfo.id){
        return this.loginVueShow(true) // 用户未登陆
      }
      if(this.likeLoad) return
      this.likeLoad = true
      this.myAjax.articleLikes({
        articleId: this.info._id
      }).then(data => {
        if(data.status){
          this.info.likes = data.likes
        }
      }).finally(data => {
        this.likeLoad = false
      })
    }
  },
  components: {
    comment
  }
}
</script>

<style  lang="scss">
.article-read{
  background: #fff;
  padding: 20px 50px;
  margin-top: 10px;
}
.title-wrap{
  .tit{
    margin: 0;
    padding: 0;
    padding-top: 20px;
    border-bottom: 0;
    font-size: 26px;
    font-weight: bold;
    line-height: 30px;
  }
  .author{
    overflow: hidden;
    padding: 20px 0 30px 0;
    .portrait{
      float: left;
      width: 50px;
      height: 50px;
      border-radius: 30px;
      overflow: hidden;
      img{
        width: 50px;
        height: 50px;
        border-radius: 30px;        
      }
    }
    .info{
      padding: 6px 0 0 10px;
      float: left;
      .name{
        font-weight: bold;
        line-height: 20px;
      }
      .time{
        color: #909090;
        line-height: 20px;
        span{
          padding-right: 10px;
        }
      }

    }
  }
}
.praise-wrap{
  padding: 50px 0 50px 0;
  text-align: center;
  p{
    width: 60px;
    display: inline-block;
    cursor: pointer;
  }
  i{
    width: 60px;
    height: 60px;
    line-height: 60px;
    font-size: 20px;
    border-radius: 50px;
    background: #027fff;
    text-align: center;
    color: #fff;
    display: inline-block;
  }
  span{
    line-height: 30px;
    color: #909090;
  }
  p:hover{
    opacity: .9;
    i{
      // background: #0366d6;
    }
    span{
      // color: #71777c;
    }
  }
}
.md-style{  
  b,strong{
    font-weight: 600;
  }
  i, cite, em, var, address, dfn{
    font-style: italic;
  }
  p{
    margin-bottom: 16px;
  }
  h1{
    padding-bottom: .3em;
    font-size: 2em;
    border-bottom: 1px solid #eaecef;    
  }
  h2{
    padding-bottom: .3em;
    font-size: 1.5em;
    border-bottom: 1px solid #eaecef;
  }
  h3{
    font-size: 1.25em;
  }
  h4{
    font-size: 1em;
  }
  h5{
    font-size: .875em;
  }
  h6{
    font-size: .85em;
    color: #6a737d;
  }
  h1,h2,h3,h4,h5,h6{
    margin-top: 24px;
    margin-bottom: 16px;
    font-weight: 600;
    line-height: 1.25;
  }
  u, ins {
    text-decoration: underline;
  }  
  s, strike, del {
    text-decoration: line-through;
  }
  mark {
    background-color: yellow;
    color: black;
  }
  sup {
    vertical-align: super;
    font-size: smaller;
  }
  sub {
    vertical-align: sub;
    font-size: smaller;
  }
  .hljs-left {
    text-align: left;
  }
  .hljs-center {
    text-align: center;
  }
  .hljs-right {
    text-align: right;
  }
  blockquote {
    padding: 0 1em;
    color: #6a737d;
    border-left: .25em solid #dfe2e5;
    margin: 0;
  }
  blockquote,dl,ol,p,pre,table,ul {
    margin-top: 0;
    margin-bottom: 16px;
  }
  ol,ul{
    padding-left: 2em;
  }
  li+li {
    margin-top: .25em;
  }
  ol li{
    list-style: decimal;
  }
  ul li{
    list-style: disc;
  }
  a{
    color: #0366d6;
    text-decoration: none;
  }
  img {
    max-width: 100%;
    box-sizing: content-box;
    background-color: #fff;
    padding: 30px 0;
  }
  .lang-language{
    display: block;
    overflow-x: auto;
    padding: 0.5em;
    color: #333;
    background: #f8f8f8;
  }
  table {
    display: block;
    width: 100%;
    overflow: auto;
    margin-top: 0;
    margin-bottom: 16px;
    border-spacing: 0;
    border-collapse: collapse;   
  }
  thead {
    display: table-header-group;
    vertical-align: middle;
    border-color: inherit;
    th {
      font-weight: 600;
    }
  }
  tbody {
    display: table-row-group;
    vertical-align: middle;
    border-color: inherit;
  }
  tr {
    background-color: #fff;
    border-top: 1px solid #c6cbd1;
    display: table-row;
    vertical-align: inherit;
    border-color: inherit;
  }
  tr:nth-child(2n) {
    background-color: #f6f8fa;
  }
  th{
    padding: 6px 13px;
    border: 1px solid #dfe2e5;
  }
  td{
    padding: 6px 13px;
    border: 1px solid #dfe2e5;
  }
}




</style>
