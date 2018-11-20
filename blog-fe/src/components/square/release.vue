<!-- release 发布消息 -->
<template>
  <div class="release">
    <div :class="{'input-wrap': true, focus: inputWrapBor}">
      <div ref="textDom" @input="textChange" @focus="inputWrapBor=true" @blur="inputWrapBor=false" :class="{'input-text': true, placeholder: textHtml == ''}" contenteditable="true"></div>
      <ul class="link">
        <!-- <a v-for="(item, index) in releaseLink" :href="item.link" target="_blank"> -->
          <li v-for="(item, index) in releaseLink" @click="openHref(item.link)">
            <div class="img">
              <img v-if="item.images.length > 0" :src="item.images[0].link" alt="">
              <i v-else class="fa fa-link"></i>
            </div>
            <div class="text">
              <p class="tit">{{item.title}}</p>
              <p class="src">{{item.link}}</p>
            </div>
            <i class="fa fa-times" @click.stop="deleteLink(index)"></i>
          </li>
        <!-- </a> -->
      </ul>
      <ul class="preview" v-show="releaseImgNum">
        <li v-for="(item, index) in releaseImg">
          <img :src="item.preview">
          <i class="fa fa-times" @click="deleteImg(index)"></i>
        </li>
        <li class="spinner" v-show="releaseImgNum != releaseImg.length">
          <i class="fa fa-spinner fa-spin"></i>
        </li> 
        <li class="add" @click="addImg" v-show="releaseImgNum > 0 && releaseImgNum < 9">
          <i class="fa fa-plus"></i>
        </li>
      </ul>
    </div>
    <div class="tool-bar">
      <input @change="loadImg" ref="myfile" type="file" accept=".png,.jpg,.jpeg,.gif" style="display:none">
      <span @click="addImg" :class="{not: !(releaseImgNum < 9)}">
        <i class="fa fa-picture-o"></i>
        图片
      </span>
      <span @click="showLinkInp" :class="{not: !(releaseLink.length < 3)}">
        <i class="fa fa-link"></i>
        裂接
      </span>
      <p class="link-wrap" v-show="linkWrapShow">
        <input @keyup.enter="addLink" @animationend="inpErrStatus = false" :class="{err: inpErrStatus}" @input="inpErrStatus = false" v-model="linkText" type="text">
        <button @click="addLink">添加</button>
      </p>
      <button @click="release" :disabled="releaseBtn" :class="{not: releaseBtn}">发布</button>
      <span :class="{'text-length': true, del: textHtml.length > 300}">{{textHtml.length > 300 ? '请删掉' + (textHtml.length - 300) + '个字' : '您还可以输入' + (300 - textHtml.length) + '个字'}}</span>
    </div>
  </div>
</template>

<script>
import {mapGetters,mapMutations} from 'vuex'
import setImg from '@/api/setImg.js'
import validator from '@/api/validator.js'
export default {
  data() {
    return {
      inputWrapBor: false,
      textHtml: '',
      releaseImg: [],
      releaseImgNum: 0,
      linkText: '',
      releaseLink: [],
      inpErrStatus: false,
      linkWrapShow: false,
      releaseStatus: true
    }
  },
  computed: {
    ...mapGetters(['userInfo']),
    releaseBtn(){
      return this.textHtml == '' || this.textHtml.length > 300 || !this.releaseStatus
    }
  },
  methods: {
    ...mapMutations(['loginVueShow']),
    textChange(){
      this.textHtml = this.$refs.textDom.innerText
    },
    addImg(){
      if(JSON.stringify(this.userInfo) == '{}' || !this.userInfo.id){
        return this.loginVueShow(true) // 用户未登陆
      }
      if(this.releaseImgNum < 9){
        this.$refs.myfile.click()
      }
    },
    loadImg(){
      const myFile = this.$refs.myfile.files[0]
      const loadImgKey = this.userInfo.loadImgKey
      if(!myFile || !loadImgKey){return} // 用户选择了取消
      ++this.releaseImgNum
      setImg({
        completeFun: this.completeFun,
        loadImgKey,
        myFile
      })
    },
    completeFun(res){
      console.log('进度', res)
      if(res.status == 'err'){
        --this.releaseImgNum
        console.log(11, res)
        alert('图片上传失败')
      }
      if(res.status == 'success' && this.releaseImg.length < 9){
        delete res.status
        this.releaseImg.push(res)
      }
    },
    deleteImg(index){
      --this.releaseImgNum
      this.releaseImg.splice(index, 1)
    },
    showLinkInp(){
      if(JSON.stringify(this.userInfo) == '{}' || !this.userInfo.id){
        return this.loginVueShow(true) // 用户未登陆
      }
      if(this.releaseLink.length < 3){
        this.linkWrapShow = !this.linkWrapShow
      }
    },
    deleteLink(index){
      this.releaseLink.splice(index, 1)
    },
    addLink(){
      const reg = /^((ht|f)tps?):\/\/([\w\-]+(\.[\w\-]+)*\/)*[\w\-]+(\.[\w\-]+)*\/?(\?([\w\-\.,@?^=%&:\/~\+#]*)+)?/
      if(!reg.test(this.linkText)){
        this.inpErrStatus = true
        return
      }
      this.linkWrapShow = false
      this.releaseLink.push({
        link: this.linkText,
        title: '点击此处跳转超链接',
        images: []
      })
      this.myAjax.getLinkTitle({
        link: this.linkText
      }).then(data => {
        this.linkText = ''
        this.releaseLink.map(item => {
          if(item.link == data.link){
            item.title = data.title
            item.images = data.images
          }
        })  
      })
    },
    release(){  // 发布
      if(JSON.stringify(this.userInfo) == '{}' || !this.userInfo.id){
        return this.loginVueShow(true) // 用户未登陆
      }
      this.textHtml = this.textHtml.replace(/(^\s+)|(\s+$)/g, '')
      if(this.textHtml.length == 0){
        alert('请输入')
        return
      }
      
      this.releaseStatus = false
      this.myAjax.pushSquareData({
        user: this.userInfo.id,
        text: this.textHtml,
        images: this.releaseImg,
        links: this.releaseLink
      }).then(data => {
        this.$refs.textDom.innerText = ''
        this.textHtml = ''
        this.releaseImg =[]
        this.releaseLink = []
        this.releaseImgNum = 0
        this.$emit('pushData' , data)
      }).finally(data => {
        this.releaseStatus = true
      })
    },
    openHref(link){
      window.open(link)
    }
  }
}
</script>

<style scoped lang="scss">
.release{
  min-height: 160px;
  box-shadow: 0 1px 2px 0 rgba(0,0,0,.05);
  background: #fff;
  margin-top: 12px;
  padding: 18px 20px 10px 20px;
  box-sizing: border-box;
}
.input-wrap{
  border: 1px solid #e5e6e7;
  background-color: #f9fafb;
  border-radius: 2px;
  padding: 10px 10px 10px 10px;
  box-sizing: border-box;
  &.focus{
    border-color: #0371df;
  }
  .input-text{
    min-height: 70px;
    outline: none;
    color: #17181a;
    font-size: 14px;
    line-height: 22px;
    padding-bottom: 20px;
    &.placeholder{
      &::after{
        font-size: 14px;
        content: '发布消息...';
        color: #9ea0a1;
      }
    }
  }
  .link{
    display: flex;
    flex-wrap: wrap;
    cursor: pointer;
    li{
      box-sizing: border-box;
      min-width: 200px;
      height: 62px;
      border: 1px solid #ebebeb;
      border-radius: 2px;
      display: flex;
      padding: 6px;
      background: #f4f6f7;
      position: relative;
      margin-left: 10px;
      flex: 1;
      &:first-of-type{
        margin-left: 0;    
      }
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
      i.fa-times{
        display: none;
        width: 16px;
        height: 16px;
        border-radius: 10px;
        border: 1px solid #c5c5c5;
        background: rgba(0,0,0,.3);
        position: absolute;
        right: 2px;
        top: 2px;
        color: #fff;
        font-size: 10px;
        text-align: center;
        line-height: 16px;
        cursor: pointer;
        z-index: 2;
      }
      &:hover{
        box-shadow: 1px 1px 4px 0 rgba(0,0,0,.1);
        .fa-times{
          display: inline-block;
          background: rgba(0,0,0,.5);
        }
        img{
          opacity: 1;
        }
      }
    }
  }
  .preview{
    overflow: hidden;
    padding-top: 10px;
    user-select: none;
    li{
      margin-left: 10px;    
      float: left;
      overflow: hidden;
      width: 62px;
      height: 62px;
      border-radius: 2px;
      position: relative;
      img{
        width: 62px;
        height: 62px;
        opacity: .8;
      }
      i.fa-times{
        display: none;
        width: 16px;
        height: 16px;
        border-radius: 10px;
        border: 1px solid #c5c5c5;
        background: rgba(0,0,0,.3);
        position: absolute;
        right: 2px;
        top: 2px;
        color: #fff;
        font-size: 10px;
        text-align: center;
        line-height: 16px;
        cursor: pointer;
        z-index: 2;
      }
      &:hover{
        &::after{
          content: '';
          display: inline-block;
          width: 100%;
          height: 100%;
          background: rgba(0,0,0,.2);
          position: absolute;
          top: 0;
        } 
        img{
          opacity: 1;
        }
        .fa-times{
          display: inline-block;
          background: rgba(0,0,0,.5);
        }        
      }
      &:first-of-type{
        margin-left: 0;    
      }
    }
    .spinner{
      box-sizing: border-box;
      border: 1px dashed #c5c5c5;
      text-align: center;
      line-height: 68px;
      i{
        width: auto;
        height: auto;
        background: none;
        color: #c5c5c5;
        border: none;
        font-size: 30px;
        position: static;
        cursor: default;
        &:hover{
          background: none;
        }        
      }
      &:hover{
        &::after{
          display: none;
        }         
      }
    }
    .add{
      box-sizing: border-box;
      border: 1px dashed #c5c5c5;
      cursor: pointer;
      text-align: center;
      line-height: 62px;
      i{
        background: none;
        color: #c5c5c5;
        border: none;
        font-size: 16px;
        position: static;
        &:hover{
          background: none;
        }  
      }
      &:hover{
        border-color: #a5a5a5;
        i{
          color: #a5a5a5;
        }
        &::after{
          display: none;
        }
      }
    }
  }
}
.tool-bar{
  user-select: none;
  height: 32px;
  margin-top: 10px;
  position: relative;
  span{
    float: left;
    font-size: 13px;
    color: #027fff;
    line-height: 32px;
    margin: 0 10px 0 5px;
    cursor: pointer;
  }
  .text-length{
    float: right;
    font-size: 14px;
    color: #a1a9b3;
    cursor: default;
  }
  .del{
    color: red;
  }
  button{
    float: right;
    font-size: 14px;
    width: 72px;
    height: 32px;
    color: #fff;
    background-color: #027fff;
    border-radius: 2px;
    border: none;
    line-height: 32px;
    outline: none;
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
  .not{
    cursor: default;
    color: #71777c;
  }
  .link-wrap{
    box-shadow: 0 5px 18px 0 rgba(0,0,0,.16);
    float: left;
    margin-top: 4px;
    input{
      width: 200px;
      outline: none;
      border: #027fff solid 1px;
      border-radius: 2px 0 0 2px;
      height: 26px;
      box-sizing: border-box;
      padding-left: 6px;
    }
    button{
      height: 26px;
      line-height: 26px;
      font-size: 12px;
      border-radius: 0 2px 2px 0;
      outline: none;
      width: 46px;
      border: #027fff solid 1px;
      border-left: 0;
    }
    .err{
      border-color: red;
      animation: errBorder .5s;
    }    
  }
}
@keyframes errBorder{
  30%{
    border-color: red;
    box-shadow: 0 0px 10px 0 rgba(255, 0, 0, 0.3);
  }
  60%{
    border-color: #027fff;
  }
  100%{
    border-color: red;
  }
}
</style>
