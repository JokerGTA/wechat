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
      musicList: [],
    };
  },
  methods: {
    playMusic(index) {
      var that = this;
      if (this.isPlay && index == this.currentMusic) {
        wx.pauseBackgroundAudio();
        this.isPlay = false;
      } else {
        wx.onBackgroundAudioStop(() => {
          if (index == that.musicList.length-1) {
              index = -1;
            }
            index += 1;
            this.nextMusic(index);
        });
        this.nextMusic(index);
        // wx.seekBackgroundAudio({
        //     position: 180
        // });
        // console.log("跳转180");
        // bam.onEnded(function(){
        //   console.log("自然播放完成");
        //     if (index == 7) {
        //       index = -1;
        //     }
        //     index += 1;
        //     that.nextMusic(index);
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
    },
    getBackMusicStatus()
    {
      console.log("我进来了"); 
      var that = this;
      wx.getBackgroundAudioPlayerState({
        success (res) 
        {
          const status = res.status // 播放状态 0-暂停中 1-播放中 2-没有音乐播放
          const dataUrl = res.dataUrl // 歌曲数据链接，只有在音乐播放中时返回
          const currentPosition = res.currentPosition // 选定音频的播放位置（单位：s），只有在音乐播放中时返回
          const duration = res.duration // 选定音频的长度（单位：s），只有在音乐播放中时返回
          const downloadPercent = res.downloadPercent // 音频的下载进度百分比，只有在音乐播放中时返回
          console.log(res);
        }
      });
    }
  },
  mounted(){
    // 获取默认数据库的引用
    const db = wx.cloud.database();
    db.collection('music')
      .get()
      .then(res => {
        this.musicList = res.data;
      });
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