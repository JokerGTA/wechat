<template>
  <div class="container">
    <swp :images="images" />
    <div class="refreshButton">
      <van-button
        round
        size="small"
        type="info"
        @click="getData"
        color="linear-gradient(to right, #4bb0ff, #6149f6)"
      >换一换</van-button>
    </div>
    <swiper
      class="sw-middle"
      :indicator-dots="false"
      :autoplay="true"
      :interval="6000"
      :duration="500"
      :next-Margin="100"
      :previous-margin="100"
      :circular="true"
      @change="sw_middle_change"      
    >
      <block v-for="(item, index) in tabsData" :key="index">
        <swiper-item :itemId="index" :class="{'main-item':index==currentTab,'other-item':index!=currentTab}">{{item.text}}</swiper-item>
      </block>
    </swiper>
    
    <div class="big_nice">
      <div v-for="(item, index) in images2" :key="index" class="nice">
        <van-image :src="item.url" width="100%" height="110%" fit="cover"/>      
      </div>    
    </div>
    

    <!-- <div class="message" @click="clickHandle">{{msg}}</div>
     <click-counter :initNum="20" /> -->
  </div>
</template>
<script>
import clickCounter from "../../components/click-counter";
import swp from "../../components/sw";

export default {
  components: {
    clickCounter,
    swp
  },
  data() {
    return {
      msg: "Ken",
      images: [],
      images2:[],
      tabsData: [
        { text: "午餐" },
        { text: "下午茶" },
        { text: "晚餐" },
        { text: "夜宵" },
        { text: "早餐" }
      ],
      iRandom: 0,
      active: 0,
      currentTab:0
    };
  },
  methods: {
    clickHandle() {
      this.msg = "哈哈哈哈哈";
    },
    handleClickNum(data) {
      console.log(">>>>>>", data.num);
      console.log(">>>>>>", data.pp);
    },
    getData() {
      this.images = [];
      this.iRandom = getRandomNumber(0, 8);      
      this.$net
        .get("https://cn.bing.com/HPImageArchive.aspx?format=js&idx=" +this.iRandom +"&n=12",{})
        .then(res => {
          for (let i = 0; i < res.images.length; i++) {
            this.images.push({
              url: "https://cn.bing.com/" + res.images[i].url
            });
          }
        });
    },
    sw_middle_change(e){
      this.currentTab=e.mp.detail.current;
    },
    getSwitchData(){
       this.$net
        .get("https://api.shutterstock.com/v2/images/search?s=food&query=food&per_page=10&authentic=true&orientation=horizontal&image_type=photo&safe=true&width_from=5000&width_to=6500&height_from=3000&height_to=4500&sort=popular&anyorall=all&u=http%3A%2F%2Fwww.shutterstock.com%2Fcat.mhtml",{})
        .then(res => {
           for (let i = 0; i < res.data.length; i++) {
             this.images2.push({
               url:res.data[i].assets.huge_thumb["url"]
             });            
          }
        });         
    }
  },
  mounted() {
    this.getData();
    this.getSwitchData();
  }
};
function getRandomNumber(max, min) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
</script>


<style scoped>
.message {
  color: rebeccapurple;
  padding: 10px;
  text-align: center;
}
.refreshButton {
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: center;
}
.tab-container {
  width: 50%;
  margin: auto;
}
.sw-middle{
  width:260px;
  margin:20px auto 10px auto;
   height: 50px !important;
}
.sw-middle swiper-item{
   width:80px !important;
   text-align: center;     
}
.main-item{
  font-size: 20px;
  font-weight: bold;
  font-family:"微软雅黑" ;
  color: salmon;  
}
.other-item{
  margin-top:5px ;
  color: burlywood;
  font-weight: bold; 
}
.big_nice{
  display: flex;
  flex-direction: row;
  flex-wrap:wrap;
  justify-content:center;
}
.nice{
  height:200px !important;
  width: 48% !important;
  overflow: hidden;
  margin: 0 2px 2px 1px;
  border-radius: 10px;
  border:2px solid rgb(69, 138, 143);
}
</style>
