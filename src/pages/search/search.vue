<template>
    <div class="main">
        <div class="container">
            <div class="circular">
            <open-data type="userAvatarUrl"></open-data>
            </div>
            <br/>
            <div class="name">
                <open-data type="userNickName"></open-data>
            </div>        
            <button open-type="getUserInfo" @getuserinfo="getUserInfo" class="butt">授权登录</button>
        </div>        
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
    width:100vw;
    height: 100vh;
    display: flex;
    flex-direction:column;
    justify-content: center;
    text-align: center;
    background-color: #99CCCC;
}
.container{
    margin-bottom: 120px;
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
    background-color:#336666;
    width: 100px;
    color: #FFCC00;
    font-weight: bolder;
}
</style>