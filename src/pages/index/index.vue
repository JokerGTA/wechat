<template>
  <div class="container">
    <van-notice-bar
      left-icon="volume-o"
      color="#1989fa"
      background="#ecf9ff"
      speed = 70
      :text="weatherText"
    />   
    <!-- <swp :images="images" /> -->
    <van-divider contentPosition="left" customStyle="border-color: #99CCFF; font-size: 18px;"><p class="title">基础代谢测试</p></van-divider>
    
    <div class="BMRContent">
      <div style="width:30%">
        <van-radio-group :value="radio" @change="radioChange">
          <van-radio name="1" use-icon-slot :value="radio">
            <span><font style="font-size:15px;font-weight:bolder;color:#336699">小锅锅</font></span>
            <img slot="icon" :src="maleImg" style='width:40px;height:42px;'/>
          </van-radio>
          <van-radio name="0" use-icon-slot :value="radio">
            <span><font style="font-size:15px;font-weight:bolder;color:#CC6699">小改改</font></span>
            <image slot="icon" :src='femaleImg' style='width:40px;height:42px;'/>
          </van-radio>
        </van-radio-group>
      </div>
      <div style="display:flex;flex-direction: row;width:70%;justify-content:center;align-items:center">
        <input type="digit" placeholder="体重(公斤)" class="BMRinput" v-model="bodyWeight"></input>
        <input type="digit" placeholder="身高(厘米)" class="BMRinput" v-model="bodyHeight"></input>
        <input type="digit" placeholder="年龄" class="BMRinput" v-model="Age"></input>
      </div>
    </div>
        
    <div class="refreshButton">
      <van-button
        size="small"
        type="info"
        @click="calcBMR"
        color="linear-gradient(to right, #4bb0ff, #6149f6)"
      >计算结果</van-button>
    </div>
    <van-dialog id="van-dialog" />
     
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
      <div v-for="(item, index) in foodsInfo" :key="index" class="nice" @click="foodDetail(item.detail_url)">
        <van-image :src="item.picture_url" width="100%" height="80%" fit="cover"/>
        <div class="foot_boot">
          <div class="food_name"> {{item.name}}</div>
          <div class="food_calorie">  <image src='https://6465-dev-iu973-1301970690.tcb.qcloud.la/%E7%83%AD%E9%87%8F.png' style="width:20px;height:20px;margin-right:4px;" />
          <label>{{item.calorie}} Calorie</label></div>
        </div>        
      </div>    
    </div>
    
    <!-- <div class="message" @click="clickHandle">{{msg}}</div>
     <click-counter :initNum="20" /> -->
  </div>
</template>
<script>
import clickCounter from "../../components/click-counter";
import swp from "../../components/sw";
import Dialog from '../../../static/vant/dialog/dialog';
export default {
  components: {
    clickCounter,
    swp
  },
  data() {
    return {
      msg: "Ken",
      images: [],
      foodsInfo:[],
      tabsData: [
        { text: "午餐" },
        { text: "下午茶" },
        { text: "晚餐" },
        { text: "夜宵" },
        { text: "早餐" }
      ],
      iRandom: 0,
      active: 0,
      currentTab:0,
      weatherText:"天气预报~~~",
      radio:'1',
      maleImg:'https://6465-dev-iu973-1301970690.tcb.qcloud.la/%E7%94%B7%E7%94%9F.png',
      femaleImg:'https://6465-dev-iu973-1301970690.tcb.qcloud.la/%E5%A5%B3%E7%94%9F(%E7%81%B0%E8%89%B2).png',
      bodyWeight:'',
      bodyHeight:'',
      Age:''
    };
  },
  methods: {
    radioChange(event) {
      this.radio = event["target"][0];
      if(this.radio=='1')
      {
        this.maleImg='https://6465-dev-iu973-1301970690.tcb.qcloud.la/%E7%94%B7%E7%94%9F.png';
        this.femaleImg='https://6465-dev-iu973-1301970690.tcb.qcloud.la/%E5%A5%B3%E7%94%9F(%E7%81%B0%E8%89%B2).png';
      }
      else{
        this.maleImg='https://6465-dev-iu973-1301970690.tcb.qcloud.la/%E7%94%B7%E7%94%9F(%E7%81%B0%E8%89%B2).png';
        this.femaleImg='https://6465-dev-iu973-1301970690.tcb.qcloud.la/%E5%A5%B3%E7%94%9F.png';
      }
    },
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
      // 获取默认数据库的引用
      const db = wx.cloud.database();
      db.collection('foods')
      .get()
      .then(res => {
        this.foodsInfo = res.data;
      });
      // this.$net
      //   .get("https://api.shutterstock.com/v2/images/search?s=food&query=food&per_page=10&authentic=true&orientation=horizontal&image_type=photo&safe=true&width_from=5000&width_to=6500&height_from=3000&height_to=4500&sort=popular&anyorall=all&u=http%3A%2F%2Fwww.shutterstock.com%2Fcat.mhtml",{})
      //   .then(res => {
      //     for (let i = 0; i < res.data.length; i++) {
      //       this.images2.push({
      //         url:res.data[i].assets.huge_thumb["url"]
      //       });            
      //     }
      //   });         
    },
    getWeatherInfo(province,city,district){      
      var url = "https://wis.qq.com/weather/common?source=xw&weather_type=forecast_1h|forecast_24h|index|alarm|limit|tips&province="+province+"&city="+city+"&county="+district;
      this.$net.get(url)
      .then(res=>{
          console.log(res["data"]);
          var alarm = res["data"]["alarm"];
          var today = res["data"]["forecast_24h"][1];
          var tip = res["data"]["index"];
          if(alarm.length>0)
          {
            this.weatherText = res["data"]["alarm"][0]["detail"];
          }
          else{
            this.weatherText ="　　　"+province+"-"+city+"-"+district+"－"+today["time"] 
            + '　白天天气为' + today['day_weather'] + ","  + today["day_wind_power"] + "级" 
            + today["day_wind_direction"] + '。' 
            + '　晚上天气为' + today['night_weather'] + "," + today["day_wind_power"] + "级" 
            + today["day_wind_direction"] + "。"
            + "　最高气温为" + today["max_degree"] + "℃，最低气温为" 
            + today["min_degree"] + "℃。"  
            + "　　温馨提示：["+tip["clothes"]["name"]+"-" + tip["clothes"]["detail"]+"][" 
            +tip["umbrella"]["name"]+"-" + tip["umbrella"]["detail"] +"]["
            +tip["dry"]["name"]+"-" + tip["dry"]["detail"] +"]["
            +tip["mood"]["name"]+"-" + tip["mood"]["detail"] +"]"
            // +tip["ultraviolet"]["name"]+"-" + tip["ultraviolet"]["detail"] +"]"
          }          
      });
    },
    foodDetail(url)
    {      
      mpvue.navigateTo({
          url: '../food_detail/main?url='+url
      }); 
    },
    calcBMR()
    {
      if(!this.bodyWeight.length>0)
      {
        this.dialogAlert("请输入体重。");
        return
      }
      if(!this.bodyHeight.length>0)
      {
        this.dialogAlert("请输入身高。");
        return
      }
      if(!this.Age.length>0)
      {
        this.dialogAlert("请输入年龄。");
        return
      }
      var BMRrate=0;
      if(this.radio=="1")
      {      
        BMRrate = 66 + 13.7*parseInt(this.bodyWeight)  + 5*parseInt(this.bodyHeight) -6.8*parseInt(this.Age)
      }
      else{
        BMRrate = 655 + 9.6*parseInt(this.bodyWeight) + 1.8*parseInt(this.bodyHeight) -4.7*parseInt(this.Age)
      }
      this.dialogAlert("您的基础代谢为：" + BMRrate.toFixed(2)+"kcal.");
    },
    dialogAlert(msg)
    {
       Dialog.alert({
        title: '测试结果',
        message: msg
        }).then(() => {
        // on close
      });
    }
  },
  mounted() {
    let that = this;
    this.getData();
    this.getSwitchData();
    wx.getLocation({
          type:'wgs84',
          success:function(res){
              wx.request({
                  url: 'http://api.map.baidu.com/reverse_geocoding/v3/?ak=4pFvnBZVXLqI7TAWo9bNnHexAmgAfkbQ&location='+res.latitude+','+res.longitude+'&output=json',
                  data: {},
                  header: {
                    'Content-Type': 'application/json'
                  },
                  success: function (res) {
                    // success 获取当前位置省/市/区
                    var province = res["data"]["result"]["addressComponent"]["province"];
                    var city = res["data"]["result"]["addressComponent"]["city"];
                    var district = res["data"]["result"]["addressComponent"]["district"];
                    that.getWeatherInfo(province,city,district);
                  },
                  fail: function (error) {
                    console.log(error);
                  },
                  });
          }
      });
  }
};
function getRandomNumber(max, min) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function radioChange(event) {
  this.radio = event.detail;
}
</script>


<style scoped>
.title{
  font-weight:bolder;
  margin:10px 0px;
  font-size:18px;
  color:#0099CC
}
.BMRContent{
  display:flex;
  flex-direction: row;
  justify-content:center;
  border:2px dashed #3ebfc0;
  padding:10px 0px;
  margin-bottom:10px;
}
.BMRinput{
  border:2px solid #99CC66;
  width:35%;
  border-radius:4px;
  margin-right:3px;
}
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
  height:250px !important;
  width: 48% !important;
  overflow: hidden;
  margin: 0 2px 2px 1px;
  border-radius: 10px;
  border:2px solid #99CC33;
  background: #99CCFF;
}
.foot_boot{
  display: flex;
  flex-direction: column;
  justify-content:center;
  align-items:center; 
}
.food_name{
  font-weight: bolder;
  font-size: 18px;
}
.food_calorie{
  display: flex;
  font-style: "微软雅黑";
  color: coral;  
}
</style>
