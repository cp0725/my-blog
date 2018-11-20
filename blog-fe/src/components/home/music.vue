<template>
  <div class="music">

    <transition name="focus">
      <div class="focus-wrap" v-show="showState == 'focus'">
        <ul class="item-wrap">
          <li :class="{item: true, now: openMusic.id === item.id}" @click="showBanner(item)" v-for="item in focusMusicList">
            <div class="img">
              <img class="prc" :class="{stop: musicStopStatus}" :src="item.al.picUrl">
              <i class="fa fa-play-circle-o"></i>
              <i class="fa fa-pause-circle-o"></i>
              <i class="fa fa-music"></i>
            </div>
            <div class="text">
              <p class="name">{{item.name}}</p>
              <p class="author">{{item.ar.map(item => item.name).join('/')}}</p>
            </div>
          </li>
        </ul>
      </div>
    </transition>

    <transition name="banner">
      <div class="banner-wrap" v-show="showState == 'banner'">
        <img class="banner" v-if="openMusic.al" :src="openMusic.al.picUrl">
        <b class="mask"></b>
        <i @click="compress" class="fa fa-compress"></i>
        <div class="item-wrap">
          <i @click="before" class="fa fa-angle-up"></i>
          <i @click="after" class="fa fa-angle-down"></i>
          <ul>
            <li :class="{item: true, now: openMusic.id === item.id}" v-for="item in bannerMusicList" @click="bannerItenClick(item)">
              <div class="img">
                <img class="prc" :class="{stop: musicStopStatus}" :src="item.al.picUrl">
                <i class="fa fa-play-circle-o" v-show="openMusic.id != item.id || musicStopStatus"></i>
                <i class="fa fa-pause-circle-o" v-show="openMusic.id == item.id && !musicStopStatus"></i>
                <i class="fa fa-music" v-show="openMusic.id === item.id"></i>
              </div>
              <div class="text">
                <p class="name">{{item.name}}</p>
                <p class="author">{{item.ar.map(item => item.name).join('/')}}</p>
              </div>
            </li>
          </ul>
        </div>
        <div class="music-ctrl">
          <i @click="switchMusic(-1)" class="fa fa-backward"></i>
          <i @click="playMusic" class="fa fa-play-circle-o" v-if="musicStopStatus"></i>
          <i @click="stopMusic" class="fa fa-pause-circle-o" v-else></i>
          <i @click="switchMusic(1)" class="fa fa-forward"></i>
        </div>
        <div class="lrc-wrap" v-if="openMusic.name">
          <div class="info">
            <p class="name">{{openMusic.name}}</p>
            <p class="author">
              <span class="tit">歌手</span>
              <span>{{openMusic.ar.map(item => item.name).join('/')}}</span>
              <span class="time">{{musicTime}}</span>
            </p>
          </div>
          <div class="lrc">
            <p v-for="(item, index) in showLrc" :class="{now: index == 2}">{{item}}</p>
          </div>
        </div>
      </div>
    </transition>

    <audio
      autoplay loop ref="audio" 
      :src="openMusic.musicUrl ? openMusic.musicUrl.url : ''" 
      @timeupdate="updateTime"
    >
    </audio>

    <div @click="compress2" style="padding-top: 50px">
      其他内容正在开发
    </div>
    
  </div>
</template>

<script>
import KEY from '@/api/keys'
export default {
  data() {
    return {
      showState: 'focus',
      focusMusicList: [],
      bannerMusicList: [],
      openMusic: {},
      musicTime: '',
      musicStopStatus: false,
      lrc: [],
      showLrc: ['', '', '', '', '']
    }
  },
  created() {
    this.getMusicList()
  },
  mounted() {

  },
  methods: {
    getMusicList(){
      console.log(1)
      this.myAjax.getMusicList({
        idx: KEY.musicType
      }).then(data => {
        console.log(data,2)

        this.bannerMusicList = data.data 
        this.focusMusicList = data.data.concat(data.data.slice(0,4))
      })
      console.log(3)
    },
    compress(){
      this.showState = 'focus'
    },
    showBanner(item){
      const judge = this.openMusic.name || false
      this.openMusic = item
      this.showState = 'banner'
      this.playMusic(judge)
      this.setPosition()
      console.log(this.openMusic)
    },
    setPosition(){
      if(this.openMusic.id != this.bannerMusicList[2].id){
        this.after()
        this.setPosition()
      }
    },
    after(){
      this.bannerMusicList.push(this.bannerMusicList[0])
      this.bannerMusicList = this.bannerMusicList.slice(1)
    },
    before(){
      this.bannerMusicList.unshift(this.bannerMusicList[this.bannerMusicList.length - 1])
      this.bannerMusicList = this.bannerMusicList.slice(0, this.bannerMusicList.length - 1)
    },
    switchMusic(direction){
      let index
      this.bannerMusicList.map((item, n) => {
        if(item.id == this.openMusic.id) index = n
      })
      this.openMusic = this.bannerMusicList[index + direction]
      this.playMusic()
    },
    bannerItenClick(item){
      if(item.id != this.openMusic.id){
        this.openMusic = item
        this.playMusic()
        return
      }
      if(item.id == this.openMusic.id && this.musicStopStatus){
        this.playMusic()
        return
      }
      if(item.id == this.openMusic.id && !this.musicStopStatus){
        this.stopMusic()
        return
      }
    },
    stopMusic(){
      this.$refs.audio.pause()
      this.musicStopStatus = true
    },
    playMusic(judge = true){
      if(judge){
        this.$refs.audio.play()
        this.musicStopStatus = false
      }
    },
    updateTime(){
      const duration = this.$refs.audio.duration // 取歌曲时长
      const currentTime = this.$refs.audio.currentTime // 取播放时长
      const time = duration - currentTime
      const min = parseInt(time / 60) 
      const s = parseInt(time % 60)
      const timeStr = `${min}:${s < 10 ? '0' + s : s}`
      this.musicTime = timeStr == 'NaN:NaN' ? '' : timeStr
      this.computedLrc()
    },
    getLrc(){
      this.myAjax.getLrc({
        id: this.openMusic.id
      }).then(data => {
        let lrcStr = data.lrc.lyric
        console.log(lrcStr)

        let lrcArr = lrcStr.split('[')
        this.lrc = lrcArr.map(item => {
          return {
            time: item.split(']')[0],
            secs: item.split(']')[0].split('.')[0],
            lrc: item.split(']')[1]
          }
        })
        console.log(this.lrc) // 同一句歌词可能会有两个时间，这个未做处理
      })
    },
    computedLrc(){
      const currentTime = this.$refs.audio.currentTime
      const min = parseInt(currentTime / 60) 
      const s = parseInt(currentTime % 60)
      const minStr = min < 10 ? '0' + min : min
      const sStr = s < 10 ? '0' + s : s
      const time = minStr + ':' + sStr

      this.lrc.map((item, index) => {
        // console.log(item.secs, time)
        if(item.secs == time){
          this.showLrc.push(item.lrc)
          this.showLrc.push(this.lrc[index+1].lrc)
          this.showLrc.push(this.lrc[index+2].lrc)
          // console.log(this.showLrc)
          this.showLrc = this.showLrc.slice(this.showLrc.length > 5 ? this.showLrc.length - 5 : 0)
        }
      })
      // console.log(this.showLrc)
      // break
    },
    compress2(){    

    }
  },
  components: {
    
  },
  watch: {
    openMusic(){
      this.getLrc()
    }
  }
}
// 测试
</script>

<style scoped lang="scss">
.music{
 
}
.focus-wrap{
  width: 100%;
  height: 70px;
  overflow: hidden;
  &:hover .item-wrap{
    animation-play-state: paused;
  }  
  .item-wrap{
    display: flex;
    transform: translateX(0px);
    animation: focusFalsh 38s cubic-bezier(0,.3,.6,1) infinite;
    .item{
      width: 25%;
      height: 70px;
      padding: 10px;
      margin: 0 5px 0 0;
      box-sizing: border-box;
      display: flex;
      flex-shrink: 0;
      background: #fefefe;
      border-radius: 2px;
      cursor: pointer;
      .img{
        position: relative;
        .prc{
          width: 50px;
          height: 50px;
          border-radius: 2px;
        }
        .fa-play-circle-o,
        .fa-pause-circle-o{
          display: none;
          width: 28px;
          height: 28px;        
          position: absolute;
          left: 0;
          right: 0;
          top: 0;
          bottom: 0;
          z-index: 2;
          margin: auto;
          color: #fafafa;
          font-size: 30px;
        }
        .fa-music{
          display: none;
          position: absolute;
          top: -6px;
          right: -182px;
          color: #2bb8aa;
        }
      }
      .text{
        flex: 1;
        padding-left: 10px;
        overflow:hidden;
        .name,
        .author{
          overflow:hidden;
          text-overflow:ellipsis;
          white-space:nowrap;
        }
        .name{
          padding-top: 2px;
          font-size: 16px;
          color: #0371df;
          line-height: 26px;
          font-weight: 600;
        }
      }
      &:hover{
        background: #fbfafa;
        .img .fa-play-circle-o{
          display: inline-block;
        }
        .img::after{
          content: '';
          position: absolute;
          z-index: 1;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
          background: #000;
          opacity: .3;
        }
      }
    }
    .now{
      .fa-music{
        display: inline-block!important;
      }
      .img{
        &::after{
          border-radius: 50%;
        }
        .prc{
          border-radius: 50%;
          box-shadow: #ccc 0px 0px 2px 3px;
          animation: rotateFalsh 6s linear infinite;
        }
        .stop{
          animation-play-state: paused;
        }
      }
      .fa-play-circle-o{
        display: none!important;
      }
      &:hover .fa-pause-circle-o{
        display: inline-block!important;
      }      
    }
  }
}
.banner-wrap{
  width: 100%;
  height: 330px;
  position: relative;
  overflow: hidden;
  border-radius: 2px;
  .banner{
    width: 100%;
    position: absolute;
    top: 0;
    bottom: 0;
    margin: auto;
    filter: blur(10px);
  }
  .mask{
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background: #121212;
    opacity: .5;
  }
  .fa-compress{
    position: absolute;
    left: 12px;
    top: 8px;
    color: #aaa;
    font-size: 18px;
    cursor: pointer;
    &:hover{
      color: #0371df;
    }
  }
  .item-wrap{
    height: 310px;
    margin: 10px;
    overflow: hidden;
    position: absolute;
    right: 0;
    top: 0;
    > .fa{
      display: none;
      width: 50px;
      height: 26px;
      position: absolute;
      left: 0;
      right: 0;
      margin: 0 auto;
      background: rgba(0,0,0,.3);
      text-align: center;
      line-height: 26px;
      font-size: 26px;
      color: #fff;  
      cursor: pointer; 
    }
    .fa-angle-down{
      bottom: 0;
      border-radius: 2px 2px 0 0;
    }
    .fa-angle-up{
      top: 0;
      border-radius: 0 0 2px 2px;
    }
    &:hover > .fa{
      display: inline-block;
    }
    .item{
      width: 250px;
      height: 58px;
      padding: 10px;
      margin: 0 0 5px 0;
      box-sizing: border-box;
      display: flex;
      background: #fefefe;
      border-radius: 2px;
      cursor: pointer;
      .img{
        position: relative;
        .prc{
          width: 38px;
          height: 38px;
          border-radius: 2px;
        }
        .fa-play-circle-o,
        .fa-pause-circle-o{
          display: none;
          width: 26px;
          height: 26px;        
          position: absolute;
          left: 0;
          right: 0;
          top: 0;
          bottom: 0;
          z-index: 2;
          margin: auto;
          color: #fafafa;
          font-size: 26px;
          text-align: center;
          line-height: 26px;
        }
        .fa-music{
          position: absolute;
          top: -6px;
          right: -196px;
          color: #2bb8aa;
        }
      }
      .text{
        flex: 1;
        padding-left: 10px;
        overflow:hidden;
        .name,
        .author{
          overflow:hidden;
          text-overflow:ellipsis;
          white-space:nowrap;
        }
        .name{
          color: #0371df;
          font-weight: 600;
        }
      }
      &:hover{
        background: #fbfafa;
        .img .fa{
          display: inline-block;
        }
        .img::after{
          content: '';
          position: absolute;
          z-index: 1;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
          background: #000;
          opacity: .3;
        }
      }
    }
    .now{
      .img{
        &::after{
          border-radius: 50%;
        }
        .prc{
          border-radius: 50%;
          box-shadow: #ccc 0px 0px 2px 3px;
          animation: rotateFalsh 6s linear infinite;
        }
        .stop{
          animation-play-state: paused;
        }
      }
    }
  }
  .music-ctrl{
    width: 100px;
    position: absolute;
    left: 0;
    right: 260px;
    bottom: 16px;
    margin: auto;
    display: flex;
    justify-content: space-between;
    align-items: center; 
    .fa{
      font-size: 30px;
      color: #ccc;
      cursor: pointer;
      &:hover{
        color: #fff;
      }
    }
    .fa-backward,
    .fa-forward{
      font-size: 18px;
    }
  }
  .lrc-wrap{
    position: absolute;
    left: 30px;
    right: 290px;
    top: 30px;
    bottom: 30px;
    .info{
      margin: 0 60px;
      padding: 0 10px;
      border-bottom: 1px solid #ccc;
      .name{
        color: #fff;
        font-size: 22px;
        line-height: 32px;
      }
      .author{
        line-height: 26px;
        color: #ccc;
        .tit{
          margin-right: 8px;
        }
        .time{
          float: right;
        }
      }
    }
    .lrc{
      height: 150px;
      margin: 26px 70px 0 70px;
      // background: pink;
      p{
        line-height: 30px;
        text-align: center;
        color: #ccc;
      }
      .now{
        color: #fff;
      }
    }
  }
}

@keyframes focusFalsh{
  0%{
    transform: translateX(0px);
  }
  8%{
    transform: translateX(0px);
  }
  10%{
    transform: translateX(-255px);
  }
  18%{
    transform: translateX(-255px);
  }
  20%{
    transform: translateX(-510px);
  }
  28%{
    transform: translateX(-510px);
  }
  30%{
    transform: translateX(-765px);
  }
  38%{
    transform: translateX(-765px);
  }
  40%{
    transform: translateX(-1020px);
  }
  48%{
    transform: translateX(-1020px);
  }
  50%{
    transform: translateX(-1275px);
  }
  58%{
    transform: translateX(-1275px);
  }
  60%{
    transform: translateX(-1530px);
  }
  68%{
    transform: translateX(-1530px);
  }
  70%{
    transform: translateX(-1785px);
  }
  78%{
    transform: translateX(-1785px);
  }
  80%{
    transform: translateX(-2040px);
  }
  88%{
    transform: translateX(-2040px);
  }
  90%{
    transform: translateX(-2295px);
  }
  98%{
    transform: translateX(-2295px);
  }
  100%{
    transform: translateX(-2550px);
  }
}
@keyframes rotateFalsh{
  0%{
    transform: rotateZ(0deg);
  }
  100%{
    transform: rotateZ(360deg);
  }
}

.focus-enter-active, 
.focus-leave-active,
.banner-enter-active, 
.banner-leave-active{
  transition: all .6s;
}
.focus-enter,
.focus-leave-to,
.banner-enter,
.banner-leave-to{
  opacity: 0;
  height: 0px;
}
</style>