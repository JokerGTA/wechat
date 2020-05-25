<template>
    <div class="main">
        <van-notify id="van-notify" />
        <!-- <div class="chatMsgContainer" id="chatMsg" :scrollTop="scrollTop" > -->
            <scroll-view scroll-y="true" :scroll-into-view="bottom" :style="'height:'+chatScreenHeight+'px;'" :scroll-with-animation="animation">
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
        :custom-style="'height:90px;background:#99CCFF;bottom:'+inputScreenHeight+'px;'"
        @close="onClose"
        >
            <div class="chatContainer" cursor-spacing="140">
                
                <input class="weui-input" v-model="mineMsg" :adjust-position="inputPostion" @focus="inputFocus" @blur="inputBlur" hold-keyboard="true"/>

                <van-button
                round
                size="normal"
                type="info"
                @tap="sendMsg"
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

const appId="wx364420dabcfdae14";
const appSecret="5a34bc0b5d0a8a3c9a1c2e04f63e77d9";
export default {
    data() {
        return {
            websock: null,
            popshow:true,
            popoverlay:false,
            mineMsg:"",
            msgs:[],
            chatScreenHeight:wx.getSystemInfoSync().windowHeight*1-50,
            inputScreenHeight:0,
            scrollTop:0,
            bottom:"item0",
            inputPostion:false,
            keyboardHeight:0,
            animation:true,
            userOpenId:''
        }
    },
    mounted() {
        this.inputScreenHeight = 0;
        this.chatScreenHeight = wx.getSystemInfoSync().windowHeight*1-120;
        wx.getUserInfo({
            success: function(res) {
                userPic = res.userInfo.avatarUrl;
                userNick = res.userInfo.nickName; //.replace("","")                
                Notify({
                    message: userNick+" 大佬进来了！",
                    color: '#ad0000',
                    background: '#ffe1e1',
                });
            }
        });        
        this.getOpenId();
        // this.getHistoryMsg();
    },
    destroyed() {
        closeWebSocket(); //离开路由之后断开websocket连接
    },
    methods: {
        getOpenId(){
            var that = this;
            wx.login({  
                success: function(res){
                    if(res.code) {
                        var l='https://api.weixin.qq.com/sns/jscode2session?appid='+appId+'&secret='+appSecret+'&js_code='+res.code+'&grant_type=authorization_code';  
                        wx.request({  
                            url: l,  
                            data: {},  
                            method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT  
                            // header: {}, // 设置请求的 header  
                            success:((res)=>{
                                that.userOpenId= res.data.openid;
                                that.initWebSocket();
                                // var obj={};
                                // obj.openid=res.data.openid;  
                                // obj.expires_in=Date.now()+res.data.expires_in;
                                // wx.setStorageSync('user', obj);//存储openid  
                            })
                        });
                    }else {
                        console.log('获取用户登录态失败！' + res.errMsg)
                    }
                }
            })
        },
        initWebSocket(){ //初始化weosocket
            console.log("我进来了")
            var that = this;
            that.createConnect(); // 创建websocket连接
            wx.onSocketOpen(function(res){
                console.log('WebSocket连接已打开！');
                socketOpen = true;
                for (var i = 0; i < socketMsgQueue.length; i++){
                    sendMessage(socketMsgQueue[i]);
                }
                socketMsgQueue = [];
            });
            wx.onSocketError(function(res){
                console.log('WebSocket连接打开失败，请检查！');
                console.log(res);
            });
            wx.onSocketClose(function(res) {
                console.log('WebSocket 已关闭！！');
                that.createConnect(); 
            });
            wx.onSocketMessage(function (res) {
                var msgData = JSON.parse(res.data)
                console.log(res)
                if(msgData.WsType==0)
                {
                    let innerLeftHtml="<div style='display:flex;flex-direction:row'><div style='border-radius:10px;width:50px;height:50px;overflow:hidden;margin:10px'><img src='"+msgData.UserHeadPic+"' style='width:50px;height:50px;'/></div>"
                    +"<div><p style='font-size: 12px;font-weight: bolder;margin:10px 0px 5px 0px'>"+msgData.UserName+"　"+that.$dateNow.getDate()+"</p><div style='padding:5px;border-radius:5px;background-color:#99CCCC;max-width: 200px;word-wrap: break-word;word-break: break-all;'>"+msgData.Msg+"</div></div></div>";
                    that.msgs.push(innerLeftHtml);
                    that.bottom = "item"+(that.msgs.length*1-1);
                }
                if(msgData.WsType==1)
                {
                    Notify({
                        message: msgData.UserName+" 大佬进来了！",
                        color: '#ad0000',
                        background: '#ffe1e1',
                    });
                }
            });
        },
        createConnect() // 建立连接
        {    
            var urls =encodeURI("wss://www.93yz95rz.club/ws?userId="+this.userOpenId+"&userName="+userNick+"&userHeadPic="+userPic);
            console.log(urls);
            wx.connectSocket({
                url: urls,
                header:{
                            'Host': 'www.93yz95rz.club',
                            'Accept-Encoding':'gzip, deflate, br',
                            'Accept-Language':'zh-CN,zh;q=0.9',
                            'Cache-Control':'no-cache',
                            'Connection':'Upgrade',
                            'Pragma':'no-cache',
                            'Sec-WebSocket-Extensions':'permessage-deflate; client_max_window_bits',
                            'Upgrade':'websocket'
                        },
            });
        },
        onClose(e) {
                this.popshow=false;
            },
        sendMsg(){
            this.removeMsgSpace();
            if(this.mineMsg.length>0)
            {
                let innerRightHtml="<div style='display:flex;flex-direction:row-reverse'><div style='border-radius:10px;width:50px;height:50px;overflow:hidden;margin:10px'><img src='"+userPic+"' style='width:50px;height:50px;'/></div>"
                +"<div><p style='font-size: 12px;font-weight: bolder;margin:10px 0px 5px 0px;float:right'>"+userNick+"　"+this.$dateNow.getDate()+"</p><br style='clear: both;' /><div style='padding:5px;border-radius:5px;background-color:#FFCC99;max-width: 200px;word-wrap: break-word;word-break: break-all;'>"+this.mineMsg+"</div></div></div>";             
                this.msgs.push(innerRightHtml);
                sendMessage(this.mineMsg);
                this.bottom = "item"+(this.msgs.length*1-1);
            }
            this.mineMsg="";
        },
        getHistoryMsg(){
            this.$net
                .get("https://www.93yz95rz.club/api/room/data",{})
                .then(res => {
                    for (let i = 0; i < res.oldMessage.length; i++) {
                        console.log(res.oldMessage[i].msgContext);     
                    }
                });
        },
        inputFocus(e){
            if(e.mp.detail.height>0)
            {
                this.keyboardHeight = e.mp.detail.height;
                this.inputScreenHeight += this.keyboardHeight;
                this.chatScreenHeight -= this.keyboardHeight
                this.msgs.unshift("");
                this.bottom = "item"+(this.msgs.length*1-1);
                // setTimeout(()=>{
                //    this.msgs.splice(0,1);
                // }, 1000);
            }
        },
        inputBlur(){
            this.inputScreenHeight -= this.keyboardHeight*1;
            this.chatScreenHeight += this.keyboardHeight
        },
        removeMsgSpace(){
            for(var i=0;i<this.msgs.length;i++)
            {
                if(this.msgs[i]=="")
                {
                    this.msgs.splice(i,1);
                }
                else{
                    break;
                }
            }
        }
    },
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