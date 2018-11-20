<template>
  <div class="markdown-wrap">
    <mavon-editor ref="mavonEditor" 
                  @change="textChange" 
                  @imgAdd="imgAdd" 
                  :toolbars="mavonConfig" 
                  placeholder=" " 
                  style="height: 100%">
      <template slot="right-toolbar-after">
        <b class="b-before"></b>
        <button @click="release" class="slot-btn">发 布</button>
        <img class="slot-img" :src="userInfo.avatar">
      </template>
    </mavon-editor>
    <div class="insert"> <!-- 获取结构动态插入 -->
      <input ref="title" class="inp" placeholder="文章标题..." type="text">
    </div>
  </div>
</template>

<script>
import {mapGetters, mapMutations} from 'vuex'
import {mavonEditor} from 'mavon-editor'
import markdownConfig from './markdownConfig'
import setImg from '@/api/setImg.js'

export default {
  data() {
    return {
      myPos: '',
      mavonConfig: markdownConfig.mavonConfig,
      HTML: '',
      TEXT: ''
    }
  },
  created() {
  },
  mounted() {
    const oFather = document.getElementsByClassName('v-note-wrapper')[0]
    const oChildren = document.getElementsByClassName('v-note-panel')[0]
    const DOM = document.getElementsByClassName('insert')[0]
    oFather.insertBefore(DOM, oChildren)
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  methods: {
    ...mapMutations(['loginVueShow']),
    imgAdd(pos, myFile){
      this.myPos = pos
      const loadImgKey = this.userInfo.loadImgKey
      delete myFile.miniurl  // miniurl是base64数据这里不需要
      if(!myFile || !loadImgKey) return // 用户选择了取消
      setImg({
        completeFun: this.completeFun,
        loadImgKey,
        myFile
      })
    },
    completeFun(res){
      if(res.status == 'err'){
        console.log('图片上传失败', res)
        alert('图片上传失败')
      }
      if(res.status == 'success'){
        this.$refs.mavonEditor.$img2Url(this.myPos, res.url)
      }
    },
    textChange(text, html){
      this.TEXT = text || ''
      this.HTML = html || ''
    },
    release(){
      if(JSON.stringify(this.userInfo) == '{}' || !this.userInfo.id){
        return this.loginVueShow(true) // 用户未登陆
      }
      

      const text = this.HTML.replace(/<[^<>]+>|\s/g,'').slice(0,150)
      const title = this.$refs.title.value || '作者没有定义标题'
      let imgTag = this.HTML.match(/<img.*?(?:>|\/>)/)
      imgTag = imgTag ? imgTag[0] : ''
      let image = imgTag.match(/src=[\'\"]?([^\'\"]*)[\'\"]?/)
      image = image ? image[1] : ''
      this.myAjax.pushArticleData({
        user: this.userInfo.id,
        file: this.TEXT,
        title,
        image,
        text
      }).then(data => {
        console.log(data)
      })

    }
  },
  components: {
    mavonEditor
  }
}
</script>

<style scoped lang="scss">
.markdown-wrap{
  width: 1000px;
  position: absolute;
  top: 70px;
  bottom: 10px;
}
.insert{
  display: none;
}
.markdown-wrap /deep/ .v-note-wrapper .insert{
  display: block;
  height: 46px;
  box-shadow: 0 0px 3px rgba(0,0,0,0.157), 0 0px 3px rgba(0,0,0,0.227);
  .inp{
    width: 100%;
    height: 46px;
    padding: 0 22px;
    background: #fff;
    border: none;
    line-height: 46px;
    font-size: 18px;
    color: #333;
    outline: none;
  }
}
.slot-btn{
  height: 28px;
  padding: 0 14px;
  border: none;
  border-radius: 2px;
  background: #027fff;
  color: #fff;
  line-height: 28px;
  outline: none;
  &:hover{
    background: #0371df;
  }
}
.b-before{
  flex: 1;
}
.slot-img{
  display: none;
  width: 30px;
  height: 30px;
  margin-left: 16px;
  border-radius: 15px;
}
.fullscreen /deep/ .slot-img{
  display: inline-block;
}
// mavon-editor 样式覆盖
.markdown-wrap /deep/ .v-note-wrapper .v-note-op{
  padding: 0 16px 0 8px;
}
.markdown-wrap /deep/ .v-note-wrapper .v-note-op .v-right-item{
  max-width: none;
  display: flex;
  align-items: center;
}
.markdown-wrap /deep/ .v-note-wrapper .v-note-op .v-left-item{
  flex: none;
}
.markdown-wrap /deep/ .op-icon.dropdown-wrapper.dropdown .dropdown-item{
  font-size: 14px;
}
.markdown-wrap /deep/ .op-icon.dropdown-wrapper.dropdown .popup-dropdown{
  top: 35px;
}
.markdown-wrap /deep/ .op-icon.dropdown-wrapper.dropdown .dropdown-images{
  display: none;
}
.markdown-wrap /deep/ .v-note-wrapper .v-note-panel .v-note-edit.divarea-wrapper{
  background: #fff;
}
</style>