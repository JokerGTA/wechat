<template>
    <div class="main">
        <canvas type="2d" id="myCanvas" :style="range" @touchmove="ballMoveEvent"></canvas>
        <!-- <img :src="picPath" width="100" height="100"> -->
    </div>
</template>
<script>
export default {
    data(){
        return {
            canvas : null,
            ctx : null,
            windowWidth:0,
            windowHeight:0,
            range:"",
            picPath:'https://6465-dev-iu973-1301970690.tcb.qcloud.la/%E9%A3%9E%E6%9C%BA.png',
            imgX:50,
            imgY:120,
            image:null,
            interval:null,
            bottom:0,
            qdpr:0,
            fix :30
        }
    },
    methods:{
        drawRect(x, y,image) {
            const size = 10*this.qdpr;
            this.ctx.clearRect(0, 0, this.windowWidth, this.windowHeight);
            this.ctx.fillRect(x, y, 20, 20);
            this.ctx.drawImage(image,this.imgX, this.imgY, size, size);
            
            // console.log(this.imgX+"/"+x+","+this.imgY+"/"+y);
            if ((this.imgX > x-size  && this.imgX < x + 20) && (this.imgY > y-size && this.imgY < y + 20)) { // 飞机与矩形发生碰撞
                clearInterval(this.interval);
                wx.showModal({
                    title: '提示',
                    content: '发生碰撞，游戏结束！',
                    showCancel:false,//是否显示取消按钮
                    confirmText:"OK",//默认是“确定”
                    confirmColor: 'skyblue',//确定文字的颜色
                    success:(res) => {
                        if (res.confirm) {
                            this.recoveryCanvas();
                        } else if (res.cancel) {
                            this.recoveryCanvas();
                        }
                    },
                });
            }
        },
        ballMoveEvent(e){ // 监听画布拖动事件
            // console.log(e.x+"///"+e.y);
            this.imgX = e.x = (e.x-20)*0.3;
            if(e.x>100)
            {
                this.imgX=100;
            }
            else if(e.x<0)
            {
                this.imgX=0;
            }

            this.imgY =e.y = (e.y)/this.qdpr-this.fix;
            if(e.y>this.bottom)
            {
                this.imgY=this.bottom;
            }
            else if(e.y<0)
            {
                this.imgY=0;
            }
        },
        recoveryCanvas(){
            var that = this;
            const dpr = wx.getSystemInfoSync().pixelRatio;
            this.qdpr =dpr;
            this.fix =30;
            this.range = "width:"+300*dpr+"px;height:"+150*dpr+"px;"
            if(dpr<3)
            {
                // this.qdpr =dpr*2;
                this.fix = 0;
                this.range = "width:"+300*dpr+"px;height:"+150*this.qdpr+100+"px;"
            }
            this.windowWidth = wx.getSystemInfoSync().windowWidth;
            this.windowHeight =wx.getSystemInfoSync().windowHeight;
            
			
            const query = wx.createSelectorQuery();
            query.select('#myCanvas')
            .fields({ node: true, size: true }) 
            .exec((res) => {
                this.canvas = res[0].node;
            
                let seal = this.canvas.createImage();
                console.log(dpr+"/"+this.canvas.width+"/"+this.canvas.height);
                console.log(dpr+"/"+this.windowWidth+"/"+this.windowHeight);
                this.ctx = this.canvas.getContext('2d');
                
                this.imgX =50-(10*this.qdpr - 20)/2 ;
                this.bottom = 140-10*this.qdpr;
                this.imgY = this.bottom;
                wx.getImageInfo({
                    src: this.picPath,
                    success:((res) => {
                        seal.src = res.path;
                        seal.onload = () => {
                            this.ctx.drawImage(seal,this.imgX, this.imgY, 20, 20);
                            this.image =seal;
                        }
                })});
                // this.ctx.scale(0.5, 0.5);
                
                this.ctx.fillStyle = '#1aad19' ;// 矩形颜色
                this.ctx.fillRect(50, 0, 20, 20);

                const rectX =  50;
                let rectY = 0;
                let ifBottom = false;
                this.interval = setInterval(()=>{
                    if(!ifBottom)
                    {
                        that.drawRect(rectX, rectY++,seal);
                    }
                    else{ 
                        that.drawRect(rectX, rectY--,seal);
                    }
                    
                    if(rectY>=120-10*this.qdpr) // 反弹y坐标
                    {
                        ifBottom = true;
                    }
                    else if(rectY<=0)
                    {
                        ifBottom = false;
                    }
                }, 16);
            });
        }
    },
    mounted(){
        this.recoveryCanvas();
    }
}
</script>
<style scoped>
.main{
    width: 100vw;
    height: 100vh;
}
</style>