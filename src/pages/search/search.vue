<template>
    <div class="main">
        <div class="circular">
            <open-data type="userAvatarUrl"></open-data>
        </div>
        <br/>
        <div class="name">
            <open-data type="userNickName"></open-data>
        </div>        
        <button open-type="getUserInfo" @getuserinfo="getUserInfo" >授权登录</button>
         <!-- <van-button         
        round
        size="normal"
        type="info"
        @click="toChatroom"
        color="linear-gradient(to right, #8BD18B,#156F12)"
      ><span class="butt">　去聊天　</span></van-button> -->
    </div>
</template>
<script>
// import QQMapWX from '../../../static/tencentjs/qqmap-wx-jssdk';
// var qqmapsdk;
export default {
    data(){
        return{
            screenWidth: wx.getSystemInfoSync().windowHeight,
        }
    },
     methods:{
        create() {
            // 实例化API核心类
            // qqmapsdk = new QQMapWX({
            //     key: 'AB4BZ-WOTKW-SX2R4-RHCYH-BU57J-DGB4F'
            // });
        },
        onShow () {           
            // 调用接口
            qqmapsdk.search({
                keyword: '酒店',
                success: function (res) {
                    console.log(res);
                },
                fail: function (res) {
                    console.log(res);
                },
                complete: function (res) {
                console.log(res);
            }
        });
    },
        getUserInfo(e) {
            wx.getSetting({
                success: function(res){
                    console.log(res);
                    if (res.authSetting['scope.userInfo']) {          
                        mpvue.navigateTo({
                            url: '../chatroom/main'
                        }); 
                    }
                    else{
                        
                    }
                }
            });          
        }
    },
}

</script>
<style scoped>
.main{
    display: flex;
    flex-direction:column;
    justify-content: center;
    text-align: center;
}
.main img{   
    width:100vw;
    height: 100vh;
}
.circular{    
    width: 80px;
    height: 80px;        
    border-radius: 50%;
    overflow: hidden;
    margin: 20px auto;
}
.name{
    width: 100px;
    height: 50px;
    margin: auto;
    font-weight: bolder;
}
.butt{
    color: whitesmoke;
}
</style>