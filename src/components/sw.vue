<template>
  <swiper
    class="swiper"
    :indicator-dots="indicatorDots"
    :autoplay="autoplay"
    :interval="interval"
    :duration="duration"
    :nextMargin="nextMargin"
    circular="true"
    style="min-height:300px;"
  >
    <block v-for="(item, index) in images" :key="index">
      <swiper-item>
        <div style="height:280px;width:220px;">
          <image
            :src="item.url"
            class="slide-image"
            mode="scaleToFill"
            @click="previewImg(images,item.url)"
          />
        </div>
      </swiper-item>
    </block>
  </swiper>
</template>

<script>
export default {
  props: {
    images: {
      type: Array
    }
  },
  data() {
    return {
      indicatorDots: false,
      autoplay: true,
      interval: 3000,
      duration: 500,
      nextMargin: 80, //后边距，可用于露出后一项的一小部分，接受 px 和 rpx 值
      circular: true //是否采用衔接滑动
    };
  },
  methods: {
    setNextMarinPx() {
      var sysInfo = wx.getSystemInfoSync();
      var screenWidth = sysInfo.screenWidth;
      this.nextMargin = screenWidth - 235;
    },
    previewImg(lst, current) {
      console.log(current);
      wx.previewImage({
        current: current, // 当前显示图片的http链接
        urls: [current] // 需要预览的图片http链接列表
      });
    }
  },
  mounted() {
    this.setNextMarinPx();
  }
};
</script>

<style scoped>
image {
  width: 100%;
  height: 100%;
  margin: 10px;
  border-radius: 10px;
  box-shadow: 3px 3px 10px gray;
}
</style>