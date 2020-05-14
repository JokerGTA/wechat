<template>    
<div class="maina">
    <div class="banner">
        <img src="../../../static/images/780.jpg">
    </div>
    <div class="vabutton">
        <van-button        
        size="large"
        type="info"
        @click="ToSubway"
        color="linear-gradient(to right, #163E84, #6149f6)"
      >查看地铁路线图</van-button>
    </div>
      <div class="vabutton">
        <van-button        
        size="large"
        type="info"
        @click="ToMayLine"
        color="linear-gradient(to right, #163E84, #6149f6)"
      >使用路线规划</van-button>
    </div>
    <div class="vabutton">
        <van-button        
        size="large"
        type="info"
        @click="ToPointLine"
        color="linear-gradient(to right, #163E84, #6149f6)"
      >查看附近地图信息</van-button>
    </div>
    <div class="footer">
        <img src="../../../static/images/350.jpg">
    </div>
</div>
</template>

<script>
var latitude=0;
var longitude=0;
var endPointName="我附近";
const chooseLocation = requirePlugin('chooseLocation');
export default {
    data(){
        return{
          //screenWidth: wx.getSystemInfoSync().windowHeight,
            key:'AB4BZ-WOTKW-SX2R4-RHCYH-BU57J-DGB4F',
            referer:'呕吼十万伏特',
        };
    },
    methods:{
        ToSubway(){
			let plugina = requirePlugin("subway");
            wx.navigateTo({
            url: 'plugin://subway/index?key=' + this.key + '&referer=' + this.referer
            });
        },
        ToMayLine(){            
            let plugin = requirePlugin('routePlan');      
            let endPoint = JSON.stringify({  //终点
            'name': endPointName,
            'latitude': latitude+0.001,
            'longitude': longitude+0.001
            });
            console.log(endPoint);
            wx.navigateTo({
            url: 'plugin://routePlan/index?key=' + this.key + '&referer=' + this.referer + '&endPoint=' + endPoint+'&mode=transit'
            });
        },
        ToPointLine(){            
            const location = JSON.stringify({
            latitude: latitude,
            longitude:longitude
            });
            const category = '美食,购物,旅游景点';

            wx.navigateTo({
            url: `plugin://chooseLocation/index?key=${this.key}&referer=${this.referer}&category=${category}`
            });
        }
    },
     mounted() {
        wx.getLocation({
            type:'wgs84',
            success:function(res){
                 latitude = res.latitude;
                 longitude = res.longitude;                            
            }
        });                 
    },
    onShow () {
    var ssslocation = chooseLocation.getLocation(); // 如果点击确认选点按钮，则返回选点结果对象，否则返回null
    if(ssslocation!=null)
    {
        console.log(ssslocation);
        endPointName =ssslocation.name;
        latitude = ssslocation.latitude;
        longitude = ssslocation.longitude;
    }        
  }
}
</script>

<style scoped>
.maina{
    background:#E3EFEE;
    height: 100vh;
    width: 100vw;   
    display: flex;
    flex-direction:column;
    justify-content:space-between 
}
.banner{
    text-align: center;    
}
.banner img{
    width: 100vw;
    height: 150px;
}
.vabutton{
    margin-bottom: 10px;   
}
.footer img{
    width: 100vw;
    height: 180px;
}
</style>