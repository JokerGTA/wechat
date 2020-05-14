<template>
    <div class="main">
        <van-notify id="van-notify" />
        <!-- <div class="chatMsgContainer" id="chatMsg" :scrollTop="scrollTop" > -->
            <scroll-view scroll-y="true" :scroll-into-view="bottom" :style="chatScreenHeight">
            <ul>
                <li v-for="(item,index) in msgs" :key="index" v-html="item" class="chatli" :id="'item'+index"></li>
            </ul>
            </scroll-view>
        <!-- </div> -->
        <van-popup
        :show= "popshow"
        round = true
        :overlay = "popoverlay"
        position="bottom"
        custom-style="height:90px;background:#99CCFF"
        @close="onClose"
        >
            <div class="chatContainer">
                
                <input class="weui-input" v-model="mineMsg"/>

                <van-button
                round
                size="normal"
                type="info"
                @click="sendMsg"
                color="linear-gradient(to right, #3399CC, #003366)"
                class="sendButton"
                >发　送</van-button>
            </div>
        </van-popup>
    </div>    
</template>

<script>
import Notify from '../../../static/vant/notify/notify';

let socketOpen=false;
let socketMsgQueue =[];
let userPic="";
let userNick="";
export default {
    data() {
        return {
            websock: null,
            wsuri : "wss://www.93yz95rz.club/ws?userId=4&&userName=野原新之助&&userHeadPic=3",
            popshow:true,
            popoverlay:false,
            mineMsg:"",
            msgs:[],
            chatScreenHeight:"height:"+(wx.getSystemInfoSync().windowHeight*1-50)+"px",
            scrollTop:0,
            bottom:"item0"
        }
    },
    mounted() {
        wx.getUserInfo({
            success: function(res) {
                // console.log(res.userInfo)
                userPic = res.userInfo.avatarUrl;
                userNick = res.userInfo.nickName
                Notify({
                    message: userNick+" 大佬进来了！",
                    color: '#ad0000',
                    background: '#ffe1e1',
                });
            }
        })
        this.initWebSocket();
    },
    destroyed() {
        closeWebSocket(); //离开路由之后断开websocket连接
    },
    methods: {
      initWebSocket(){ //初始化weosocket
        console.log("我进来了")
        // createConnect();
        wx.onSocketOpen(function(res){
            console.log('WebSocket连接已打开！');
            socketOpen = true;
            for (var i = 0; i < socketMsgQueue.length; i++){
                sendMessage(socketMsgQueue[i]);
            }
            socketMsgQueue = [];
        });
        wx.onSocketError(function(res){
            console.log('WebSocket连接打开失败，请检查！')
        });
        wx.onSocketClose(function(res) {
            console.log('WebSocket 已关闭！！');
            createConnect(); 
        });
    },
    onClose(e) {
            this.popshow=false;
        },
    sendMsg(){
            if(this.mineMsg.length>0)
            {
                let innerLeftHtml="<div style='display:flex;flex-direction:row'><div style='border-radius:10px;width:50px;height:50px;overflow:hidden;margin:10px'><img src='"+userPic+"' style='width:50px;height:50px;'/></div>"
                +"<div><p style='font-size: 12px;font-weight: bolder;margin:10px 0px 5px 0px'>"+userNick+"　"+this.$dateNow.getDate()+"</p><div style='padding:5px;border-radius:5px;background-color:#99CCCC;max-width: 200px;word-wrap: break-word;word-break: break-all;'>"+this.mineMsg+"</div></div></div>";

                let innerRightHtml="<div style='display:flex;flex-direction:row-reverse'><div style='border-radius:10px;width:50px;height:50px;overflow:hidden;margin:10px'><img src='"+userPic+"' style='width:50px;height:50px;'/></div>"
                +"<div><p style='font-size: 12px;font-weight: bolder;margin:10px 0px 5px 0px;float:right'>"+userNick+"　"+this.$dateNow.getDate()+"</p><br style='clear: both;' /><div style='padding:5px;border-radius:5px;background-color:#FFCC99;max-width: 200px;word-wrap: break-word;word-break: break-all;'>"+this.mineMsg+"</div></div></div>";
                this.msgs.push(innerLeftHtml);
                this.msgs.push(innerRightHtml);
                this.bottom = "item"+(this.msgs.length*1-1);
                console.log(this.chatScreenHeight);
            }
            this.mineMsg="";
        }
    },
}

// 建立连接
function createConnect()
{
    wx.connectSocket({
        url: "wss://www.93yz95rz.club/ws?userId=4&&userName=野原新之助&&userHeadPic=3"
    });
}

// 发送信息
function sendMessage(msg){
    if (socketOpen) {
            wx.sendSocketMessage({
            data:msg
        });
    }    
    else {
        socketMsgQueue.push(msg);
    }
}

// 关闭连接
function closeWebSocket()
{
    wx.closeSocket();
}
</script>

<style scoped>
.main{
    width:100vw;
    height: 100vh;
    background-color:#CCCCFF
}
.chatMsgContainer{
    height: 500px;
    overflow: auto ;
}
.chatContainer{
    display: flex;
    flex-direction:row;
}
.weui-input {
    width:70%;
    height: 40px;
    min-height: 40px;
    line-height: 40px;
    border:2px black solid;
    border-radius: 10px;
    margin: 20px 0 0 10px;
    padding-left: 5px;
    background-color: blanchedalmond;
}
.sendButton{
    margin:20px 0 0 10px;
}
</style>