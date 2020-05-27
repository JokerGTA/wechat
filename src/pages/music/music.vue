<template>
  <div class="main">
    <div
      v-for="(item, index) in musicList"
      :key="index"
      :class="'playList '+{'selected':currentMusic==index,'unselect':currentMusic!=index}"
      @click="playMusic(index)"
    >
      <div class="playContainer">
        <div class="gifbody" v-show="currentMusic==index&&isPlay">
          <div class="music">
            <span class="line line1"></span>
            <span class="line line2"></span>
            <span class="line line3"></span>
            <span class="line line4"></span>
            <span class="line line5"></span>
          </div>
        </div>
        <img
          src="../../../static/images/play.png"
          class="playicon"
          v-show="currentMusic==index&&!isPlay"
        />
        <!-- <p class="musicName">{{item.title}}</p> -->
      </div>
      <van-image :src="item.coverImgUrl" width="100%" height="100%" fit="fill" />
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      isPlay: false,
      isDisplay: false,
      currentMusic: -1,
      musicList: [
        {
          url: "http://music.163.com/song/media/outer/url?id=526116053.mp3",
          title: "50 Feet",
          coverImgUrl:
            "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1590406377411&di=444fc6702746811fd89ed035a3c5408c&imgtype=0&src=http%3A%2F%2Fb-ssl.duitang.com%2Fuploads%2Fitem%2F201901%2F12%2F20190112164912_jvvdc.jpg"
        },
        {
          url: "http://music.163.com/song/media/outer/url?id=1422778166.mp3",
          title: "First Date",
          coverImgUrl:
            "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1590406377410&di=dead09c75d961016d6d6a9e4db0b61dd&imgtype=0&src=http%3A%2F%2Fhbimg.b0.upaiyun.com%2Ff1a64173a7a42f654e78b1e68ca81b73311c880b5d6e4-DdGcX3_fw658"
        },
        {
          url: "http://music.163.com/song/media/outer/url?id=1449406576.mp3",
          title: "温泉",
          coverImgUrl:
            "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1590406377410&di=ed664a895fa916fa512f93f80ed810d6&imgtype=0&src=http%3A%2F%2Fpic4.zhimg.com%2Fv2-2d49e0e58de6200ca50d72f315b1a903_b.jpg"
        },
        {
          url: "http://music.163.com/song/media/outer/url?id=1411975313.mp3",
          title: "遇见你",
          coverImgUrl:
            "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1590406377410&di=f0b97d6ea19cf6e04f669394ce7139de&imgtype=0&src=http%3A%2F%2Ffile01.16sucai.com%2Fd%2Ffile%2F2014%2F0105%2Fc674444dc36392279489f9c6813b6de5.jpg"
        },
        {
          url: "http://music.163.com/song/media/outer/url?id=1383729792.mp3",
          title: "Better Now",
          coverImgUrl:
            "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1590406377409&di=e8c0a447a29377e60b515566952f4388&imgtype=0&src=http%3A%2F%2Fwww.06ps.com%2Fd%2Ffile%2F2017%2F0516%2F1494925549605.jpg"
        },
        {
          url: "http://music.163.com/song/media/outer/url?id=1376075781.mp3",
          title: "Stay The Night",
          coverImgUrl:
            "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1590406377408&di=0d4f067bb3f3121317808b2a6a3aa506&imgtype=0&src=http%3A%2F%2Fb-ssl.duitang.com%2Fuploads%2Fitem%2F201706%2F03%2F20170603164030_Aez5f.jpeg"
        },
        {
          url: "http://music.163.com/song/media/outer/url?id=329418.mp3",
          title: "属于自己",
          coverImgUrl:
            "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1590406671719&di=2c41146f7d5b945d9fbe6652170b5a14&imgtype=0&src=http%3A%2F%2Fb-ssl.duitang.com%2Fuploads%2Fitem%2F201608%2F12%2F20160812180150_ZhFNP.thumb.700_0.jpeg"
        },
        {
          url: "http://music.163.com/song/media/outer/url?id=431080055.mp3",
          title: "虹の彼方に",
          coverImgUrl:
            "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1590406377405&di=1ed57f745d7585a16e80659e3c464e3f&imgtype=0&src=http%3A%2F%2Fb-ssl.duitang.com%2Fuploads%2Fitem%2F201510%2F05%2F20151005030353_GSNea.jpeg"
        }
      ]
    };
  },
  methods: {
    playMusic(index) {
      if (this.isPlay && index == this.currentMusic) {
        wx.pauseBackgroundAudio();
        this.isPlay = false;
      } else {
        // var musicObj = JSON.parse(this.musicList);
        // 监听音乐停止。
        wx.onBackgroundAudioStop(() => {
          if (index == 7) {
            index = -1;
          }
          index += 1;
          this.nextMusic(index);
        });
        this.nextMusic(index);
        // const innerAudioContext = wx.createInnerAudioContext();

        // innerAudioContext.autoplay = true;

        // innerAudioContext.src = 'http://music.163.com/song/media/outer/url?id=515493921.mp3'
        // innerAudioContext.onPlay(() => {
        //     console.log('开始播放');
        // });

        // setTimeout(() => {
        //     innerAudioContext.currentTime
        //     innerAudioContext.onTimeUpdate(() => {
        //     console.log(innerAudioContext.duration) //总时长
        //     console.log(innerAudioContext.currentTime) //当前播放进度
        //     })
        // }, 500);

        // innerAudioContext.onError((res) => {
        //     console.log(res.errMsg)
        //     console.log(res.errCode)
        // });
      }
    },
    nextMusic(index) {
      var musicObj = this.musicList;
      wx.playBackgroundAudio({
        dataUrl: musicObj[index].url,
        title: musicObj[index].title,
        coverImgUrl: musicObj[index].coverImgUrl
      });
      this.isPlay = true;
      this.currentMusic = index;
    }
  }
};
</script>
<style scoped>
.main {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  background-color: #ffffcc;
}
.playList {
  height: 200px !important;
  width: 47% !important;
  margin: 2px 3px 0px 1px;
  border-radius: 10px;
  position: relative;
  text-align: center;
  overflow: hidden;
}
.unselect {
  border: 3px solid orange;
}
.selected {
  border: 3px dashed #3ebfc0;
}
.playContainer {
  position: absolute;
  z-index: 100;
  width: 100%;
  height: 100%;
}
.playicon {
  width: 20%;
  height: 20%;
  margin-top: 80px;
  opacity: 0.7;
}
.musicName {
  margin-top: 15px;
  font-weight: bolder;
  color: lightblue;
  font-size: 20px;
}
/* .gifbody {
  margin: 0;
  background-color: #1a1e21;
  font-family: "ubuntu", Arial, sans-serif;
  overflow-x: hidden;
  display: grid;
  place-items: center;
} */

.music {
  display: grid;
  position: relative;
  width: 180px;
  height: 120px;
  /* border: 8px solid #bebebe;
  border-bottom: 0px;
  border-top-left-radius: 110px;
  border-top-right-radius: 110px; */
}
.music:before,
.music:after {
  content: "";
  position: absolute;
  bottom: -20px;
  width: 40px;
  height: 82px;
  /* background-color: #bebebe;
  border-radius: 15px; */
}
.music:before {
  right: -25px;
}
.music:after {
  left: -25px;
}

.line {
  position: absolute;
  width: 8px;
  min-height: 20px;
  transition: 0.5s;
  animation: equalize 4s 0s infinite;
  animation-timing-function: linear;
  vertical-align: middle;
  bottom: 0 !important;
  box-shadow: inset 0px 0px 16px -2px rgba(0, 0, 0, 0.15);
  background-color: #3ebfc0;
  opacity: 0.7;
}

.line1 {
  left: 30%;
  bottom: 0px;
  animation-delay: -1s;
  /* background-color: #ff5e50; */
}

.line2 {
  left: 40%;
  height: 60px;
  bottom: -15px;
  animation-delay: -2.9s;
  /* background-color: #a64de6; */
}

.line3 {
  left: 50%;
  height: 30px;
  bottom: -1.5px;
  animation-delay: -3.9s;
  /* background-color: #5968dc; */
}

.line4 {
  left: 60%;
  height: 65px;
  bottom: -16px;
  animation-delay: -4.9s;
  /* background-color: #27c8f8; */
}

.line5 {
  left: 70%;
  height: 60px;
  bottom: -12px;
  animation-delay: -5.9s;
  /* background-color: #cc60b5; */
}

@keyframes equalize {
  0% {
    height: 48px;
  }
  4% {
    height: 42px;
  }
  8% {
    height: 40px;
  }
  12% {
    height: 30px;
  }
  16% {
    height: 20px;
  }
  20% {
    height: 30px;
  }
  24% {
    height: 40px;
  }
  28% {
    height: 10px;
  }
  32% {
    height: 40px;
  }
  36% {
    height: 48px;
  }
  40% {
    height: 20px;
  }
  44% {
    height: 40px;
  }
  48% {
    height: 48px;
  }
  52% {
    height: 30px;
  }
  56% {
    /* height: 10px; */
  }
  60% {
    /* height: 30px; */
  }
  64% {
    /* height: 48px; */
  }
  68% {
    /* height: 30px; */
  }
  72% {
    height: 48px;
  }
  76% {
    height: 20px;
  }
  80% {
    height: 48px;
  }
  84% {
    height: 38px;
  }
  88% {
    height: 48px;
  }
  92% {
    height: 20px;
  }
  96% {
    height: 48px;
  }
  100% {
    height: 48px;
  }
}
</style>