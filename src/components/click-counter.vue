<template>
  <div class="click-counter container">
    <div class="counter-num">次数：{{num}}</div>
    <van-button
      round
      size="small"
      type="info"
      @click="handleClick"
      color="linear-gradient(to right, #4bb0ff, #6149f6)"
    >点击计数</van-button>
    <!-- <button class="counter-btn" @click="handleClick">点击计数</button> -->
    <button class="counter-reset-btn" @click="handleResetClick">清零</button>
  </div>
</template>
<script>
export default {
  props: {
    initNum: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      num: this.initNum
    };
  },
  methods: {
    handleClick() {
      this.num += 1;
      this.notifyNum();
    },
    handleResetClick() {
      this.num = 0;
      this.notifyNum();
    },
    notifyNum() {
      this.$emit("handleClickNum", { num: this.num, pp: "吼吼吼吼" });
    }
  }
};
</script>
<style>
.click-counter {
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid red;
  background-color: #ffffff;
  padding: 10px;
}

.counter-num,
.counter-btn,
.counter-reset-btn {
  flex: 1;
  margin: 3px;
}
</style>