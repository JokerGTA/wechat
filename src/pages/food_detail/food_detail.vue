<template>
    <div>
        <web-view :src="food_url" /> 
    </div>
</template>
<script>
export default {
    data() {
        return{
            isLoaded:false,
            food_url:"http://www.boohee.com/shiwu/pingguo_junzhi",
        }
    },
    methods: {
        //  获取方法
    getQuery() {
        /* 获取当前路由栈数组 */
        const pages = getCurrentPages()
        const currentPage = pages[pages.length - 1]
        const options = currentPage.options
        return options
        },
        // 调用方法
        getParameter() {
            this.food_url = this.getQuery()["url"];
            // console.log(this.food_url);
        }
    },
    mounted(){
         this.getParameter();
    }
}
</script>