<!-- 动态 -->
<template>
  <li class="square-wrap">
    <div class="portrait-title" ref="scrollToDom">
      <img :src="item.user ? item.user.avatar : ''">
      <div>
        <p class="name">{{item.user ? item.user.nickName : '你猜我是谁'}}</p>
        <p class="time">{{getTimeInterval()}}</p>
      </div>
    </div>
    <div class="min-text">
      <p v-html="text.length < 100 || textOpen ? text : hiddenText"></p>
      <span v-if="text.length > 100 && !textOpen" @click="textToggle(true)">展开</span>
      <span v-if="textOpen" @click="textToggle(false)">收起</span>
      <ul class="link" v-if="item.links && item.links.length">
        <a v-for="linkItem in item.links" :href="linkItem.link" target="_blank">
          <li>
            <div class="img">
              <img v-if="linkItem.images && linkItem.images.length > 0" :src="linkItem.images[0].link">
              <i v-else class="fa fa-link"></i>
            </div>
            <div class="text">
              <p class="tit">{{linkItem.title}}</p>
              <p class="src">{{linkItem.link}}</p>
            </div>
          </li>
        </a>
      </ul>
    </div>
    <div v-if="imgOpen === false" v-show="item.images.length" :class="`img-wrap child${item.images.length}`">
      <div v-for="(img, index) in item.images">
        <img :src="img.preview" @click="imgOpenEvent(index)">
      </div>
    </div>
    <div v-else class="img-open">
      <div class="action-bar">
        <span @click="imgOpenEvent(false)">
          <i class="fa fa-search-minus"></i>
          缩小
        </span>
        <span :class="{stop: imgOpen == 0}" @click="pageTurning(-1)">
          <i class="fa fa-angle-left"></i>
          上一张
        </span>
        <span :class="{stop: imgOpen == item.images.length-1}" @click="pageTurning(1)">
          <i class="fa fa-angle-right"></i>
          下一张
        </span>
        <span @click="rotate(-90)">
          <i class="fa fa-undo"></i>
          向左旋转
        </span>
        <span @click="rotate(90)">
          <i class="fa fa-repeat"></i>
          向右旋转
        </span>
      </div>
      <div class="exhibition">
        <img :style="getImgStyle" :src="item.images[imgOpen].watermark" @click="imgOpenEvent(false)">
        <div class="left-btn" v-show="imgOpen != 0" @click="pageTurning(-1)"></div>
        <div class="right-btn" v-show="imgOpen != item.images.length-1" @click="pageTurning(1)"></div>
      </div>
      <div class="select">
        <div v-for="(img, index) in item.images" :class="{now: index == imgOpen}">
          <img :src="img.preview" @click="imgOpenEvent(index)">
        </div>
      </div>
    </div>
    <div class="bottom-wrap">
      <p @click="like" :class="{own: myLike(), likeLoad: likeLoad}">
        <i v-if="likeLoad" class="fa fa-spinner fa-spin"></i>
        <span v-else>
          <i v-if="myLike()" class="fa fa-thumbs-up"></i>
          <i v-else class="fa fa-thumbs-o-up"></i>
          <b v-if="item.likes.length">{{item.likes.length}}</b>
          <b v-else>点赞</b>
        </span>
      </p>
      <p @click="comment">
        <i class="fa fa-commenting-o"></i>
        <b v-if="item.comments.length">{{item.comments.length}}</b>
        <b v-else>评论</b>
      </p>
    </div>
    <comment v-if="commentShow" :item="item" type="square" @pushComment="pushComment"></comment>
  </li>
</template>

<script>
import {mapGetters,mapMutations} from 'vuex'
import util from '@/api/util.js'
import comment from '@/common/comment'
export default {
  data() {
    return {
      commentShow: false,
      textOpen: false,
      imgOpen: false,
      likeLoad: false,
      deg: 0
    }
  },
  computed: {
    ...mapGetters(['userInfo']),
    text(){
      return this.item.text.replace(/\r?\n/g, '<br/>')
    },
    hiddenText(){
      const html = this.item.text.replace(/\r?\n/g, '<br/>')
      return html.slice(0,100) + '...'
    },
    getImgStyle(){
      const imgStyle = {}
      const imgInfo = this.item.images[this.imgOpen]
      imgStyle.transform = `rotateZ(${this.deg}deg)`
      if(imgInfo.width < 594 && (Math.abs(this.deg) == 0 || Math.abs(this.deg) == 180)){
        imgStyle.width = `${imgInfo.width}px` 
        imgStyle.height = `${imgInfo.height}px`
      }
      if(imgInfo.width < 594 && (Math.abs(this.deg) == 90 || Math.abs(this.deg) == 270)){
        imgStyle.width =  `${imgInfo.height}px`
        imgStyle.height = `${imgInfo.width}px`
      }
      if(imgInfo.width > 594 && (Math.abs(this.deg) == 0 || Math.abs(this.deg) == 180)){
        imgStyle.width = `594px`
        imgStyle.height = `${594/imgInfo.width*imgInfo.height}px`
      }
      if(imgInfo.width > 594 && (Math.abs(this.deg) == 90 || Math.abs(this.deg) == 270)){
        imgStyle.width = `${594/imgInfo.height*imgInfo.width}px`
        imgStyle.height = `594px`
      }
      
      console.log(imgInfo,imgStyle)
      return imgStyle
    }
  },
  methods: {
    ...mapMutations(['loginVueShow']),
    getTimeInterval(){
      return util.getTimeInterval(this.item.date)
    },
    textToggle(status){
      this.textOpen = status
      if(!status){
        this.setScrollTo()
      }
    },
    imgOpenEvent(index){
      this.imgOpen = index
      this.setScrollTo()
    },
    pageTurning(n){
      if(this.item.images[this.imgOpen + n]){
        this.imgOpen += n
        this.setScrollTo()
      }
    },
    setScrollTo(){
      const dom = this.$refs.scrollToDom
      const Y = dom.offsetTop + dom.offsetHeight
      const status = dom.offsetTop + dom.offsetHeight < window.scrollY
      if(status){
        window.scrollTo(0, Y)
      }
    },
    rotate(deg){ // 旋转
      this.deg = this.deg + deg == 360 || this.deg + deg == -360  ? 0 : this.deg + deg
      console.log(this.deg)
    },
    like(){ // 点赞 & 取消点赞
      if(JSON.stringify(this.userInfo) == '{}' || !this.userInfo.id){
        return this.loginVueShow(true) // 用户未登陆
      }
      if(this.likeLoad){
        return
      }
      this.likeLoad = true
      this.myAjax.squareLikes({
        squareId: this.item._id
      }).then(data => {
        if(data.status){
          this.item.likes = data.likes
        }
      }).finally(data => {
        this.likeLoad = false
      })
    },
    myLike(){
      return this.item.likes.filter(item => item == this.userInfo.id).length
    },
    comment(){
      this.commentShow = !this.commentShow
    },
    pushComment(){
      this.item.comments.push(this.userInfo.id)
    }
  },
  props: ['item'],
  components: {
    comment
  }
}
</script>

<style scoped lang="scss">
$base64RIGHT: 'data:application/octet-stream;base64,AAABAAEAEBwAAAEAIACYBwAAFgAAACgAAAAQAAAAOAAAAAEAIAAAAAAAAAcAABILAAASCwAAAAAAAAAAAAAAAAAG+fn5hfX19YEAAAAKAAAACQAAAAcAAAAFAAAAAwAAAAIAAAABAAAAAQAAAAEAAAAAAAAAAAAAAAAAAAAA+fn5gv//////////9fX1gwAAAAsAAAAJAAAABwAAAAUAAAADAAAAAgAAAAEAAAABAAAAAQAAAAAAAAAAAAAAAP39/YL////////////////19fWEAAAACwAAAAkAAAAHAAAABQAAAAMAAAACAAAAAQAAAAEAAAABAAAAAAAAAAAAAAAD+/v7gv////////////////X19YUAAAALAAAACQAAAAcAAAAFAAAAAwAAAAIAAAABAAAAAQAAAAEAAAAAAAAAAgAAAAP7+/uA////////////////9vb2hwAAAAsAAAAJAAAABwAAAAUAAAADAAAAAgAAAAEAAAABAAAAAQAAAAEAAAACAAAAA/v7+3/////////////////29vaIAAAACwAAAAkAAAAHAAAABQAAAAMAAAACAAAAAQAAAAEAAAABAAAAAQAAAAIAAAAD+/v7fv////////////////b29okAAAALAAAACQAAAAcAAAAFAAAAAwAAAAIAAAABAAAAAQAAAAEAAAABAAAAAgAAAAP7+/t8////////////////9vb2iwAAAAsAAAAJAAAABwAAAAUAAAADAAAAAgAAAAAAAAABAAAAAQAAAAEAAAACAAAAA/v7+3v////////////////29vaMAAAACwAAAAkAAAAHAAAABQAAAAMAAAAAAAAAAAAAAAEAAAABAAAAAQAAAAIAAAAD+/v7ev////////////////b29o0AAAALAAAACQAAAAcAAAAFAAAAAAAAAAAAAAAAAAAAAQAAAAEAAAABAAAAAgAAAAP7+/t4////////////////9vb2jwAAAAsAAAAJAAAABgAAAAAAAAAAAAAAAAAAAAAAAAABAAAAAQAAAAEAAAACAAAABPn5+Xj////////////////29vaQAAAACgAAAAcAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAEAAAABAAAAAgAAAAQAAAAH9PT0ef////////////////j4+JAAAAAHAAAAAAAAAAAAAAAAAAAAAQAAAAEAAAABAAAAAgAAAAMAAAAFAAAACAAAAAry8vJ5////////////////+/v7jwAAAAAAAAAAAAAAAQAAAAEAAAABAAAAAgAAAAMAAAAFAAAABwAAAAkAAAAL9vb2iv////////////////v7+3QAAAAAAAAAAQAAAAEAAAABAAAAAgAAAAMAAAAFAAAABwAAAAkAAAAL9vb2iP////////////////v7+3cAAAADAAAAAQAAAAEAAAABAAAAAgAAAAMAAAAFAAAABwAAAAkAAAAL9fX1hf////////////////v7+3oAAAADAAAAAgAAAAEAAAABAAAAAgAAAAMAAAAFAAAABwAAAAkAAAAL9fX1gv////////////////v7+30AAAADAAAAAgAAAAEAAAABAAAAAgAAAAMAAAAFAAAABwAAAAkAAAAL9fX1f/////////////////v7+4AAAAADAAAAAgAAAAEAAAABAAAAAgAAAAMAAAAFAAAABwAAAAkAAAAL9fX1fP////////////////v7+4MAAAADAAAAAgAAAAEAAAABAAAAAQAAAAMAAAAFAAAABwAAAAkAAAAL9PT0ef////////////////v7+4YAAAADAAAAAgAAAAEAAAABAAAAAQAAAAAAAAAEAAAABgAAAAkAAAAK8vLyd/////////////////v7+4kAAAADAAAAAgAAAAEAAAABAAAAAQAAAAAAAAAAAAAABQAAAAgAAAAK8vLydf////////////////v7+4sAAAADAAAAAgAAAAEAAAABAAAAAQAAAAAAAAAAAAAAAAAAAAYAAAAI9PT0cf////////////////v7+44AAAADAAAAAgAAAAEAAAABAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAF9vb2bf////////////////v7+5EAAAADAAAAAgAAAAEAAAABAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAA+vr6af////7///////////39/ZMAAAADAAAAAgAAAAEAAAABAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP39/Wr////+//////39/ZYAAAADAAAAAgAAAAEAAAABAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAC/f39aP///5aAgIACAAAAAQAAAAEAAAABAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA8AAAAHAAAAAwAAAAEAAAAAAAAAAAAAAAAAAAAAAACAAAAAwAAAAOAAAADwAAAA8AAAAOAAAADAAAAAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAMAAAAHAAAADwAAAB8AAAA/AAAAfwAAAP8AAA==';
$base64LEFT: 'data:application/octet-stream;base64,AAABAAEAEBwAAAEAIACYBwAAFgAAACgAAAAQAAAAOAAAAAEAIAAAAAAAAAcAABILAAASCwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAEAAAABAAAAAgAAAAMAAAAFAAAABwAAAAkAAAAK9fX1gfn5+YUAAAAGAAAAAAAAAAAAAAAAAAAAAQAAAAEAAAABAAAAAgAAAAMAAAAFAAAABwAAAAkAAAAL9fX1g///////////+fn5ggAAAAAAAAAAAAAAAQAAAAEAAAABAAAAAgAAAAMAAAAFAAAABwAAAAkAAAAL9fX1hP////////////////39/YIAAAAAAAAAAQAAAAEAAAABAAAAAgAAAAMAAAAFAAAABwAAAAkAAAAL9fX1hf////////////////v7+4IAAAADAAAAAQAAAAEAAAABAAAAAgAAAAMAAAAFAAAABwAAAAkAAAAL9vb2h/////////////////v7+4AAAAADAAAAAgAAAAEAAAABAAAAAgAAAAMAAAAFAAAABwAAAAkAAAAL9vb2iP////////////////v7+38AAAADAAAAAgAAAAEAAAABAAAAAgAAAAMAAAAFAAAABwAAAAkAAAAL9vb2if////////////////v7+34AAAADAAAAAgAAAAEAAAABAAAAAgAAAAMAAAAFAAAABwAAAAkAAAAL9vb2i/////////////////v7+3wAAAADAAAAAgAAAAEAAAABAAAAAQAAAAMAAAAFAAAABwAAAAkAAAAL9vb2jP////////////////v7+3sAAAADAAAAAgAAAAEAAAABAAAAAQAAAAAAAAAFAAAABwAAAAkAAAAL9vb2jf////////////////v7+3oAAAADAAAAAgAAAAEAAAABAAAAAQAAAAAAAAAAAAAABgAAAAkAAAAL9vb2j/////////////////v7+3gAAAADAAAAAgAAAAEAAAABAAAAAQAAAAAAAAAAAAAAAAAAAAcAAAAK9vb2kP////////////////n5+XgAAAAEAAAAAgAAAAEAAAABAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAH+Pj4kP////////////////T09HkAAAAHAAAABAAAAAIAAAABAAAAAQAAAAEAAAAAAAAAAAAAAAAAAAAA+/v7j/////////////////Ly8nkAAAAKAAAACAAAAAUAAAADAAAAAgAAAAEAAAABAAAAAQAAAAAAAAAAAAAAAPv7+3T////////////////29vaKAAAACwAAAAkAAAAHAAAABQAAAAMAAAACAAAAAQAAAAEAAAABAAAAAAAAAAAAAAAD+/v7d/////////////////b29ogAAAALAAAACQAAAAcAAAAFAAAAAwAAAAIAAAABAAAAAQAAAAEAAAAAAAAAAgAAAAP7+/t6////////////////9fX1hQAAAAsAAAAJAAAABwAAAAUAAAADAAAAAgAAAAEAAAABAAAAAQAAAAEAAAACAAAAA/v7+33////////////////19fWCAAAACwAAAAkAAAAHAAAABQAAAAMAAAACAAAAAQAAAAEAAAABAAAAAQAAAAIAAAAD+/v7gP////////////////X19X8AAAALAAAACQAAAAcAAAAFAAAAAwAAAAIAAAABAAAAAQAAAAEAAAABAAAAAgAAAAP7+/uD////////////////9fX1fAAAAAsAAAAJAAAABwAAAAUAAAADAAAAAgAAAAAAAAABAAAAAQAAAAEAAAACAAAAA/v7+4b////////////////09PR5AAAACwAAAAkAAAAHAAAABQAAAAMAAAAAAAAAAAAAAAEAAAABAAAAAQAAAAIAAAAD+/v7if////////////////Ly8ncAAAAKAAAACQAAAAYAAAAEAAAAAAAAAAAAAAAAAAAAAQAAAAEAAAABAAAAAgAAAAP7+/uM////////////////8vLydQAAAAoAAAAIAAAABQAAAAAAAAAAAAAAAAAAAAAAAAABAAAAAQAAAAEAAAACAAAAA/v7+47////////////////09PRxAAAACAAAAAYAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAABAAAAAQAAAAIAAAAD+/v7kf////////////////b29m0AAAAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAEAAAABAAAAAgAAAAP9/f2T///////////////++vr6aQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAAAAQAAAAEAAAACAAAAA/39/Zb//////////v39/WkAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAABAAAAAQAAAAGAgIAC////lv39/WgAAAAC8AAAAOAAAADAAAAAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAMAAAAHAAAADwAAAA8AAAAHAAAAAwAAAAEAAAAAAAAAAAAAAAAAAAAAAACAAAAAwAAAAOAAAADwAAAA+AAAAPwAAAD+AAAA/wAAAA==';
.square-wrap{
  margin-top: 10px;
  padding: 16px 0 0 0;
  background: #fff;
  box-shadow: 0 1px 2px 0 rgba(0,0,0,.05);
}
.portrait-title{
  overflow: hidden;
  padding: 0 20px;
  img{
    height: 50px;
    width: 50px;
    border-radius: 50%;
    float: left;
    background: url(../../assets/img/ioc.png);
    user-select: none;
  }
  div{
    padding-left: 16px;
    float: left;
    line-height: 20px;
    .name{
      padding-top: 5px;
      font-size: 14px;
      font-weight: 600;
      color: #2e3135;
    }
    .time{
      color: #8a9aa9;
      font-size: 14px;
    }
  }
}
.min-text{
  padding: 0 20px 3px 86px;
  p{
    font-size: 14px;
    line-height: 24px;
    color: #17181a;
    white-space: pre-wrap;
    &.open{
      overflow:hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      /*! autoprefixer: off */
      -webkit-box-orient: vertical;
      /* autoprefixer: on */
    }
  }
  .link{
    display: flex;
    flex-wrap: wrap;
    cursor: pointer;
    padding: 6px 0 2px 0;
    a{
      margin-left: 6px;
      flex: 1;
      &:first-of-type{
        margin-left: 0;    
      }
    }
    li{
      box-sizing: border-box;
      min-width: 180px;
      height: 62px;
      border: 1px solid #ebebeb;
      border-radius: 2px;
      display: flex;
      padding: 6px;
      background: #f4f6f7;
      position: relative;
      .img{
        width: 48px;
        height: 48px;
        flex-shrink: 0;
        overflow: hidden;
        position: relative;
        border-radius: 2px;
        background: #fff;
        img{
          width: 48px;
          position: absolute;
          left: 0;
          right: 0;
          top: 0;
          bottom: 0;
          margin: auto;
          opacity: .8;
        }
        i{
          width: 48px;
          height: 48px;
          background: #027fff;
          border-radius: 2px;
          text-align: center;
          line-height: 48px;
          color: #fff;
          font-size: 22px;
        }
      }
      .text{
        flex-shrink: 1;
        flex: 1;
        padding-left: 6px;
        width: 100px;
        p{
          overflow: hidden;
          text-overflow:ellipsis;
          white-space:nowrap;
          line-height: 22px;
          height: 22px;
        }
        .tit{
          padding-top: 3px;
          font-size: 14px;
          color: #2e3135;
        }
        .src{
          font-size: 12px;
          color: #8a93a0;
        }
      }
      &:hover{
        box-shadow: 1px 1px 4px 0 rgba(0,0,0,.1);
        img{
          opacity: 1;
        }
      }
    }
  }
  span{
    color: #007fff;
    cursor: pointer;
    font-size: 14px;
    line-height: 20px;
  }
}
.child1 div{
  width: 250px;
  height: 250px;
}
.child2 div{
  width: 180px;
  height: 180px;
}
.child3 div,.child5 div,.child6 div,.child9 div{
  width: 150px;
  height: 150px;
}
.child4 div,.child7 div,.child8 div{
  width: 130px;
  height: 130px;
} 
.img-wrap{
  padding: 8px 20px 0 86px;
  overflow: hidden;
  user-select: none;
  div{
    float: left;
    margin: 0 5px 5px 0;
    overflow: hidden;
    position: relative;
    border-radius: 2px;
    font-size: 0px;
    background: #f4f5f5;
  }
  img{
    height: 100%;
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;
    cursor: zoom-in;
  }
}
.img-open{
  margin: 0 20px 0 86px;
  background: #f4f5f7;
  user-select: none;
  .action-bar{
    height: 32px;
    span{
      font-size: 13px;
      margin: 0 10px;
      line-height: 32px;
      cursor: pointer;
      color: #76797e;
      &:hover{
        color: #027fff;
      }
      &.stop{
        color: #aaa;
        cursor: default;
        &:hover{
          color: #aaa;
        }
      }
    }
  }
  .exhibition{
    text-align: center;
    font-size: 0;
    position: relative;
    img{
      max-width: 100%;
      cursor: zoom-out;
    }
    .left-btn{
      position: absolute;
      width: 200px;
      height: 100%;
      left: 0;
      top: 0;
      cursor: url($base64LEFT),auto;
    }
    .right-btn{
      position: absolute;
      width: 200px;
      height: 100%;
      right: 0;
      top: 0;
      cursor: url($base64RIGHT),auto;
    }
  }
  .select{
    overflow: hidden;
    div{
      opacity: .8;
      width: 58px;
      height: 58px;
      float: left;
      margin: 8px 8px 6px 0;
      overflow: hidden;
      position: relative;
      font-size: 0px;
      background: #f4f5f5;
      box-sizing: border-box;
      
      &.now{
        border: 2px solid #007fff;
        opacity: 1;          
      }
      &:hover{
        border: 2px solid #007fff;
        opacity: 1;
      }
      &:last-of-type{
        margin-right: 0;
      }
      img{
        height: 100%;
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        margin: auto;
      }
    }
  }
}
.bottom-wrap{
  overflow: hidden;
  margin-top: 16px;
  position: relative;
  p{
    width: 50%;
    border-top: 1px solid #ebebeb;
    float: left;
    height: 32px;
    line-height: 32px;
    text-align: center;
    color: #8a93a0;
    cursor: pointer;
    &:hover{
      color: #bcbec1;
    }
  }
  .likeLoad{
    cursor: default;
  }
  i{
    font-size: 14px;
  }
  b{
    font-size: 13px;
  }
  .own{
    color: #007fff;
    &:hover{
      color: #3c9af9;
    }
  }
  .fa-spin{
    color: #bcbec1;
  }
  &:before{
    content: "";
    width: 1px;
    height: 25px;
    background-color: #ebebeb;
    position: absolute;
    left: 50%;
    top: 12%;
  }
}
</style>
