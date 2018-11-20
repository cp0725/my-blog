export default {
  country: ['zh-CN'],
  cookieOverdue: 86400000, // cookie 过期时间1天
  avatar(){
    const AVATAR = [
      'http://pczp7a1z5.bkt.clouddn.com/Fluxd_o3NUQRO7ng04x7QTLnVTrT?imageView2/1/w/250/h/250',
      'http://pczp7a1z5.bkt.clouddn.com/FskFcPCp9llMLptuiMolnon24cau?imageView2/1/w/250/h/250',
      'http://pczp7a1z5.bkt.clouddn.com/FnWNTXWC7zNEV82szIfxoS1Ng8Ch?imageView2/1/w/250/h/250',
      'http://pczp7a1z5.bkt.clouddn.com/Fg_bN57PbGSwYPWX3ZBrwtQyF96z?imageView2/1/w/250/h/250',
      'http://pczp7a1z5.bkt.clouddn.com/FlWKxhX42LIJgFvLk3JoL6GQ8iY0?imageView2/1/w/250/h/250',
      'http://pczp7a1z5.bkt.clouddn.com/FowBHAGPLnk5XjTCOcR2Mw4bjR5p?imageView2/1/w/250/h/250',
      'http://pczp7a1z5.bkt.clouddn.com/FtPYT1elsOUnGsFe6rG0sdAXyouN?imageView2/1/w/250/h/250',
      'http://pczp7a1z5.bkt.clouddn.com/Fkaad5rsYeaGclcrnoGmiGAGFFZS?imageView2/1/w/250/h/250'
    ] 
    return AVATAR[parseInt(Math.random() * 8)]
  },
  pageConfig: {
    page: 0,
    size: 10,
    total: 0
  },
  /**
   * 0: 云音乐新歌榜 每天更
   * 1: 云音乐热歌榜 周四更
   * 2: 网易原创歌曲榜 周四更
   * 3: 云音乐飙升榜 每天更
   * 4: 云音乐电音榜 周五更
   * 5: UK排行榜周榜 周一更
  */
  musicType: 3
}